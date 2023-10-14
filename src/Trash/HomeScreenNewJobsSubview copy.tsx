import * as React from 'react';
import { useState, Component } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Chip, List, TextInput } from 'react-native-paper';
import JobPostingRow from '../../../components/molecules/JobPostingRow';
import { getDistance } from 'geolib'
import { fetchApplicantProfileDataAPI } from '../../../apiService/firestoreApis/ApplicantProfileDataApi';
import { getJobPostInRange, getAppliedJobPostAPI, getApplicationforAppliedJobPostAPI } from '../../../apiService/firestoreApis/ApplicantJobPostApi';
import { bulkAddNewJobPosting, changePostingsLoaded, bulkAddNewJobPostingInDistanceOrder, addPosterProfileDataForJob } from '../../../store/ApplicantJobListingReducer';
import { addNewAppliedJobPosting, addAppliedJobApplication, changeAppliedJobsLoaded } from '../../../store/ApplicantAppliedJobPostingReducer';
import JobFeedCard from '../../../components/molecules/NewJobsJobFeedCard';
import { DotIndicator } from 'react-native-indicators';
import { fetchEmployerProfile } from '../../../apiService/firestoreApis/employerProfileApiFireStore';
import { EmployerProfileData } from '../../../store/ReducerAllDataTypes';
import {firstJobsFetch} from '../../../store/ApplicantJobListingReducer'
import { changeSalaryRangeLow, changeSalaryRangeHigh, resetAllFilters, setFulltimeToggle, setParttimeToggle, setInternshipToggle, filterJobs } from '../../../store/ApplicantJobListFilterReducer';
import { fetchChatUnreadStatus, fetchChatUnreadStatuses } from '../../../apiService/firestoreApis/Chat/ChatMessageApi';
import { markChatUnread } from '../../../store/ChatMessageReducer';
import messaging from '@react-native-firebase/messaging';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function HomeScreenNewJobsSubview() {

    const dispatch = useDispatch();
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const appliedJobsData = useSelector(state => state.applicantAppliedJobReducer);
    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const jobFilterData = useSelector(state => state.applicantJobListFilterReducer);
    const jobList = postInfo.postings;
    const filteredJobList = filterJobs(jobList, jobFilterData)

    const [jobListLoading, setJobListLoading] = useState(false);
    const [salaryRangeLow, setSalaryRangeLow] = useState(jobFilterData.salaryRangeLow.toString())
    const [salaryRangeHigh, setSalaryRangeHigh] = useState(jobFilterData.salaryRangeHigh.toString())
    const [partTimeFiltered, setPartTimeFiltered] = useState(jobFilterData.partTimeToggled)
    const [fullTimeFiltered, setFullTimeFiltered] = useState(jobFilterData.fullTimeToggled)
    const [internshipFiltered, setInternshipFiltered] = useState(jobFilterData.internshipToggled)
    const [filterExpended, setFilterExpended] = useState(false)

    async function applyFilter() {
        await dispatch(changeSalaryRangeLow(salaryRangeLow))
        await dispatch(changeSalaryRangeHigh(salaryRangeHigh))
        await dispatch(setFulltimeToggle(fullTimeFiltered))
        await dispatch(setParttimeToggle(partTimeFiltered))
        await dispatch(setInternshipToggle(internshipFiltered))
        setFilterExpended(false)
    }

    async function resetFilter() {
        await setFullTimeFiltered(true);
        await setPartTimeFiltered(true);
        await setInternshipFiltered(true);
        await dispatch(resetAllFilters()); 
    }

    const getPostData = () => { fetchApplicantProfileDataAPI(userInfo.id, async (data) => {
        const lat = await userInfo.latitude;
        const lng = await userInfo.longitude;

        dispatch(firstJobsFetch())

        // fetch all job posts
        let list = [];
        let distanceList = [];
        await getJobPostInRange([data.latitude, data.longitude], (post) => {
            for (let k of post) {
                // if (k.latestDateBumped == null) {
                //     k.latestDateBumped = k.datePosted
                // }

                let distance = getDistance({lat, lng}, {latitude: k.post.location.lat, longitude: k.post.location.lon}) / 1609;
                distance = Number(distance.toFixed(2));

                k.post.distanceToApplicant = distance;
                list.push(k.post);

                // fetch employer profile for each job post
                if (k.post.posterId) {
                    fetchEmployerProfile(k.post.posterId, async (err, data) => {
                        dispatch(addPosterProfileDataForJob(k.post.id, data));
                    }); 
                }       
            }

            // sort date in asc order
            list.sort((a, b) => (new Date(a.latestDateBumped).getTime() < new Date(b.latestDateBumped).getTime()) ? 1 : -1);
            
            // sort distance in asc order
            distanceList = [...list];
            distanceList.sort((a, b) => (a.distanceToApplicant > b.distanceToApplicant) ? 1 : -1);
            setJobListLoading(false);
        })

        dispatch(bulkAddNewJobPostingInDistanceOrder(distanceList));
        dispatch(bulkAddNewJobPosting(list));

        // fetch all applied job posts
        await getAppliedJobPostAPI(data.appliedJobs, (appliedPosts) => {
            if (appliedPosts) {
                for (let k of appliedPosts) {
                    dispatch(addNewAppliedJobPosting(k.post));
                }
            }
        })

        // fetch application for each job post
        await getApplicationforAppliedJobPostAPI(data.appliedJobs, (appliedPosts) => {
            if (appliedPosts) {
                for (let k of appliedPosts) {
                    dispatch(addAppliedJobApplication(k.postId, k.applicationData));
                    const appId = k.applicationData.app.id
                    fetchChatUnreadStatus(appId, true, (snapshot) => {
                        if (snapshot != null && snapshot.count != null && snapshot.count > 0) {
                            dispatch(markChatUnread(appId))
                        }
                    })
                }
            }
        })
        // console.log()
        // await fetchChatUnreadStatuses(
        //     jobList.map((post) => post.id),
        //     true,
        //     (jobApplicationId: string, snapshot) => {
        //         console.log("snapshot: " + JSON.stringify(snapshot))
        //         if (snapshot.count > 0) {
        //             dispatch(markChatUnread(jobApplicationId))
        //         }
        //     }
        // )

        dispatch(changeAppliedJobsLoaded(true));
        dispatch(changePostingsLoaded(true));
    })};

    React.useEffect(() => {
        if (jobList.length == 0 && appliedJobsData.postings.length == 0 && !postInfo.alreadyFetched) {
            setJobListLoading(true);
            getPostData();
        }
    }, []);

    const renderItem = ({item}) => {
        if (item.status == "DELETED" || item.status == "DEACTIVATED") {
            return 
        }
        return (
            <JobFeedCard data={item}/>
        )
    }

    // const [refreshing, setRefreshing] = React.useState(false);

    // const onRefresh = React.useCallback(async () => {
    //     setRefreshing(true);
    //     // fetch all job posts
    //     let list = [];
    //     const lat = await userInfo.latitude;
    //     const lng = await userInfo.longitude;
    //     await getJobPostInRange([lat, lng], (post) => {
    //         for (let k of post) {
    //             let distance = getDistance({lat, lng}, {latitude: k.post.location.lat, longitude: k.post.location.lon}) / 1609;
    //             distance = Number(distance.toFixed(2));

    //             k.post.distanceToApplicant = distance;
    //             list.push(k.post);

    //             // fetch employer profile for each job post
    //             if (k.post.posterId) {
    //                 fetchEmployerProfile(k.post.posterId, async (err, data) => {
    //                     dispatch(addPosterProfileDataForJob(k.post.id, data));
    //                 }); 
    //             }       
    //         }

    //         // sort date in asc order
    //         list.sort((a, b) => (new Date(a.latestDateBumped).getTime() < new Date(b.latestDateBumped).getTime()) ? 1 : -1)

    //         let filtered = filterJobs(list, jobFilterData)
    //         filtered.sort((a, b) => (new Date(a.latestDateBumped).getTime() < new Date(b.latestDateBumped).getTime()) ? 1 : -1);
    //         setFilteredJobList(filtered);
    //     })
    //     dispatch(bulkAddNewJobPosting(list));

    //     setJobListLoading(false);
    //     setRefreshing(false);
    // }, []);

    return (
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <List.Accordion 
                expanded={filterExpended}
                onPress={() => setFilterExpended(!filterExpended)}
                title="Job Filters" 
                style={{alignItems: 'center', justifyContent: 'center', alignContent:'center'}}
                titleStyle={{paddingLeft: 20, color: "gray"}}
            >
                <View style={{flexDirection: 'row', marginTop: 20, backgroundColor: 'transparent', justifyContent: 'space-evenly'}}>
                    <Chip selected={fullTimeFiltered} style={styles.chip} onPress={() => setFullTimeFiltered(!fullTimeFiltered)}>Full-time</Chip>
                    <Chip selected={partTimeFiltered} style={styles.chip} onPress={() => setPartTimeFiltered(!partTimeFiltered)} >Part-time</Chip>
                    <Chip selected={internshipFiltered} style={styles.chip} onPress={() => setInternshipFiltered(!internshipFiltered)} >Internship</Chip>
                </View>
                <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 20, marginBottom: 25, backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center', alignContent: 'center'}}>
                    <Text>Salary Range: </Text>
                    <TextInput label="Low" 
                        keyboardType='numeric' 
                        value={salaryRangeLow} 
                        onChangeText={setSalaryRangeLow} 
                        style={{width: '25%', height: 50}} />
                    <Text>to</Text>
                    <TextInput label="High" 
                        keyboardType='numeric' 
                        value={salaryRangeHigh} 
                        onChangeText={setSalaryRangeHigh} 
                        style={{width: '25%', height: 50}} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10}}>
                    <Button onPress={resetFilter} icon='close' labelStyle={{fontWeight: 'bold'}} mode="contained" color='red' style={{height: 55, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', borderRadius: 25}}>
                        Reset Filter
                    </Button>
                    <Button onPress={applyFilter} icon='check' labelStyle={{fontWeight: '600'}} mode="contained" color='blue' style={{height: 55, alignSelf: 'center', paddingHorizontal: 15, alignContent: 'center', justifyContent: 'center', borderRadius: 25}}>
                        Apply
                    </Button>
                </View>
                
            </List.Accordion>
            <ScrollView style={styles.container}
                // refreshControl={
                //     <RefreshControl
                //     refreshing={refreshing}
                //     onRefresh={onRefresh}
                //     />
                // }
                >
                { jobListLoading && <View style={styles.overlayView}>
                    <DotIndicator color='blue' />
                </View> }

                { !jobListLoading && filteredJobList && <FlatList style={styles.listContainer}
                        data={filteredJobList}
                        renderItem={renderItem}
                    /> }

                { !jobListLoading && !filteredJobList && 
                    <Text style={{fontSize: 25, fontWeight: '500', paddingLeft: 30, paddingRight: 20, paddingTop: 100}}>Cannot find any jobs nearby, check your internet connection. Contact support on bottom right if needed.</Text>
                    }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
    },
    overlayView: {
        width: '100%',
        height: '100%',
        marginTop: '50%',
        // justifyContent: 'center',
        // alignItems: 'center',
        position: 'absolute',
        opacity: 0.7,
        backgroundColor: 'transparent',
    },
})
