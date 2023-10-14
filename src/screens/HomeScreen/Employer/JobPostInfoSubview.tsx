import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { deleteJobPosting } from '../../../store/EmployerJobListingReducer';
import { deleteJobPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { addressToString } from '../../../apiService/firestoreApis/employerProfileApiFireStore';

export default function JobPostInfoSubview(data) {

    const jobPostId = data.data[0];
    const isInernship = data.data[1];
    const jobListingData = useSelector(state => state.employerJobListingReducer);
    const jobList = jobListingData.postings;
    const internList = jobListingData.internPostings;
    let jobPostData;

    if (isInernship) {
        internList.forEach((posting) => {
            if (posting.id == jobPostId) {
                jobPostData = posting
            }
        })
    } else {
        jobList.forEach((posting) => {
            if (posting.id == jobPostId) {
                jobPostData = posting
            }
        })
    }
    
    let full = jobPostData.isFulltime ? 1 : 0;
    let part = jobPostData.isParttime ? 1 : 0;
    let intern = jobPostData.isInternship ? 1 : 0;

    let jobType = '';
    if (full&&part&&intern) {
        jobType = 'Full-time / Part-time / Internship'
    } else if (full&&part) {
        jobType = 'Full-time / Part-time'
    } else if (full&&intern) {
        jobType = 'Full-time / Internship'
    } else if (part&&intern) {
        jobType = 'Part-time / Internship'
    } else if (full) {
        jobType = 'Full-time'
    } else if (part) {
        jobType = 'Part-time'
    } else if (intern) {
        jobType = 'Internship'
    }

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const userInfo = useSelector(state => state.employerProfileReducer).profileData;
    const userId = userInfo.id

    const renderAdditionalQuestions = (questionData, index) => {
        return (
            <View style={styles.additionalView}>
                <Text style={styles.additionalQuestionText}> {index + 1}. {questionData.questionText} </Text>
                <Text style={{paddingLeft: 15, paddingBottom: 15, fontSize: 15, fontWeight: '500'}}>Question Type: {questionData.questionType == 0 ? 'Text reponse' : 'Audio response'}</Text>
            </View>
        )
    }

    // const deleteJobPost = async () => {
    //     // AWS
    //     // deleteJobPostAPI(userId, data.id)

    //     // Firestore
    //     deleteJobPostAPI(userId, jobPostData.id);
    //     await dispatch(deleteJobPosting(jobPostData.id))
    //     navigation.navigate('Root')
    // }

    let address = '';
    addressToString(userInfo.address, (addr)  => {
        address = addr;
    })

    return(
        <ScrollView style={{marginBottom: 175}}>
            <View style={styles.locationView}>
                <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                    Location
                </Text>
                {/* <Text style={styles.detailText}>{userInfo.businessName}</Text> */}
                {!jobPostData.isRemote ? <Text style={styles.detailText}>{address}</Text> :
                <Text style={styles.detailText}>Remote</Text>}
            </View>
            <View style={styles.salaryView}>
                <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                    Job Type
                </Text>
                <Text style={styles.detailText}> {jobType} </Text>
            </View>
            <View style={styles.salaryView}>
                <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                    Salary Range
                </Text>
                <Text style={styles.detailText}>$ {jobPostData.salaryRangeLow} - $ {jobPostData.salaryRangeHigh} Hourly</Text>
            </View>
            <View style={styles.salaryView}>
                <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                    Work Hours / Week
                </Text>
                <Text style={styles.detailText}>{jobPostData.workHourLow} - {jobPostData.workHourHigh}  Hours</Text>
            </View>
            <View style={styles.detailView}>
                <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                    Job Description
                </Text>
                <Text style={styles.detailText}>
                    {jobPostData.roleDescription}
                </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 25,}}>
                <Text style={styles.title}>Application Questions</Text>
            </View>

            <View style={styles.additionalQuestionView}>
                {jobPostData.additionalQuestionTitles.length == 0 &&
                    <View style={{marginHorizontal: 30, marginTop: 20, paddingBottom: 50, justifyContent: 'center', alignContent: 'center'}}>
                        <Text style={{fontSize: 20, fontWeight: '500', alignSelf: 'center', textAlign: 'center'}}>You did not ask any application questions</Text>
                    </View>
                }
                <FlatList style={{marginBottom: 100}}
                    data={jobPostData.additionalQuestionTitles}
                    renderItem={({item, index}) => renderAdditionalQuestions(item, index)}
                />
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    locationView: {
        width: '90%',
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
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
    title: {
        fontSize: 26,
        marginBottom: 8,
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    additionalQuestionView: {
        backgroundColor: 'transparent',
        paddingBottom: 100
    },
    additionalView: {
        width: '90%',
        marginTop: 15,
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        color: 'yellow',
        paddingBottom: 15
    },
    additionalQuestionText: {
        fontSize: 20,
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 10,
        fontWeight: '600',
        flexWrap: 'wrap',
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
})
