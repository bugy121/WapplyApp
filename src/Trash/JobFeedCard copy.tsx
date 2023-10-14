import * as React from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../Themed';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { addressToString } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import Moment from 'moment';

// A reusable job post card component that shows on applicant homescreen 
export default function JobFeedCard(data) {
    const navigation = useNavigation();

    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const userLoc = [userInfo.latitude, userInfo.longitude];

    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(3);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(3);
    const [shadowRadius, setShadowRadius] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.2);

    const goToApplicationsDetailView = () => {
        // const newViews = data.data.views + 1;
        // updateJobPostViews(data.data.id, newViews, (err) => {
        //   if (err != null) {
        //     console.log(err)
        //     Alert.alert("updating view count of job post failed, please try again")
        //     return
        //   } else {
        //     data.data.views = newViews;
        //     navigation.navigate("ApplicantJobDetailView", {
        //         data: data.data
        //     })
        //   }
        // });
        navigation.navigate("ApplicantJobDetailView", {
            data: data.data
        })
    }

    // let distance = 0;
    // if (data.data.location) {
    //     const lat = data.data.location.lat;
    //     const lng = data.data.location.lon;

    //     // console.log('lat and long:', lat, lng );
    //     // console.log('user lat and long: ', userLoc);
    //     distance = getDistance({lat, lng}, {latitude: userLoc[0], longitude: userLoc[1]}) / 1609;
    //     distance = Number(distance.toFixed(2));
    //     // console.log('distance: ', distance);
    // }

    // const fontsize = data.data.roleName.length > 20 ? 15 : 20;

    let address = '';
    addressToString(data.data.address, (addr)  => {
        address = addr;
    })

    const dateDiff = computeDateDiff(data.data.datePosted);

    let postedDate = "";
    if (dateDiff == 0) {
        postedDate = "Today";
    } else if (dateDiff == 1) {
        postedDate = "1 day ago";
    } else {
        postedDate = dateDiff + " days ago";
    }

    return(
        <TouchableOpacity onPress={goToApplicationsDetailView}>
            <View style={[styles.container, {
                shadowOffset: {
                width: shadowOffsetWidth,
                height: shadowOffsetHeight
                },
                shadowOpacity,
                shadowRadius
            }]}>
                <View style={styles.header}>
                    <Text style={styles.roleNameText}> 
                        {data.data.roleName}
                    </Text>
                    <Text style={styles.businessInfoText}> 
                        {data.data.businessName}
                    </Text>
                </View>

                <View style={styles.locationView}>
                    <Ionicons name="location-sharp" size={22} color="gray" />
                    <Text style={styles.locationText}> 
                        {address}
                    </Text>
                </View>
                
                <View style={styles.salaryView}>
                    <FontAwesome5 name="money-bill" size={18} color="gray" />
                    <Text style={styles.salaryText}> 
                        ${data.data.salaryRangeHigh} an hour
                    </Text>
                </View>

                <View style={styles.otherDetailView}> 
                    <Ionicons name="send" size={18} color="blue" />
                    <Text style={styles.otherDetailText}>
                         Apply with your Wapply Profile
                    </Text>
                </View>

                <View style={styles.otherDetailView}> 
                    <FontAwesome5 name="clock" size={18} color="purple" />
                    <Text style={styles.otherDetailText}>
                        Urgent hiring
                    </Text>
                    <Ionicons name="ios-person-add" size={18} color="orange" />
                    <Text style={styles.otherDetailText}>
                        Multiple candidates
                    </Text>
                </View>

                <View style={styles.postedTimeView}>
                    <Text style={styles.postedTimeText}> 
                        {postedDate} • From {address}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 270,
        borderRadius: 15,
        marginVertical: '2%',
        marginLeft: '5%',
    },
    header: {
        width: '90%',
        height: '20%',
        marginLeft: '5%',
        marginTop: '4%',
    },
    roleNameText: {
        fontSize: 21,
        fontWeight: '700',
        marginBottom: '2%',
    },
    businessInfoText: {
        fontSize: 17,
        marginBottom: '2%',
    },
    locationView: {
        width: '90%',
        flexDirection: 'row',
        marginLeft: '4%',
        marginTop: '2%',
    },
    locationText: {
        fontSize: 16,
        marginLeft: '2%',
    },
    salaryView: {
        width: '37%',
        height: '13%',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginTop: '3%',
        marginLeft: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    salaryText: {
        fontSize: 16,
        marginLeft: '3%',
        fontWeight: '700',
        color: '#454545'
    },
    otherDetailView: {
        width: '90%',
        flexDirection: 'row',
        marginLeft: '5%',
        marginTop: '4%',
    },
    otherDetailText: {
        fontSize: 16,
        marginLeft: '3%',
        marginRight: '5%',
    },
    postedTimeView: {
        width: '90%',
        height: '10%',
        marginLeft: '5%',
        marginTop: '5%',
    },
    postedTimeText: {
        fontSize: 16,
        color: 'grey',
    }
})

export const computeDateDiff = (date) => {
    let today = Moment(Date()).format('MM/DD/YYYY');
    let formattedDate = Moment(date).format('MM/DD/YYYY')
    
    return Moment(today,"MM/DD/YYYY").diff(Moment(formattedDate,"MM/DD/YYYY")) / 86400 / 1000;
}