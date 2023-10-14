

import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Navigation from '../../../navigation';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'

export default function ApplicationReviewProfileSubview({applicationData}) {

    // console.log("subview parameter: " + JSON.stringify(applicationData))
    // console.log('data: ', applicationData);
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const link = applicationData.profilePicUrl
    const profileimg = link != "no image" ? {uri: link} : require('../../../../assets/images/profileimg.png')

    const renderEmploymentHistory = ({item, index}) => {
        return (
            <View style={styles.sectionView}>
                <Text style={{fontSize: 20, fontWeight: '600', paddingBottom: 10}}>Employment History {index + 1}</Text>
                <Text style={styles.detailText}>{item}</Text>
            </View>
        )
    }

    return(
        <View style={{height: 500, paddingBottom: 20}}>
        <ScrollView>
            <View style={[styles.sectionView, {alignItems: 'center'}]}>
                <FastImage
                    style={styles.profileImage}
                    source={profileimg}
                />
                <View>
                    <Text style={styles.sectionTitle}>{applicationData.firstName}</Text>
                    <Text style={styles.sectionTitle}>{applicationData.lastName}</Text>
                </View>
            </View>
            <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}>Personal Info</Text>
                <Text style={styles.detailText}>Age: {applicationData.age}</Text>
                <Text style={styles.detailText}>Email: {applicationData.email}</Text>
            </View>
            {applicationData.availability ? <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}>Availability</Text>
                {applicationData.availability['monday'].length > 0 && <Text style={styles.detailText}>Monday: {applicationData.availability['monday']}</Text>}
                {applicationData.availability['tuesday'].length > 0 && <Text style={styles.detailText}>Tuesday: {applicationData.availability['tuesday']}</Text>}
                {applicationData.availability['wednesday'].length > 0 && <Text style={styles.detailText}>Wednesday: {applicationData.availability['wednesday']}</Text>}
                {applicationData.availability['thursday'].length > 0 && <Text style={styles.detailText}>Thursday: {applicationData.availability['thursday']}</Text>}
                {applicationData.availability['friday'].length > 0 && <Text style={styles.detailText}>Friday: {applicationData.availability['friday']}</Text>}
                {applicationData.availability['saturday'].length > 0 && <Text style={styles.detailText}>Saturday: {applicationData.availability['saturday']}</Text>}
                {applicationData.availability['sunday'].length > 0 && <Text style={styles.detailText}>Sunday: {applicationData.availability['sunday']}</Text>}
            </View> : null}
            <View style={styles.sectionView}>
                <Text style={styles.sectionTitle}>Education</Text>
                <Text style={styles.detailText}>{applicationData.education}</Text>
            </View>
            <FlatList
                renderItem={renderEmploymentHistory}
                data={applicationData.employmentHistory}
            />
            <View style={{height: 100}} />
            {/* <View style={styles.sectionView}>
                <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 8}}>
                    Employment History
                </Text>
                <Text style={styles.detailText}>Employment History Detail 1</Text>
                <Text style={styles.detailText}>Employment History 2 Detail</Text>
            </View> */}
        </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 5
    },
    sectionView: {
        width: '90%',
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 15,
        paddingHorizontal: 20
    },
    detailText: {
        fontSize: 20,
        marginBottom: 5,
        flexWrap: 'wrap'
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
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 15
    },
})
