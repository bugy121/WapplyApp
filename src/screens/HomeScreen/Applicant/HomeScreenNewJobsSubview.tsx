import * as React from 'react';
import { useState, Component, useCallback } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Chip, List, TextInput } from 'react-native-paper';
import JobPostingRow from '../../../components/molecules/JobPostingRow';
import { computeDestinationPoint, getDistance } from 'geolib'
import { fetchApplicantProfileDataAPI } from '../../../apiService/firestoreApis/ApplicantProfileDataApi';
import { getJobPostInRange, getLinkPostInRange, getAppliedJobPostAPI, getApplicationforAppliedJobPostAPI } from '../../../apiService/firestoreApis/ApplicantJobPostApi';
import { bulkAddNewJobPosting, bulkAddNewLinkPost, changePostingsLoaded, bulkAddNewJobPostingInDistanceOrder, addPosterProfileDataForJob } from '../../../store/ApplicantJobListingReducer';
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
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/core';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { changeEmployerProfileData } from '../../../store/EmployerProfileReducer';
import { updateApplicantProfileData } from '../../../store/ApplicantProfileReducer';

export default function HomeScreenNewJobsSubview() {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const auth = getAuth();
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const appliedJobsData = useSelector(state => state.applicantAppliedJobReducer);
    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const jobFilterData = useSelector(state => state.applicantJobListFilterReducer);
    const jobList = postInfo.postings;
    const linkList = postInfo.linkPostings;
    const filteredJobList = filterJobs(jobList, jobFilterData)
    const filteredLinkPostList = filterJobs(linkList, jobFilterData);

    const [jobListLoading, setJobListLoading] = useState(false);
    const [salaryRangeLow, setSalaryRangeLow] = useState(jobFilterData.salaryRangeLow.toString())
    const [salaryRangeHigh, setSalaryRangeHigh] = useState(jobFilterData.salaryRangeHigh.toString())
    const [partTimeFiltered, setPartTimeFiltered] = useState(jobFilterData.partTimeToggled)
    const [fullTimeFiltered, setFullTimeFiltered] = useState(jobFilterData.fullTimeToggled)
    const [internshipFiltered, setInternshipFiltered] = useState(jobFilterData.internshipToggled)
    const [filterExpended, setFilterExpended] = useState(false)

    const [locationLoaded, setLocationLoaded] = useState(false)

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

    const getPostData = (curLat, curLng) => { fetchApplicantProfileDataAPI(userInfo.id, async (data) => {
        let lat = await userInfo.latitude;
        let lng = await userInfo.longitude;

        if (!lat) {
            lat = curLat
            lng = curLng
        }

        dispatch(firstJobsFetch())

        // fetch all job posts
        let list = [];
        let distanceList = [];


        await getJobPostInRange([lat, lng], (post) => {
            for (let k of post) {
                // if (k.latestDateBumped == null) {
                //     k.latestDateBumped = k.datePosted
                // }

                // check education requirement
                if (k.post.educationLevel && userInfo.educationLevel) {
                    if (k.post.educationLevel > userInfo.educationLevel) {
                        continue
                    }
                }

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
        })

        dispatch(bulkAddNewJobPostingInDistanceOrder(distanceList));
        dispatch(bulkAddNewJobPosting(list));

        // fetch all link posts
        let linkPostList = [];
        await getLinkPostInRange([lat, lng], (post) => {
            for (let k of post) {
                let distance = getDistance({lat, lng}, {latitude: k.post.location.lat, longitude: k.post.location.lon}) / 1609;
                distance = Number(distance.toFixed(2));

                k.post.distanceToApplicant = distance;
                if (k.post.status !=  "DELETED" && k.post.status != "DEACTIVATED") {
                    linkPostList.push(k.post);
                }

                // fetch employer profile for each job post
                if (k.post.posterId) {
                    fetchEmployerProfile(k.post.posterId, async (err, data) => {
                        dispatch(addPosterProfileDataForJob(k.post.id, data));
                    }); 
                }       
            }

            // sort date in asc order
            linkPostList.sort((a, b) => (new Date(a.latestDateBumped).getTime() < new Date(b.latestDateBumped).getTime()) ? 1 : -1);
            setJobListLoading(false);
        })
        dispatch(bulkAddNewLinkPost(linkPostList));

        if (!data) {
            console.log('return here')
            return
        }

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
        if (!locationLoaded) {
            const permission = Geolocation.requestAuthorization("whenInUse").then((val) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        if (jobList.length == 0 && appliedJobsData.postings.length == 0 && !postInfo.alreadyFetched) {
                            setJobListLoading(true);
                            getPostData(position.coords.latitude, position.coords.longitude);
                        }
                    },
                    (error) => {
                        // See error code charts https://github.com/Agontuk/react-native-geolocation-service.
                        Alert.alert("Failed to get location :( " + error)
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                );
            }).catch((err) => {
                Alert.alert("Requesting permission for location failed, please give access to location services in settings")
            })
            setLocationLoaded(true)
        }   

    }, []);

    const renderItem = ({item, index}) => {
        // did it in the filterJobs
        // if (item.status == "DELETED" || item.status == "DEACTIVATED") {
        //     return 
        // }

        return (
            <JobFeedCard data={item}/>
        )
    }

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
                    {/* <Chip selected={internshipFiltered} style={styles.chip} onPress={() => setInternshipFiltered(!internshipFiltered)} >Internship</Chip> */}
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
                    <Button onPress={resetFilter} icon='close' labelStyle={{fontWeight: 'bold'}} mode="contained" color='red' style={{height: 40, borderRadius: 15, justifyContent: 'center'}}>
                        <Text style={{fontSize: 16, color: 'white'}}> Reset </Text>
                    </Button>
                    <Button onPress={applyFilter} icon='check' labelStyle={{fontWeight: '600'}} mode="contained" color='#32bf45' style={{height: 40, borderRadius: 15, justifyContent: 'center'}}>
                       <Text style={{fontSize: 16, color: 'white'}}> APPLY Filter</Text>
                    </Button>
                </View>
                
            </List.Accordion>
            <ScrollView style={styles.container}>
                { jobListLoading && <View style={styles.overlayView}>
                    <DotIndicator color='blue' />
                </View> }

                { !jobListLoading && filteredJobList && <FlatList style={styles.listContainer}
                        data={filteredJobList}
                        renderItem={renderItem}
                    /> }

                { !jobListLoading && filteredLinkPostList && <FlatList style={styles.listContainer}
                        data={filteredLinkPostList}
                        renderItem={renderItem}
                    /> }

                { !jobListLoading && filteredJobList.length == 0 && filteredLinkPostList.length == 0 &&
                    <View style={{backgroundColor: 'transparent'}}> 
                        <Text style={{fontSize: 26, fontWeight: '500', paddingLeft: 30, paddingRight: 20, paddingTop: 100}}>Sorry.</Text>
                        <Text style={{fontSize: 24, fontWeight: '400', paddingLeft: 30, paddingRight: 20, paddingTop: 40}}>No jobs were found.</Text>
                    </View>
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
