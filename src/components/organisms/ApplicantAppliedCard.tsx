import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '../Themed';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { addressToStringLite } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import FastImage from 'react-native-fast-image'
import { computeDestinationPoint } from 'geolib';
import { Badge } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ApplicantAppliedCard(data) {
    const navigation = useNavigation();

    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(8);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(8);
    const [shadowRadius, setShadowRadius] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.15);

    const appliedJobData = useSelector(state => state.applicantAppliedJobReducer);
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const applicationList = appliedJobData.applications;
    const postId = data.data.id;
    const posterData = postInfo.postingsToEmployer[postId];

    
    let appData;

    if (Object.keys(applicationList[postId]).length == 1) {
        appData = applicationList[postId].app;
    } else {
        appData = applicationList[postId];
    }

    const chatNotificationData = useSelector(state => state.chatMessageReducer);
    const showUnreadMessages = chatNotificationData.chatStatuses[appData.id] != null && chatNotificationData.chatStatuses[appData.id] > 0


    var backgroundColor;

    if (appData.status.toLowerCase() == 'applied') {
        backgroundColor = '#52B9F9';
    } else if (appData.status.toLowerCase() == 'reject') {
        backgroundColor = '#ff7575';
    } else if (appData.status.toLowerCase() == 'accepted') {
        backgroundColor = '#4ce074';
    }

    const goToApplicationsDetailView = () => {
        navigation.navigate("AppliedJobDetailView", {
            data: data.data,
            status: appData.status.toLowerCase(),
        })
    }

    let link = "no image";
    const [logo, setLogo] = useState(link != "no image" ? {uri: link} : require('../../../assets/images/wapply-logo-gradient.png'));
    const [logoLoaded, setLogoLoaded] = useState(false);

    if (posterData) {
        link = posterData.profilePicUrl;
        if (link != 'no image' && !logoLoaded) {
            setLogoLoaded(true);
            setLogo({uri: link})
        } else if (!logoLoaded) {
            setLogoLoaded(true);
        }
    }

    let address = '';
    addressToStringLite(data.data.address, (addr)  => {
        address = addr;
    })
    
    return(
        <TouchableOpacity onPress={goToApplicationsDetailView} style={styles.content}>
            <View style={[styles.container, {
                shadowOffset: {
                width: shadowOffsetWidth,
                height: shadowOffsetHeight
                },
                shadowOpacity,
                shadowRadius
            }]}>
                
                <View style={styles.jobInfoView}> 
                    <View style={styles.logoView}> 
                        <FastImage source={logo} style={styles.logoImage} />
                    </View> 
                <View style={styles.positionView}> 
                    <Text style={styles.locationText}>{data.data.businessName} </Text>
                    <Text style={styles.title}>{data.data.roleName} </Text>
                </View>
                <View style={styles.statusView}> 
                    <TouchableOpacity style={[styles.statusButton, {backgroundColor: backgroundColor}]} onPress={goToApplicationsDetailView}>
                        <Text style={styles.statusButtonText}> {appData.status} </Text>
                    </TouchableOpacity>
                </View>
                </View>
                <View style={styles.additionalInfoView}>
                    <Text style={styles.addressText}> {address} </Text>
                    <View style={{flexDirection: 'row'}}> 
                        <Text style={styles.salaryText}> ${data.data.salaryRangeHigh}</Text>
                        <Text style={styles.salarySubText}>/hr </Text>
                    </View>
                </View> 
            </View>
            {showUnreadMessages &&
                        <Badge visible={true} size={20} style={{position: 'absolute', alignSelf: 'flex-end', alignContent: 'flex-start'}}> </Badge>
                    }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    content: {
        height: 130,
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 15,
        marginBottom: '7%',
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 15,
    },
    jobInfoView: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    logoView: {
        height: windowWidth * .2,
        width: windowWidth * .2,
        borderRadius: 15,
        paddingTop: 10,
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        height: '80%',
        width: '80%',
        borderRadius: 15,
    },
    positionView: {
        width: windowWidth * .46,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        padding: 10,
    },
    locationText: {
        fontSize: 16,
        color: '#969696',
    },
    title: {
        fontSize: 18,
        marginTop: 5,
        backgroundColor: 'white',
        fontWeight: 'bold'
    },
    statusView: {
        width: windowWidth * .25,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    statusButton: {
        height: 50,
        width: 90,
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 10,
        backgroundColor: '#969696',
    },
    statusButtonText: {
        color: 'white',
        fontWeight: "700",
        fontSize: 18
    },
    additionalInfoView: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    addressText: {
        fontSize: 16,
        color: '#969696',
        marginLeft: 20,
    },
    salaryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    salarySubText: {
        fontSize: 16,
        color: '#969696',
        marginRight: 20
    },
})