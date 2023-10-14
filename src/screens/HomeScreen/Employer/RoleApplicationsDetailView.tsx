import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteJobPostAPI, deleteInternPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { getJobApplicationsAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import JobPostInfoSubview from './JobPostInfoSubview';
import JobPostApplicantsSubview from './JobPostApplicantsSubview';
import { addApplicationData, deletePosting } from '../../../store/EmployerJobListingReducer';
import { deactivateJobPostAPI, deactivateInternPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { Ionicons, Foundation } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Colors, Button, Badge } from 'react-native-paper';
import { bumpJobPostAPI, bumpInternPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { bumpJobPosting } from '../../../store/EmployerJobListingReducer';
import Blank from '../../Blank';

export default function RoleApplicationsDetailView({route}) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const iconNames = ['page-multiple', 'folder']
    const jobPostDataId = route.params.jobPostDataId
    const jobListingData = useSelector(state => state.employerJobListingReducer);
    const jobList = jobListingData.postings;
    const internList = jobListingData.internPostings;
    let jobPostData;

    if (route.params.isInternship) {
        internList.forEach((posting) => {
            if (posting.id == jobPostDataId) {
                jobPostData = posting
            }
        })
    } else {
        jobList.forEach((posting) => {
            if (posting.id == jobPostDataId) {
                jobPostData = posting
            }
        })
    }
    
    const showNotificationBadge = route.params.showNotificationBadge

    const employerApplicationsData = useSelector(state => state.employerJobListingReducer);
    const applicationIds = employerApplicationsData.postingIdsToApplicationIds[jobPostDataId];
    // const employerApplicationsData = useSelector(state => state.employerApplicationsReducer);
    const dispatch = useDispatch();

    React.useEffect(() => {
        // If haven't fetched applications yet
        if (!(employerApplicationsData.postApplicationsLoaded.has(jobPostDataId))) {
            getJobApplicationsAPI(jobPostDataId, (err: string, applications) => {
                if (err != null) {
                    console.log(err)
                    return
                }
                // Dispatch 
                dispatch(addApplicationData(jobPostDataId, applications))
            })
        }
    }, [])

    const navigation = useNavigation();
    const interestToggleData = [];
    const [bumpPostLoading, setBumpPostLoading] = useState(false);

    const [apps, setApps] = useState([]);

    const layout = useWindowDimensions();

    const PostInfoRoute = () => (
        <JobPostInfoSubview data={[jobPostDataId, route.params.isInternship]} />
      );
      
    const ApplicationsRoute = () => (
        <JobPostApplicantsSubview jobPostId={jobPostDataId} isInternship={route.params.isInternship}/>
    );

    const BlankRoute = () => (
        <Blank/>
    )

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'applications', title: 'Applications' },
        { key: 'postInfo', title: 'Post Info' },
      ]);

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i)
        
        return (
            <View style={{flexDirection: 'row', height: 50, paddingHorizontal: 5}}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) =>
                        inputIndex === i ? 1 : 0.5
                        ),
                    });

                    return (
                        <TouchableOpacity
                            style={[{width: windowWidth / 2 - 5, height: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}, 
                                    (i == 0) ? {borderTopLeftRadius: 25, borderBottomLeftRadius: 25} : { borderTopRightRadius: 25, borderBottomRightRadius: 25},
                                    (i === index ? {backgroundColor: Colors.blueGrey400} : {backgroundColor: Colors.white})
                                    ]}
                            onPress={() => setIndex(i)}>
                            
                            <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                                <Foundation name={iconNames[i]} size={25} style={{paddingRight: 5}} color={(index === i) ? 'white': 'black'} />
                                <Animated.Text style={{ opacity, fontSize: 20, fontWeight: '600', color: (index === i) ? 'white': 'black' }}>{route.title}</Animated.Text>
                            </View>
                            {(showNotificationBadge && i == 0) &&
                                <Badge visible={true} size={20} style={{position: 'absolute', top: 0}}> </Badge>
                            }
                        </TouchableOpacity>
                    );
                })}
            </View>
        )
    }
    
    const renderScene = SceneMap({
        applications: ApplicationsRoute,
        postInfo: jobPostData ? PostInfoRoute : BlankRoute,
      });

    const userInfo = useSelector(state => state.employerProfileReducer).profileData;
    const userId = userInfo.id

    const loadApp = () => {
        getJobApplicationsAPI(jobPostDataId, (list) => {
            setApps(list);
        });
    }

    // get all applications for this job post
    React.useEffect(() => {
        if (!employerApplicationsData.postingsLoaded) {
            loadApp();
        }   
    }, [])

    const goBackToPrevScreen = () => {
        navigation.goBack()
    }

    const deactivatePost = () => {
        jobPostData.status = "DEACTIVATED"

        if (route.params.isInternship) {
            deactivateInternPostAPI(jobPostData, (err: string) => {
                if (err != null) {
                    Alert.alert("Deactivate intern post failed!")
                } else {
                    Alert.alert("Deactivate intern post successful!")
                }
            })
        } else {
            deactivateJobPostAPI(jobPostData, (err: string) => {
                if (err != null) {
                    Alert.alert("Deactivate post failed!")
                } else {
                    Alert.alert("Deactivate post successful!")
                }
            })
        }
    }

    const deletePost = () => {
        jobPostData.status = "DELETED"

        if (route.params.isInternship) {
            deleteInternPostAPI(jobPostData, (err: string) => {
                if (err != null) {
                    console.log('Delete intern post failed!');
                    console.log(err);
                    Alert.alert("Delete intern post failed!")
                } else {
                    navigation.navigate('Root');
                    dispatch(deletePosting(jobPostDataId))
                    Alert.alert("Delete internship post successful!")
                }
            })
        } else {
            deleteJobPostAPI(jobPostData, (err: string) => {
                if (err != null) {
                    console.log('Delete post failed!');
                    console.log(err);
                    Alert.alert("Delete post failed!")
                } else {
                    navigation.navigate('Root');
                    dispatch(deletePosting(jobPostDataId))
                    Alert.alert("Delete post successful!")
                }
            })
        }
    }

    const deactivatePostTapped = () => {
        Alert.alert(
            "Deactivate Post",
            "Are you sure? Currently deactivated posts cannot be activated again but post information can be still viewed for reference (Applicants can no longer find this after deactivating)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: deactivatePost,
                    style: 'default'
                }
            ]
        )
    }

    const deletePostButtonTapped = () => {
        Alert.alert(
            "Delete Job Post",
            "Are you sure? (Neither you nor applicants will be able to see this post after)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: deletePost,
                    style: 'destructive'
                }
            ]
        )
    }

    function bumpPostPressed() {
        setBumpPostLoading(true)
        const bumpedDate = Date()

        if (route.params.isInternship) {
            bumpInternPostAPI(jobPostDataId, bumpedDate, (err) => {
                setBumpPostLoading(false)
    
                if (err != null) {
                    Alert.alert("Bump job post failed :(")
                    return
                }
                Alert.alert("Successfully bumped/updated job post! This post is now fresh for applicants 🎉")
                // dispatch(bumpJobPosting(jobPostDataId, bumpedDate))
            }) 
        } else {
            bumpJobPostAPI(jobPostDataId, bumpedDate, (err) => {
                setBumpPostLoading(false)
    
                if (err != null) {
                    Alert.alert("Bump job post failed :(")
                    return
                }
                Alert.alert("Successfully bumped/updated job post! This post is now fresh for applicants 🎉")
                dispatch(bumpJobPosting(jobPostDataId, bumpedDate))
            }) 
        }
    }

    function editJobPostPressed() {
        navigation.navigate('EmployerEditJobPost', {
            jobPostDataId: jobPostDataId
        })
    }

    let creationDate = '';
    let latestDateBumped = '';
    let status = '';
    let roleName = '';
    let eduLevel = '';
    if (jobPostData) {
        creationDate = jobPostData.datePosted.split(" ")[1] + " " + jobPostData.datePosted.split(" ")[2] +
            ", " + jobPostData.datePosted.split(" ")[3];
        latestDateBumped = jobPostData.latestDateBumped.split(" ")[1] + " " + jobPostData.latestDateBumped.split(" ")[2] +
        ", " + jobPostData.latestDateBumped.split(" ")[3];
        status = jobPostData.status;
        roleName = jobPostData.roleName;

        if (jobPostData.educationLevel) {
            if (jobPostData.educationLevel == 1)
                eduLevel = 'Everyone';
            if (jobPostData.educationLevel == 2)
                eduLevel = 'Some High School Education';
            if (jobPostData.educationLevel == 3)
                eduLevel = 'Graduated High School Education';
            if (jobPostData.educationLevel == 4)
                eduLevel = 'Some College Education';
            if (jobPostData.educationLevel == 5)
                eduLevel = 'Graduated College Education';
        } 
    }
    

    return(
        <View style={{marginTop: 60}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20}}>
                <TouchableOpacity
                    onPress={goBackToPrevScreen}
                    style={{paddingLeft: 15, marginBottom: 10}}
                >
                    <Ionicons name="chevron-back" size={22} color="black" />
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    {(status == "ACTIVE") &&
                        <TouchableOpacity onPress={deactivatePostTapped}>
                            <Text style={{fontSize: 20, color: 'orange', paddingRight: 40}}>Deactivate</Text>
                        </TouchableOpacity>}
                    <TouchableOpacity onPress={deletePostButtonTapped}>
                        <Text style={{fontSize: 20, color: 'red'}}>Delete</Text>
                    </TouchableOpacity>
                </View>

            </View>


            <View style={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '65%', paddingRight: 5}}>
                    <Text style={styles.title}>{roleName}</Text>
                    <Text style={styles.content}>Posted On: {creationDate}</Text>
                    <Text style={styles.content}>Latest Bump: {latestDateBumped}</Text>
                    <Text style={styles.content}>Post Status: <Text style={{fontWeight: 'bold'}}>{status == "ACTIVE" ? "Active" : "Deactived"}</Text></Text>
                    <Text style={styles.content}>Applications: {applicationIds != null ? applicationIds.length : 0}</Text>
                    <Text style={styles.content}>Who can apply: {eduLevel}</Text>
                </View>
                <View style={{width: '100%'}}>
                    <Button color={Colors.green500} labelStyle={{fontSize: 18, color: 'white'}} onPress={bumpPostPressed} mode='contained' loading={bumpPostLoading} style={{borderRadius:25, height: 40, width: '35%', justifyContent: 'center'}} >
                        Bump
                    </Button>
                    <Button icon='pencil-outline' color={Colors.blue400} labelStyle={{fontSize: 18, color: 'white'}} onPress={editJobPostPressed} mode='contained' loading={bumpPostLoading} style={{borderRadius:25, height: 40, width: '35%', justifyContent: 'center', marginTop: 20}} >
                        Edit
                    </Button>
                </View>
                
            </View>
            <View style={{height: '90%'}}>
                <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
                />
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 26,
        marginBottom: 8,
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    content: {
        fontSize: 16,
        marginBottom: 5
    },
    image: {
        flex: 1,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    employmentType: {
        fontSize: 22,
        borderLeftColor: 'white',
        borderLeftWidth: 2,
    },
    salaryView: {
        width: '90%',
        height: 90,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
    detailView: {
        width: '90%',
        height: 190,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    },
    detailText: {
        fontSize: 20, 
        marginBottom: 10, 
        marginLeft: 15,
    },
    applicantScrollView: {
        width: '90%',
        marginLeft: '5%',
        borderRadius: 15,
        paddingLeft: 20, 
        paddingRight: 20, 
        backgroundColor: 'white'
    },
    deleteButton: {
        width: '80%',
        height: 80,
        marginTop: 40,
        marginBottom: 40,
        marginLeft: '10%',
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 32,
        color: 'red',
        fontFamily: 'AcherusGrotesque-Bold',
    },
    additionalQuestionView: {
        backgroundColor: 'transparent'
    },
    additionalView: {
        width: '90%',
        height: 70,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    },
    additionalQuestionText: {
        fontSize: 20, 
        marginTop: 15,
        marginBottom: 10, 
        marginLeft: 15,
        fontWeight: '600',
    },
    viewAppButton: {
        height: 50,
        width: 140,
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#52B9F9',
        borderRadius: 25,
    },
    viewAppText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '700',
    }
})