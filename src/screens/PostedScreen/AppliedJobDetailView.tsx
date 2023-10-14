import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FlatList, View, Text, Alert, StyleSheet, ImageBackground,
    TouchableOpacity, Button, Image, ActionSheetIOS } from 'react-native';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import window from '../../constants/Layout';
import JobTitleTags from '../../components/atoms/JobTitleTags';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import ProgressIndicator from '../../components/molecules/ProgressIndicator';
import { database } from '../../constants/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button as PaperButton, Colors as PaperColors, List, Badge} from 'react-native-paper'
import openMap, { createOpenLink, createMapLink } from 'react-native-open-maps';
import MapView, { Marker } from 'react-native-maps';
import FastImage from 'react-native-fast-image'
import Colors from '../../constants/Colors';
import { bumpJobAppAPI } from '../../apiService/firestoreApis/ApplicantJobPostApi';
import { bumpJobApp } from '../../store/ApplicantAppliedJobPostingReducer';
import { editReferralCoinsAPI } from '../../apiService/firestoreApis/ReferralCodeApi';
import { updateApplicantCoins } from '../../store/ApplicantProfileReducer';


const windowHeight = window.window.height;
const windowWidth = window.window.width;

export default function AppliedJobDetailView({route}) {
    const dispatch = useDispatch();

    const jobPostData = route.params?.data
    const navigation = useNavigation();

    const appliedJobData = useSelector(state => state.applicantAppliedJobReducer);
    const postInfo = useSelector(state => state.applicantJobListingReducer);

    const userData = useSelector(state => state.applicantProfileReducer).profileData;
    const bumpCost = 100;

    const employerProfileData = postInfo.postingsToEmployer[jobPostData.id];
    const applicationList = appliedJobData.applications;
    const appData = applicationList[jobPostData.id].app;
    const bumped = appData.hasOwnProperty('priority') && appData.priority === true;

    const chatNotificationData = useSelector(state => state.chatMessageReducer);
    const showUnreadMessages = chatNotificationData.chatStatuses[appData.id] != null && chatNotificationData.chatStatuses[appData.id] > 0

    const profileImageURL = require('../../../assets/images/profileimg.png')

    var backgroundColor;
    if (appData.status.toLowerCase() == 'applied') {
        backgroundColor = '#52B9F9';
    } else if (appData.status.toLowerCase() == 'reject') {
        backgroundColor = '#ff7575';
    } else if (appData.status.toLowerCase() == 'accepted') {
        backgroundColor = '#4ce074';
    }

    const [mapViewExpanded, setMapViewExpanded] = useState(true)
    const [mapLocation, setMapLocation] = useState({
        latitude: employerProfileData.location.lat != null ? employerProfileData.location.lat : 0.0,
        longitude: employerProfileData.location.lon != null ? employerProfileData.location.lon : 0.0,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    });

    // get logo
    let link = "no image";
    const [logo, setLogo] = useState(link != "no image" ? {uri: link} : require('../../../assets/images/wapply-logo-gradient.png'));
    const [logoLoaded, setLogoLoaded] = useState(false);

    if (employerProfileData) {
        link = employerProfileData.profilePicUrl;
        if (link != 'no image' && !logoLoaded) {
            setLogoLoaded(true);
            setLogo({uri: link})
        } else if (!logoLoaded) {
            setLogoLoaded(true);
        }
    }

    const goBackToPrevScreen = () => {
        navigation.goBack()
    }

    let address = '';
    address += jobPostData.address.streetAddr + ', ' + jobPostData.address.city;

    const openAppleMap = createOpenLink({provider: 'apple', query: address});
    const openGoogleMap = createOpenLink({provider: 'google', query: address});

    const openMapNavigation = () =>
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Cancel', 'Navigate by Apple Map', 'Navigate by Google Map'],
            cancelButtonIndex: 0,
        },
        buttonIndex => {
            if (buttonIndex === 0) {
            // cancel action
            } else if (buttonIndex === 1) {
                openAppleMap();
            } else if (buttonIndex === 2) {
                openGoogleMap();
            }
        }
    );

    function goToChatMessageScreen() {
        navigation.navigate('ApplicantChatMessage', {
            employerProfileData: employerProfileData,
            applicationData: appData
        })
    }

    function bumpAlert() {
        Alert.alert(
            "Bump Post",
            `Do you want to bump this application? (Balance: ${userData.coins})`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: bumpPressed,
                    style: 'default'
                }
            ]
        )
    }

    function bumpPressed() {
      if (userData.hasOwnProperty('coins')) {
        const currCoins = userData.coins;
        console.log(appData)
        if (appData.hasOwnProperty('priority') && appData.priority === true) {
          Alert.alert('You have already bumped this application!')
        } else if (currCoins < bumpCost) {
          Alert.alert('Not enough coins!\nEarn coins by referring your friends!')
        } else {
          bumpJobAppAPI(appData.id, true, (err) => {

              if (err != null) {
                  Alert.alert("Bump job application failed :(")
                  return
              }
              Alert.alert("Successfully bumped job application! Your application is now prioritized for review! 🎉")
              dispatch(bumpJobApp(jobPostData.id, true))
          })
          editReferralCoinsAPI(userData.id, -bumpCost, (err) => {
              if (err != null) {
                  Alert.alert("Update coins value failed :(")
                  return
              }
              const newCoins = userData.coins - bumpCost;
              dispatch(updateApplicantCoins(newCoins))
          })
        }
      }
    }

    return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
    <TouchableOpacity
        onPress={goBackToPrevScreen}
        style={{paddingLeft: '5%'}}
    >
        <Ionicons name="chevron-back" size={22} color="black" />
    </TouchableOpacity>
    <ScrollView style={styles.container}>
            <View style={{backgroundColor: backgroundColor, height: 25, width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}> {appData.status} </Text>
            </View>

                <TouchableOpacity onPress={goToChatMessageScreen} style={[styles.shadowContainer, {alignSelf: 'center', marginVertical: 15, borderRadius: 25, height: '15%', width: '90%', justifyContent: 'center',}, showUnreadMessages ? {backgroundColor:'#90EE90'} : {backgroundColor: 'white'}]}>
                    <View style={{flexDirection: 'row', flexShrink: 1, justifyContent: 'space-evenly', width: '100%', height: '100%'}}>
                        <FastImage source={profileImageURL} style={{width: '35%'}} />
                        <View style={{justifyContent: 'space-around', width: '60%', paddingLeft: 5, height: '90%'}}>
                            {showUnreadMessages ?
                            <Text style={{fontSize: 17, textAlign: 'center', alignItems: 'center', paddingTop: 10}}>
                                Unread messages from {jobPostData.businessName}
                            </Text>
                            :
                            <Text style={{fontSize: 17, textAlign: 'center', alignItems: 'center', paddingTop: 10}}>
                                View chat {jobPostData.businessName}
                            </Text>}
                            <View style={{width: '100%', alignSelf: 'center'}}>
                                <PaperButton icon='message' color={PaperColors.blue300} mode='contained' style={{height: 40, width: '100%', alignSelf: 'center', justifyContent: 'center', borderRadius: 20}} labelStyle={{textAlign: 'center'}} >
                                    View Messages
                                </PaperButton>
                                {showUnreadMessages &&
                                <Badge visible={true} size={12} style={{position: 'absolute', alignSelf: 'flex-end'}}> </Badge>
                                }

                            </View>

                        </View>
                    </View>
                </TouchableOpacity>

                {userData.hasOwnProperty('coins') ? !bumped ?
                <PaperButton icon='exclamation' color={PaperColors.blue300} mode='contained' style={{height: 40, width: '80%', alignSelf: 'center', justifyContent: 'center', borderRadius: 20}} labelStyle={{textAlign: 'center'}} onPress={bumpAlert} >
                Bump Application ({bumpCost} Coins)
                </PaperButton> : 
                <View style={{height: 40, width: '60%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#32bf45'}}> 
                    <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold' }}> Application Bumped </Text>
                </View> :
                null }

            <View style={styles.headerView}>
                <View style={styles.logoView}>
                    <FastImage
                        style={styles.logoImg}
                        source={logo}
                    />
                </View>

                <View style={styles.jobInfoView}>
                    <View style={styles.jobTitleView}>
                        <Text style={styles.jobTitleText}>
                            {jobPostData.businessName}
                        </Text>
                    </View>
                    <View style={styles.jobRoleView}>
                        <Text style={styles.jobRoleText}>
                            {jobPostData.roleName}
                        </Text>
                    </View>
                    <View style={styles.jobSalaryView}>
                        <Text style={styles.jobSalaryText}> $  {jobPostData.salaryRangeLow} - {jobPostData.salaryRangeHigh}</Text>
                        <Text style={styles.jobSalarySubtext}> Per Hour </Text>
                    </View>
                    <View style={styles.jobLocationView}>
                        <Ionicons name="location-sharp" size={16} color="#3E989C" />
                        <Text style={styles.jobLocationText}> {address} </Text>
                    </View>
                    <View style={styles.jobTypeView}>
                        <Ionicons name="ios-briefcase-outline" size={16} color="#3E989C" style={{marginRight: 1}} />
                        {jobPostData.isFulltime && <Text style={styles.jobTypeText}> Full-Time </Text>}
                        {jobPostData.isParttime && <Text style={styles.jobTypeText}> Part-Time </Text>}
                        {jobPostData.isInternship && <Text style={styles.jobTypeText}> Internship </Text>}
                    </View>
                </View>
            </View>

            {/* <ProgressIndicator state={route.params?.status} /> */}

            <Divider
                style={styles.dividerView}
                color='#C5CDD9'
                orientation="horizontal"
                width={1} />

            <View style={styles.jobDescriptionView}>
                <Text style={styles.jobDescriptionTitleText}>
                    Job Description
                </Text>
                <Text style={styles.jobDescriptionText}>
                    {jobPostData.roleDescription}
                </Text>
            </View>

            <Divider
                style={styles.dividerView}
                color='#C5CDD9'
                orientation="horizontal"
                width={1} />

            <View style={{paddingHorizontal: '5%', paddingTop: '5%', borderRadius: 25, marginBottom: 100}}>
            <List.Accordion
              title="View Business Location"
              style={{backgroundColor: 'white', paddingHorizontal: '5%', paddingTop: -30}}
              left={props => <List.Icon {...props} icon="map-marker" />}
              expanded={mapViewExpanded}
              onPress={() => setMapViewExpanded(!mapViewExpanded)}
              titleStyle={{color: 'black', borderRadius: 25, fontSize: 18}}
              >
                <TouchableOpacity style={styles.mapViewStyle} onPress={openMapNavigation}/>
                    <MapView
                        pitchEnabled={false}
                        rotateEnabled={false}
                        zoomEnabled={false}
                        scrollEnabled={false}
                        initialRegion={mapLocation}
                        style={styles.map}
                    >
                        <Marker
                            coordinate={mapLocation}
                        >
                            <Image
                            style={{borderRadius: 45, height: 50, width: 50}}
                            source={logo}
                            />
                        </Marker>
                    </MapView>

            </List.Accordion>
            </View>
    </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: '5%',
        backgroundColor: 'white',
    },
    headerView: {
        flexDirection: 'row',
        height: 180,
    },
    dividerView: {
        width:'85%',
        marginTop: 10,
        marginLeft: '7.5%'
    },
    logoView: {
        width: '30%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImg: {
        width: 70,
        height: 70,
        borderRadius: 15,
    },
    jobInfoView: {
        width: '70%',
    },
    jobTitleView: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: -5,
    },
    jobTitleText: {
        padding: 5,
        fontSize: 16,
        color: '#8B9CA8',
    },
    jobRoleView: {
        width: '100%',
        height: 30,
        marginBottom: 10,
    },
    jobRoleText: {
        padding: 5,
        fontSize: 18,
        color: 'black',
    },
    jobSalaryView: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
    },
    jobSalaryText: {
        padding: 5,
        fontSize: 16,
        color: '#3E989C',
    },
    jobSalarySubtext: {
        padding: 5,
        paddingLeft: 0,
        fontSize: 16,
        color: '#8B9CA8',
    },
    jobLocationView: {
        width: '100%',
        padding: 5,
        height: 30,
        flexDirection: 'row',
    },
    jobLocationText: {
        fontSize: 16,
        marginLeft: 5,
        color: '#6F8394',
    },
    jobTypeView: {
        width: '100%',
        padding: 5,
        height: 30,
        flexDirection: 'row',
    },
    jobTypeText: {
        fontSize: 16,
        marginLeft: 5,
        color: '#6F8394',
    },
    jobDescriptionView: {
        padding: '5%',
        paddingLeft: '7.5%',
    },
    jobDescriptionTitleText: {
        fontSize: 16,
        color: '#6F8394',
        marginBottom: 10,
    },
    jobDescriptionText: {
        fontSize: 16,
        color: 'black',
    },
    mapViewStyle: {
        marginTop: 70,
        height: 340,
        width: '100%',
        zIndex: 2,
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    map: {
        marginLeft: "5%",
        width: '90%',
        height: 350,
        zIndex: 1,
    },
    applyButton: {
        width: '70%',
        height: 70,
        marginLeft: '15%',
        marginTop: 40,
        backgroundColor: '#613BFA',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 22,
        marginVertical: 10,
        fontWeight: '600',
        color: 'white'
    },
    shadowContainer:{
        padding:20,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1
        }
       },
})
