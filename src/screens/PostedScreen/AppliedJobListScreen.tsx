import * as React from 'react';
import { useState } from 'react'
import { StyleSheet, ScrollView, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useSelector, useDispatch } from 'react-redux';
import ApplicantAppliedCard from '../../components/organisms/ApplicantAppliedCard';
import { DotIndicator } from 'react-native-indicators';
import { applicantFunFacts } from '../../constants/Funfacts';
import FastImage from 'react-native-fast-image';
import { getAppliedJobPostAPI, getApplicationforAppliedJobPostAPI } from '../../apiService/firestoreApis/ApplicantJobPostApi';
import { addNewAppliedJobPosting, addAppliedJobApplication } from '../../store/ApplicantAppliedJobPostingReducer';
import { fetchChatUnreadStatus } from '../../apiService/firestoreApis/Chat/ChatMessageApi';
import { markChatUnread } from '../../store/ChatMessageReducer';
import { changeAppliedJobsLoaded } from '../../store/ApplicantAppliedJobPostingReducer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function AppliedJobListScreen() {
    const dispatch = useDispatch();

    const appliedJobData = useSelector(state => state.applicantAppliedJobReducer);
    const userData = useSelector(state => state.applicantProfileReducer).profileData;
    const postData = appliedJobData.postings;
    const applicationData = appliedJobData.applications;
    const funFactImageURL = require("../../../assets/images/fun-fact.png")
    const chosenFunFact = applicantFunFacts[getRandomInt(applicantFunFacts.length)]

    const [isLoadingData, setIsLoadingData] = useState(true);

    // fetch all applied job posts
    React.useEffect(() => {
        if (postData.length == 0) {
            getAppliedData()
        }
    }, [])

    const getAppliedData = (async () => {
        await getAppliedJobPostAPI(userData.appliedJobs, async (appliedPosts) => {
            if (appliedPosts) {
                for (let k of appliedPosts) {
                    await dispatch(addNewAppliedJobPosting(k.post));
                }
            }
        })

        // fetch application for each job post
        await getApplicationforAppliedJobPostAPI(userData.appliedJobs, (appliedPosts) => {
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
    
        await dispatch(changeAppliedJobsLoaded(true));
    })
    
    if (appliedJobData.postingsLoaded && isLoadingData && postData) {
        setIsLoadingData(false);

        postData.sort(function(a,b){
            return new Date(applicationData[b.id].app.dateApplied) - new Date(applicationData[a.id].app.dateApplied);
          });
    }

    const renderItem = ({item}) => {
        return (
            <ApplicantAppliedCard data={item}/>
        )
    }

    function renderNoAppliedJobsView() {
        return (
            <View style={{backgroundColor: 'transparent', alignItems: 'center'}}>
                <Text style={{fontSize: 20, paddingHorizontal: 20, paddingBottom: 50, paddingTop: 50, textAlign: 'center'}}>You have not applied to any jobs yet. Opportunities to make <Text style={{color: 'green'}}>$$</Text> are <Text style={{fontWeight: 'bold'}}>minutes away</Text>.</Text>
                <View style={{alignItems: 'center', backgroundColor: 'transparent'}}>
                    <FastImage source={funFactImageURL} style={{height: windowHeight / 5, width: windowWidth / 2}} />
                    <Text style={{paddingHorizontal: 30, fontSize: 20, fontWeight: '300'}}>{chosenFunFact}</Text>
                </View>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{marginTop: '10%'}}>
                <Text style={styles.title}>
                    Applied Jobs
                </Text>
            </View>

            { !isLoadingData && <View style={styles.content}>
                {/* {postList ? <FlatList style={styles.listContainer}
                    data={Object.keys(postList)}
                    renderItem={
                    ({item, index}) =>
                        <JobPostCard data={postList[item]}/>
                    }
                /> :
                <Text> You don't have any applied Jobs! </Text> } */}
                <FlatList style={styles.listContainer}
                    data={postData}
                    renderItem={renderItem}
                />
            </View> }

            { isLoadingData &&
            <View style={styles.overlayView}>
                <DotIndicator color='blue' />
            </View>}

            { postData.length == 0 && !isLoadingData &&
                renderNoAppliedJobsView()
            }

        </ScrollView>
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
    content: {
        backgroundColor: 'transparent',
    },
    listContainer: {
        flex:1,
        padding: 16
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
    noJobsView: {
        height: '20%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
