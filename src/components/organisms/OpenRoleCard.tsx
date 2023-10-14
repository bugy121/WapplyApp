import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Divider } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { addNewJobAppliedAPI } from '../../apiService/realtimeDB/realtimeDBApi';
import { useNavigation } from '@react-navigation/core';
import { getJobApplicationsAPI } from '../../apiService/firestoreApis/EmployerJobPostApi';
import { Badge } from 'react-native-paper';
import { AppEventsLogger } from "react-native-fbsdk-next";

const img = require('../../../assets/images/blankbg.png');

export default function OpenRoleCard({data: jobPostData}) {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    // console.log("\n open card data: " + JSON.stringify(jobPostData))

    const userInfo = useSelector(state => state.employerProfileReducer).profileData
    const postInfo = useSelector(state => state.employerJobListingReducer);
    
    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(8);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(8);
    const [shadowRadius, setShadowRadius] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.15);

    const applicationIds = postInfo.postingIdsToApplicationIds[jobPostData.id]

    const chatNotificationStatuses = useSelector(state => state.chatMessageReducer).chatStatuses;
    let showNotificationBadge = false;
    if (applicationIds != undefined && applicationIds != null) {
        applicationIds.forEach((appId) => {
            if (chatNotificationStatuses[appId] > 0) {
                showNotificationBadge = true
            }
        })
    }


    const cardData = jobPostData.getJobPostingData || jobPostData

    const goToApplicationsDetailView = () => {
        navigation.navigate("RoleApplicationsDetailView", {
            jobPostDataId: cardData.id,
            showNotificationBadge: showNotificationBadge,
            isInternship: cardData.isInternship
        })
    }

    // const loadApp = () => {
    //     getJobApplicationsAPI(jobPostData.data.id, (list) => {
    //         if (list) {
    //             setNumapps(list.length);
    //         }
    //     });
    // }

    // get all applications for this job post
    // React.useEffect(() => {
    //     if (numapps == -1) {
    //         setNumapps(0);
    //         loadApp();
    //     }
    // })
    let latestDateBumped = cardData.latestDateBumped.split(" ")[1] + " " + cardData.latestDateBumped.split(" ")[2] +
    ", " + cardData.latestDateBumped.split(" ")[3]

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
                <ImageBackground 
                    source={img} 
                    resizeMode="cover" 
                    style={styles.image}
                    imageStyle={{ borderRadius: 15}}>
                    <View style={{backgroundColor: 'transparent', width: '70%'}}> 
                        <Text style={styles.title}>{cardData.roleName} </Text>
                        <Divider 
                            style={{marginBottom: '5%'}}
                            orientation="horizontal" 
                            width={1} />
                        <Text style={styles.content}>Updated: {latestDateBumped} </Text>
                        <Text style={styles.content}>Job Post {cardData.status == 'ACTIVE' ? "Active" : "Inactive"} </Text>
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 35, fontWeight: 'bold'}}>
                                { (applicationIds ? applicationIds.length : 0) }
                            </Text>
                            <Text>
                                Applicants
                            </Text>
                    </View>

                </ImageBackground>
            </View>
            {showNotificationBadge &&
                        <Badge visible={true} size={20} style={{position: 'absolute', alignSelf: 'flex-end', alignContent: 'flex-start', top: 20}}> </Badge>
                    }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        backgroundColor: 'white',
        fontWeight: 'bold'
    },
    content: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 5
    },
    image: {
        flex: 1,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
})