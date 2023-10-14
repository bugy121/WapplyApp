import * as React from 'react';
import { useState, Component } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Chip, List, TextInput } from 'react-native-paper';
import { getDistance } from 'geolib'
import { fetchApplicantProfileDataAPI } from '../../../apiService/firestoreApis/ApplicantProfileDataApi';
import { getInternJobPostAPI } from '../../../apiService/firestoreApis/ApplicantJobPostApi';
import { bulkAddNewInternPost, changeInternPostingsLoaded, addPosterProfileDataForJob } from '../../../store/ApplicantJobListingReducer';
import { addNewAppliedJobPosting, addAppliedJobApplication, changeAppliedJobsLoaded } from '../../../store/ApplicantAppliedJobPostingReducer';
import JobFeedCard from '../../../components/molecules/NewJobsJobFeedCard';
import { DotIndicator } from 'react-native-indicators';
import { fetchEmployerProfile } from '../../../apiService/firestoreApis/employerProfileApiFireStore';
import { changeSalaryRangeLow, changeSalaryRangeHigh, resetAllFilters, setFulltimeToggle, setParttimeToggle, setInternshipToggle, 
    filterJobs, setInpersonToggle, setRemoteToggle } from '../../../store/ApplicantJobListFilterReducer';
import { fetchChatUnreadStatus, fetchChatUnreadStatuses } from '../../../apiService/firestoreApis/Chat/ChatMessageApi';
import { markChatUnread } from '../../../store/ChatMessageReducer';

export default function InternshipPostScreen() {

    const dispatch = useDispatch();
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const jobList = postInfo.internPostings;

    const [jobListLoading, setJobListLoading] = useState(false);

    const getPostData = () => { fetchApplicantProfileDataAPI(userInfo.id, async (data) => {
        // fetch all job posts
        let list = [];
        await getInternJobPostAPI([userInfo.latitude, userInfo.longitude], (post) => {
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
        })
        dispatch(bulkAddNewInternPost(list));
        dispatch(changeInternPostingsLoaded(true));
        setJobListLoading(false);
    })};

    React.useEffect(() => {
        if (!postInfo.internPostingsLoaded) {
            setJobListLoading(true);
            getPostData();
        }
    }, []);

    const renderItem = ({item, index}) => {
        return (
            <JobFeedCard data={item}/>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <ScrollView style={styles.container}>
                <View style={{marginTop: '10%'}}>
                    <Text style={styles.title}>
                        Internships
                    </Text>
                </View>

                { jobListLoading && <View style={styles.overlayView}>
                    <DotIndicator color='blue' />
                </View> }

                { !jobListLoading && jobList && <FlatList style={styles.listContainer}
                        data={jobList}
                        renderItem={renderItem}
                    /> }

                { !jobListLoading && jobList.length == 0 &&
                    <View style={{backgroundColor: 'transparent'}}> 
                        <Text style={{fontSize: 26, fontWeight: '500', paddingLeft: 30, paddingRight: 20, paddingTop: 100}}>Sorry.</Text>
                        <Text style={{fontSize: 24, fontWeight: '400', paddingLeft: 30, paddingRight: 20, paddingTop: 40}}>No internship jobs were found.</Text>
                    </View>
                    }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 30,
        marginTop: 30,
        marginBottom: 20,
        marginHorizontal: 30,
        fontWeight: '500',
        fontFamily: 'Verdana',
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
