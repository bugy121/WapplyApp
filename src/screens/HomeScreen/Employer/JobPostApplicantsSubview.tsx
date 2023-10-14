import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Dimensions } from 'react-native';
import Navigation from '../../../navigation';
import { useNavigation } from '@react-navigation/native';
import { getJobApplicationsAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { addApplicationData } from '../../../store/EmployerJobListingReducer';
import { timeSince } from '../../../util/DateHelper';
import FastImage from 'react-native-fast-image'
import { Button, Colors, ActivityIndicator, Badge } from 'react-native-paper'
import { updateApplicationData } from '../../../apiService/firestoreApis/EmployerJobPostApi'
import {updateApplicationData as updateApplicationDataReducer} from '../../../store/EmployerJobListingReducer'
import { employerFunFacts } from '../../../constants/Funfacts';
import { json } from 'stream/consumers';
import messaging from '@react-native-firebase/messaging';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const applicationStatusSortComparator = (app1, app2) => {
    const app1Data = app1.app
    const app2Data = app2.app
    if (app1Data.hasOwnProperty('priority') && app1Data.priority === true) {
        return -1
    } else if (app2Data.hasOwnProperty('priority') && app2Data.priority === true) {
        return 1
    } else if (app1Data.status == "Applied") {
        return -1
    } else if (app2Data.status == "Applied") {
        return 1
    } else if (app1Data.status == "Accepted") {
        return -1
    } else if (app2Data.status == "Accepted") {
        return 1
    }
    return 0
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function JobPostApplicantsSubview({jobPostId, isInternship}) {

    const jobListingData = useSelector(state => state.employerJobListingReducer)
    let applications = jobListingData.postingIdsToApplications[jobPostId]

    const chosenFunFact = employerFunFacts[getRandomInt(employerFunFacts.length)]
    const funFactImageURL = require('../../../../assets/images/fun-fact.png')

    const navigation = useNavigation();
    const dispatch = useDispatch()
    const acceptLoadingStates = []
    const rejectLoadingStates = []
    if (applications != undefined) {
        applications.forEach((e) => {
            acceptLoadingStates.push(useState(false))
            rejectLoadingStates.push(useState(false))
        })

        applications.sort(applicationStatusSortComparator)
        // const awaitingReviewApplications = applications.filter(({app}) => {
        //     return app.status === "Applied"
        // })

        // const acceptedApplications = applications.filter(({app}) => {
        //     console.log("\n should be true: " + app.status === "Accepted")
        //     return app.status === "Accepted"
        // })

        // const rejectedApplications = applications.filter(({app}) => {
        //     return app.status === "Reject"
        // })

        // console.log("\n accepted applications: " + JSON.stringify(acceptedApplications))
    }

    const chatNotificationStatuses = useSelector(state => state.chatMessageReducer).chatStatuses;

    React.useEffect(() => {
        if (!jobListingData.postApplicationsLoaded.has(jobPostId)) {
            getJobApplicationsAPI(jobPostId, (err, applications) => {
                if (err != null) {
                    console.log(err)
                    return
                }
                dispatch(addApplicationData(jobPostId, applications))
            })
        }
    }, [])

    const onPressCell = (applicationId: string) => {
        // subscribe to this job post
        messaging()
        .subscribeToTopic(applicationId + '-employer')
        .then(() => console.log('Subscribed to job post with id: ', applicationId + '-employer'))
        .catch((err) => console.log('Cannot subscribed to job post with id: ', applicationId + '-employer'));

        navigation.navigate('RootApplicantReview', {
            applicationId: applicationId,
            jobPostId: jobPostId,
            isInternship: isInternship
        })
    }

    function acceptApplication(index: number) {
        acceptLoadingStates[index][1](true)
        let thisApp = applications[index]
        thisApp.app.status =  "Accepted"
        applications[index] = thisApp
        updateApplicationData(thisApp.app, (err) => {
            acceptLoadingStates[index][1](false)
            if (err != null) {
                Alert.alert("Error: " + err)
                return
            }
            dispatch(updateApplicationDataReducer(jobPostId, applications))
        })
    }

    function acceptPressed(index: number) {
        Alert.alert(
            "Accept Application",
            "Are you sure? This action cannot be reversed",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: () => acceptApplication(index),
                    style: 'destructive'
                }
            ]
        )
    }

    function rejectApplication(index: number) {
        rejectLoadingStates[index][1](true)
        let thisApp = applications[index]
        thisApp.app.status =  "Reject"
        applications[index] = thisApp
        updateApplicationData(thisApp.app, (err) => {
            rejectLoadingStates[index][1](false)
            if (err != null) {
                Alert.alert("Error: " + err)
                return
            }
            dispatch(updateApplicationDataReducer(jobPostId, applications))
        })
    }

    function rejectPressed(index: number) {
        Alert.alert(
            "Reject Application",
            "Are you sure? This action cannot be reversed",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: () => rejectApplication(index),
                    style: 'default'
                }
            ]
        )
    }

    const renderApplicationRow = ({item, index}) => {
        const app = item.app
        const timeString = timeSince(Date.parse(app.dateApplied))
        const link = app.profilePicUrl
        const profileimg = link != "no image" ? {uri: link} : require('../../../../assets/images/profileimg.png')
        const showUnreadMessages = chatNotificationStatuses[app.id] > 0
        return (
            <TouchableOpacity onPress={() => onPressCell(app.id)} style={{backgroundColor: 'white', borderRadius: 10, marginVertical: 5, marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 20}}>
                {showUnreadMessages &&
                        <Badge visible={true} size={20} style={{position: 'absolute', alignSelf: 'flex-end', alignContent: 'flex-start'}}> </Badge>
                    }
                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                          {/* profile header */}
                          <View style={{flexDirection: 'row'}}>
                              <FastImage
                                  style={styles.profileImage}
                                  source={profileimg}
                              />
                              <View>
                                  <Text style={styles.detailText}>{app.firstName}</Text>
                                  <Text style={styles.detailText}>{app.lastName}</Text>
                              </View>
                          </View>

                          {/* bottom info */}
                          <Text style={{paddingTop: 10}}>Applied {timeString} ago</Text>
                      </View>

                      {app.status == "Applied" &&
                      <View style={{alignContent: 'center', justifyContent: 'center'}}>
                          <Button icon='newspaper-variant-outline' mode='contained' style={{borderRadius: 20, backgroundColor: Colors.blue300, height: 70, justifyContent: 'center'}} labelStyle={{fontSize: 20, color: Colors.white}} >
                            Review
                          </Button>
                          {/* <Text style={{color: Colors.blue500, fontSize: 28, paddingRight: 10, fontWeight: '600'}}>Review
                          </Text> */}
                      </View>}
                      {app.status == "Accepted" &&
                      <View style={{alignContent: 'center', justifyContent: 'center'}}>
                          <Text style={{color: Colors.green500, fontSize: 28, paddingRight: 10, fontWeight: '600'}}>Accepted</Text>
                      </View>
                      }
                      {app.status == "Reject" &&
                      <View style={{alignContent: 'center', justifyContent: 'center'}}>
                          <Text style={{color: Colors.red500, fontSize: 28, paddingRight: 10, fontWeight: '600'}}>Rejected</Text>
                      </View>
                      }
                  </View>

                  <View>
                    {app.status == "Applied" &&
                    <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                        <Button icon='check' mode='contained' onPress={() => acceptPressed(index)} color={Colors.lightGreen600} loading={acceptLoadingStates[index][0]}
                            style={{width: 120, height: 40, justifyContent: 'center', borderRadius: 25}} >
                            Accept
                        </Button>
                        <Button icon='close' mode='contained' onPress={() => rejectPressed(index)} color={Colors.red400} loading={rejectLoadingStates[index][0]}
                            style={{width: 120, height: 40, justifyContent: 'center', borderRadius: 25}} >
                            Reject
                        </Button>
                    </View>}
                  </View>
                </View>

            </TouchableOpacity>
        )
    }

    function renderViewNoApplications() {
        return (
            <View style={{backgroundColor: 'transparent',  marginHorizontal: 20, alignItems: 'center', marginTop: 20}}>
                {/* TODO: tell employers to bump their jobs after we implemented the bump feature */}
                <Text style={{fontSize: 20, paddingHorizontal: 10, paddingBottom: 50}}>No applications just yet :(</Text>
                <View style={{alignItems: 'center', backgroundColor: 'transparent'}}>
                    <FastImage source={funFactImageURL} style={{height: windowHeight / 5, width: windowWidth / 2}} />
                    <Text style={{paddingHorizontal: 30, fontSize: 20, fontWeight: '300'}}>{chosenFunFact}</Text>
                </View>
            </View>
        )
    }

    return(
        <View style={{marginTop: 10}}>
            {/* <View style={{flexDirection: 'row'}}>
                <Text style={styles.title}>Awaiting Review</Text>
                <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'gray', width: 35, height: 35, borderRadius: 35, marginLeft: 10}}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>{applications != null ? applications.length : 0}</Text>
                </View>
            </View> */}

            {(applications == null || applications == undefined || applications.length > 0) ?
                <FlatList
                    data={applications}
                    renderItem={renderApplicationRow}
                />
                :
                renderViewNoApplications()
            }
{/*
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.title}>Awaiting Review</Text>
                <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'gray', width: 35, height: 35, borderRadius: 35, marginLeft: 10}}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>{applications != null ? applications.length : 0}</Text>
                </View>
            </View> */}
            {(applications == undefined || applications == null) &&
                <ActivityIndicator size={'large'} animating={true} color={Colors.green600} style={{justifyContent: 'center', alignSelf: 'center', alignContent: 'center', paddingTop: 50}} />
            }

        </View>

    )

}

const styles = StyleSheet.create({
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
        fontSize: 18,
        marginLeft: 15,
    },
    title: {
        fontSize: 20,
        marginTop: 15,
        marginBottom: 8,
        marginLeft: 20,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        //lol this shit doesnt not work fuck react native
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
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
    profileImage: {
        backgroundColor: 'transparent',
        width: 60,
        height: 60,
        borderRadius: 60,
    },
})
