import * as React from 'react';
import { StyleSheet, ScrollView, Alert, Dimensions, Platform, Linking } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector, } from 'react-redux';
import OpenRoleCard from '../../../components/organisms/OpenRoleCard';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { getLinkPostAPI, getPostedJobPostAPI, getInternPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { bulkAddNewJobPosting, bulkAddLinkPost, bulkAddInternPost } from '../../../store/EmployerJobListingReducer';
import { getApplicationIds } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { addPostApplicationIdMapping } from '../../../store/EmployerJobListingReducer';
import { changePostingsLoaded } from '../../../store/EmployerJobListingReducer';
import { Button, Colors, FAB } from 'react-native-paper';
import { Portal, Provider, Button as PaperButton, Modal as PaperModal } from 'react-native-paper';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {employerFunFacts} from '../../../constants/Funfacts'
import { DotIndicator } from 'react-native-indicators';
import messaging from '@react-native-firebase/messaging';
import FastImage from 'react-native-fast-image';
import { openComposer } from "react-native-email-link";
import { fetchChatUnreadStatuses } from '../../../apiService/firestoreApis/Chat/ChatMessageApi';
import { markChatUnread } from '../../../store/ChatMessageReducer';
import OutOfAppPostCard from '../../../components/organisms/OutOfAppPostCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export default function EmployerHomeScreen() {
    const dispatch = useDispatch();
    const jobListingData = useSelector(state => state.employerJobListingReducer);
    const userInfo = useSelector(state => state.employerProfileReducer).profileData;
    const jobList = jobListingData.postings;
    const linkList = jobListingData.linkPostings;
    const internList = jobListingData.internPostings;

    const [loadingJobPost, setLoadingJobPost] = useState(false);
    const [loadingLinkPost, setLoadingLinkPost] = useState(false);
    const [loadingInternPost, setLoadingInternPost] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false)
    const funFactImageURL = require('../../../../assets/images/fun-fact.png')

    const chosenFunFact = employerFunFacts[getRandomInt(employerFunFacts.length)]

    const getPostData = async () => {
        // fetch all posted job posts
        let jobPostDataList = [];
        // console.log("\n job ids: " + JSON.stringify(userInfo.jobPostIds))
        await getPostedJobPostAPI(userInfo.jobPostIds, (posts) => {
            if (posts) {
                for (let k of posts) {
                    console.log("post id: " + k.post.id + "\n postData: " + JSON.stringify(k.post))
                    jobPostDataList.push(k.post);
                }
            }
        })
        dispatch(bulkAddNewJobPosting(jobPostDataList));
        dispatch(changePostingsLoaded(true));
        setLoadingJobPost(false);

        if (jobPostDataList.length == 0) {
            setLoadingJobPost(false);
        }

        let linkPostList = [];
        await getLinkPostAPI(userInfo.linkPostIds, (post) => {
            if (post) {
                for (let k of post) {
                    linkPostList.push(k.post);
                }
            }
        })
        
        dispatch(bulkAddLinkPost(linkPostList));
        setLoadingLinkPost(false);

        let internPostList = [];
        await getInternPostAPI(userInfo.internPostIds, (post) => {
            if (post) {
                for (let k of post) {
                    internPostList.push(k.post);
                }
            }
        })
        
        dispatch(bulkAddInternPost(internPostList));
        setLoadingInternPost(false);

        if (jobPostDataList.length == 0 && linkPostList.length == 0) {
            console.log("No jobs are posted!")
            setLoadingLinkPost(false);
            return;
        }

        // Fetch job id to application ids mapping, do not fetching all data yet
        for await (const jobPostData of jobPostDataList) {
            // console.log("\nFetched job: " + JSON.stringify(jobPostData))
            getApplicationIds(jobPostData.id, (err: string, applicationIds: [string]) => {
                if (err != null) {
                    console.log(err)
                    return
                }
                //Fetch chat read/unread statuses
                fetchChatUnreadStatuses(applicationIds, false, (jobApplicationId, snapshot) => {
                    if (snapshot != null && snapshot.count != null && snapshot.count > 0) {
                        dispatch(markChatUnread(jobApplicationId))
                    }
                })
                // console.log("\n fetched applications ids: " + applicationIds)
                dispatch(addPostApplicationIdMapping(jobPostData.id, applicationIds))
            })
        }
        
        // Fetch internship job post ids
        for await (const jobPostData of internPostList) {
            // console.log("\nFetched job: " + JSON.stringify(jobPostData))
            getApplicationIds(jobPostData.id, (err: string, applicationIds: [string]) => {
                if (err != null) {
                    console.log(err)
                    return
                }
                //Fetch chat read/unread statuses
                fetchChatUnreadStatuses(applicationIds, false, (jobApplicationId, snapshot) => {
                    if (snapshot != null && snapshot.count != null && snapshot.count > 0) {
                        dispatch(markChatUnread(jobApplicationId))
                    }
                })
                // console.log("\n fetched applications ids: " + applicationIds)
                dispatch(addPostApplicationIdMapping(jobPostData.id, applicationIds))
            })
        }
    }

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
    }
    
    async function checkApplicationPermission() {
        const authorizationStatus = await messaging().requestPermission({
            // sound: true,
            // announcement: false,
            // badge: true,
            // carPlay: true,
            // provisional: false,
            // alert: true,
            providesAppNotificationSettings: true, // set this to true provides a wapply notification button in settings
        });
      
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          console.log('User has notification permissions enabled.');
        } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
          console.log('User has provisional notification permissions.');
        } else {
          console.log('User has notification permissions disabled');
        }
    }

    React.useEffect(() => {
        setLoadingJobPost(true);
        setLoadingLinkPost(true);
        setLoadingInternPost(true)
        // console.log("\n postings loaded: " + postingsData.postingsLoaded)
        if (!jobListingData.postingsLoaded) {
            getPostData();
        } else {
            setLoadingJobPost(false);
            setLoadingLinkPost(false);
            setLoadingInternPost(false)
        }

        requestUserPermission();
        checkApplicationPermission();

        // Find FCM device token
        // messaging().getToken().then((token) => {
        //     console.log('token', token);
        // });

        // Foreground message handler
        // const unsubscribe = messaging().onMessage(async remoteMessage => {
        //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // });
        // return unsubscribe;
    }, []);

    async function emailSupportPressed() {
        // const operator = Platform.OS === "ios" ? "&" : "?";
        // const emailSubject = `[Wapply] Applicant support inquiry`;
        // const emailUrl =`mailto:wapplyjobsearch@gmail.com${operator}subject=${emailSubject}`;
        // await Linking.openURL(emailUrl);
        openComposer({
            title: "Wapply support inquiry from " + userInfo.businessName,
            to: "wapplyjobsearch@gmail.com"
        })
    }

    const renderOpenRoleCards = ({item}) => {
        if (item.status == "DELETED") {
            return
        }
        return (
            <OpenRoleCard data={item}/>
        )
    }

    const renderOutOfAppCards = ({item}) => {
        if (item.status == "DELETED") {
            return
        }
        return (
            <OutOfAppPostCard data={item}/>
        )
    }

    function renderNoJobsView() {
        return (
            <View style={{backgroundColor: 'transparent'}}>
                <Text style={{fontSize: 20, paddingHorizontal: 10, paddingBottom: 50}}> You haven't post any job yet! Go to second tab to create a posting. </Text>
                <View style={{alignItems: 'center', backgroundColor: 'transparent'}}>
                    <FastImage source={funFactImageURL} style={{height: windowHeight / 5, width: windowWidth / 2}} />
                    <Text style={{paddingHorizontal: 30, fontSize: 20, fontWeight: '300'}}>{chosenFunFact}</Text>
                </View>
            </View>
        )
    }

    return (
        <Provider>
        <ScrollView style={styles.container}>
            <SafeAreaView>
                <Text style={styles.date}> 
                    Hello, {userInfo.firstName} {userInfo.lastName}
                </Text>
                <Text style={styles.title}> 
                    Open Roles
                </Text>
                {/* <TouchableOpacity style={{paddingHorizontal: 10}}>
                    <Text style={{fontSize: 15, color: 'blue'}}>View Example Templates >></Text>
                </TouchableOpacity> */}
            </SafeAreaView>
            
            { loadingJobPost ? <View style={styles.overlayView}>
                <DotIndicator color='blue' />
            </View> : 
            jobList.length > 0 ? <View style={styles.content}> 
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, borderBottomWidth: 2}}> Job Posts </Text>
                <FlatList style={styles.listContainer}
                    data={jobList}
                    renderItem={renderOpenRoleCards}
                />
            </View> : null }

            { loadingLinkPost ? <View style={styles.overlayView}>
                <DotIndicator color='blue' />
            </View> : 
            linkList.length > 0 ? <View style={styles.content}> 
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, borderBottomWidth: 2}}> External Link Posts </Text>
                <FlatList style={styles.listContainer}
                    data={linkList}
                    renderItem={renderOutOfAppCards}
                />
            </View> : null }

            { loadingInternPost ? <View style={styles.overlayView}>
                <DotIndicator color='blue' />
            </View> : 
            internList.length > 0 ? <View style={styles.content}> 
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, borderBottomWidth: 2}}> Internship Posts </Text>
                <FlatList style={styles.listContainer}
                    data={internList}
                    renderItem={renderOpenRoleCards}
                />
            </View> : null }

            { jobList.length == 0 && linkList.length == 0 && internList.length == 0 && <View style={styles.content}> 
                {renderNoJobsView()}
            </View> }

        </ScrollView>
        <FAB
            style={styles.fab}
            icon="face-agent"
            onPress={() => setShowSupportModal(true)}
        />
        <Portal>
            <PaperModal visible={showSupportModal} onDismiss={() => setShowSupportModal(false)} >
                {/* <View style={{}}>
                    <Text>Example Modal.  Click outside this area to dismiss.</Text>
                </View> */}
                <Card style={{width: '60%', alignSelf: 'center', borderRadius: 25}}>
                    <Card.Content>
                        <Title style={{fontWeight: '800'}}>Contact support</Title>
                        <Paragraph style={{fontSize: 20, paddingVertical: 10, fontWeight: '600'}}>Phone</Paragraph>
                        <Paragraph style={{fontSize: 14}}>
                        9AM - 1PM (907-978-1983)
                        </Paragraph>
                        <Paragraph style={{fontSize: 14}}>
                        1PM - 5PM (805-403-8868)
                        </Paragraph>
                        <Paragraph style={{fontSize: 14}}>
                        5PM - 9PM (510-384-8598)
                        </Paragraph>
                        <Paragraph style={{fontSize: 20, paddingVertical: 10, fontWeight: '600'}}>Email</Paragraph>
                        <Paragraph style={{fontSize: 14}}>
                        wapplyjobsearch@gmail.com
                        </Paragraph>
                        <Button icon='email' onPress={emailSupportPressed} mode='contained' color={Colors.greenA200} style={{marginTop: 20, borderRadius: 25}}>
                            Email Support
                        </Button>
                    </Card.Content>
                </Card>
            </PaperModal>
        </Portal>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20
    },
    date: {
        fontSize: 14,
        marginTop: 30,
        marginBottom: 10,
        marginHorizontal: 10,
        fontWeight: '300',
        fontFamily: 'Verdana',
        color: 'gray',
    },
    title: {
        fontSize: 30,
        marginHorizontal: 10,
        fontWeight: '500',
        fontFamily: 'Verdana',
    },
    content: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    listContainer: {
        flex:1,
        padding: 16
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
    },
})