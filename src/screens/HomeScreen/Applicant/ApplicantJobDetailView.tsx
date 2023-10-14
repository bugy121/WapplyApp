import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FlatList, View, Text, Alert, StyleSheet, ImageBackground,
    TouchableOpacity, Button, Image,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Touchable, ActionSheetIOS } from 'react-native';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import window from '../../../constants/Layout';
import JobTitleTags from '../../../components/atoms/JobTitleTags';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { verifyApplicantProfileFilled } from '../../../util/FormValidation';
import { addressToString } from '../../../apiService/firestoreApis/employerProfileApiFireStore';
import FastImage from 'react-native-fast-image'
import { Button as PaperButton, Colors as PaperColors, List} from 'react-native-paper'
import { Avatar, Card, Title, Paragraph, Provider, Portal, Modal as PaperModal, TextInput } from 'react-native-paper';
import { reportJobPost } from './../../../apiService/firestoreApis/ReportApi'
import { Platform } from 'react-native';
import { Chip } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import openMap, { createOpenLink, createMapLink } from 'react-native-open-maps';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { computeDateDiff } from '../../../components/molecules/NewJobsJobFeedCard';
import BeautyWebView from 'react-native-beauty-webview';
import WebView from 'react-native-webview';

const windowHeight = window.window.height;
const windowWidth = window.window.width;

export default function ApplicantJobDetailView({route}) {

    const navigation = useNavigation();
    const jobPostData = route.params.data
    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const appliedJobsData = useSelector(state => state.applicantAppliedJobReducer);
    const posterData = postInfo.postingsToEmployer[jobPostData.id];
    const appliedJobsList = appliedJobsData.postings;

    const { showActionSheetWithOptions } = useActionSheet();

    const [showReportModal, setShowReportModal] = useState(false)
    const [reportMessage, setReportMessage] = useState("")
    const [sendReportLoading, setSendReportingLoading] = useState(false)
    const [mapViewExpanded, setMapViewExpanded] = useState(true)

    const [mapLocation, setMapLocation] = useState({
        latitude: jobPostData.location.lat != null ? jobPostData.location.lat : 0.0,
        longitude: jobPostData.location.lon != null ? jobPostData.location.lon : 0.0,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    });
    // get logo
    let link = "no image";
    const [logo, setLogo] = useState(link != "no image" ? {uri: link} : require('../../../../assets/images/wapply-logo-gradient.png'));
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

    let benefitsList = [];
    if (jobPostData.roleBenefits && jobPostData.roleBenefits.length != 0 && jobPostData.roleBenefits != undefined) {
        benefitsList = jobPostData.roleBenefits.split("\n");
    }

    const renderRoleBenefit = ({ item }) => {
        if (item.length == 0) {
            return
        }
      return (
        <Chip
          style={styles.roleBenefitChip}>
            {item}
        </Chip>
      )
    }

    let alreadyApplied = false;
    for (let post of userInfo.appliedJobs) {
      if (post.postId == jobPostData.id) {
        alreadyApplied = true
      }
    }

    const goBackToPrevScreen = () => {
        navigation.goBack()
    }

    const applyJobTapped = () => {
        // const verifyErrs = verifyApplicantProfileFilled(userInfo)
        // if (verifyErrs != null) {
        //     Alert.alert(verifyErrs)
        //     return
        // }

        // check if the applicant has exceeded the app num limit
        // if (appliedJobsList.length > 10) {
        //     Alert.alert('You can only have 10 job applications at the same time!');
        //     return
        // }

        // check if the applicant filled education and age
        if (!userInfo.age && (!userInfo.firstName || !userInfo.lastName)) {
            Alert.alert("Please fill out your name and age on your profile page before applying for any jobs!");
            navigation.navigate("Profile");
            return
        }
        else if (!userInfo.age) {
            Alert.alert("Please fill out your age information on your profile page before applying for any jobs!");
            navigation.navigate("Profile");
            return
        }
        else if (!userInfo.firstName || !userInfo.lastName) {
            Alert.alert("Please fill out your names on your profile page before applying for any jobs!");
            navigation.navigate("Profile");
            return
        } else if (!userInfo.educationLevel) {
            Alert.alert("Please fill out your education level on your profile page before applying for any jobs!");
            navigation.navigate("Profile");
            return
        }

        navigation.navigate("ApplicantJobApplicationView", { data: jobPostData })
    }

    const signInToApply = () => {
        navigation.navigate("Profile");
    }

    const [visible, setVisible] = useState(false);
    const applyExternalJobTapped = () => {
        setVisible(true);
    }

    const reportButtonPressed = () => {
        setShowReportModal(true)
    }

    const attemptToSendReport = () => {
        setSendReportingLoading(true)
        if (reportMessage.length == 0) {
            Alert.alert("Please include a report message")
            setSendReportingLoading(false)
            return
        }
        //Check to see if this user has already reported

        // Call api
        reportJobPost(jobPostData, userInfo.id, reportMessage, (err: string) => {
            setSendReportingLoading(false)
            if (err != null) {
                Alert.alert("Send report error: " + err)
                if (err === "Already reported this job. Report will be reviewed and processed soon! Thank you for being patient") {
                    setShowReportModal(false)
                    setReportMessage("")
                    navigation.goBack()
                }
                return
            }
            Alert.alert("Report sent successfully! Thank you for your feedback.")
            setShowReportModal(false)
            setReportMessage("")
            navigation.goBack()
        })

    }

    let address = '';
    if (jobPostData.address.streetAddr) {
        address += jobPostData.address.streetAddr + ', ' + jobPostData.address.city;
    } else {
        address = jobPostData.address;
    }

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

    const dateDiff = computeDateDiff(jobPostData.datePosted);
    const nearby = jobPostData.distanceToApplicant < 5;
    const newJob = dateDiff < 7;

    return (
    <Provider>
    {/* <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}> */}
    <View style={{flex:1, backgroundColor: 'white'}}>
    {/* <SafeAreaView style={{backgroundColor: 'white'}}> */}
    <SafeAreaView style={{ backgroundColor: 'transparent' }}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, paddingRight: 15, backgroundColor: 'transparent'}}>
        <TouchableOpacity
            onPress={goBackToPrevScreen}
            style={{paddingLeft: '5%'}}
        >
            <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <PaperButton
            onPress={reportButtonPressed}
            icon="exclamation-thick"
            mode='contained'
            style={{width: 125, height: 50, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', borderRadius: 25, backgroundColor: PaperColors.red400,}}
        >
            Report
        </PaperButton>
    </View>

    <ScrollView style={styles.container}>
        <View style={{backgroundColor: 'white'}}>
            <View style={styles.headerView}>
                <View style={styles.logoView}>
                    <FastImage
                        style={styles.logoImg}
                        source={logo}
                    />
                </View>

                <View style={styles.jobInfoView}>
                    <View style={styles.jobTitleView}>
                        <Text style={styles.jobTitleText} numberOfLines={1}>
                            {jobPostData.businessName}
                        </Text>
                    </View>
                    { (nearby || newJob) ? <View style={styles.jobTitleView}>
                        { nearby ? <JobTitleTags icon="star" textColor="#FFC24C" backgroundColor="#FFF7E8" fontSize={16} text="Nearby"/> : null }
                        { newJob ? <JobTitleTags icon="heart" textColor="#613BFA" backgroundColor="#EFEBFF" fontSize={16} text="New"/> : null }
                    </View> : null }
                    <View style={styles.jobRoleView}>
                        <Text style={styles.jobRoleText}>
                            {jobPostData.roleName}
                        </Text>
                    </View>
                    {jobPostData.salaryRangeLow != 0 && jobPostData.salaryRangeHigh != 0  && 
                    <View style={styles.jobSalaryView}>
                    {jobPostData.salaryRangeLow !== jobPostData.salaryRangeHigh &&
                        <Text style={styles.jobSalaryText}>$ {jobPostData.salaryRangeLow} - {jobPostData.salaryRangeHigh} Per Hour </Text>
                    }
                    {jobPostData.salaryRangeLow === jobPostData.salaryRangeHigh && jobPostData.salaryRangeLow != 0 && 
                        <Text style={styles.jobSalaryText}>$ {jobPostData.salaryRangeLow} Per Hour </Text>
                    }
                    </View> }
                    <View style={styles.jobLocationView}>
                        <Ionicons name="location-sharp" size={16} color="#3E989C" />
                        {!jobPostData.isRemote ? <Text style={styles.jobLocationText}> {address} </Text> :
                         <Text style={styles.jobLocationText}>  Remote </Text>}
                    </View>
                    <View style={styles.jobTypeView}>
                        <Ionicons name="ios-briefcase-outline" size={16} color="#3E989C" style={{marginRight: 5}} />
                        {jobPostData.isFulltime && <Text style={styles.jobTypeText}> Full-Time </Text>}
                        {jobPostData.isParttime && <Text style={styles.jobTypeText}> Part-Time </Text>}
                        {jobPostData.isInternship && <Text style={styles.jobTypeText}> Internship </Text>}
                    </View>
                </View>
            </View>

            <Divider
                style={styles.dividerView}
                color='#C5CDD9'
                orientation="horizontal"
                width={1} />

            { benefitsList.length > 0 && <View style={styles.jobDescriptionView}>
              <Text style={styles.jobDescriptionTitleText}>
                  Job Benefits
              </Text>
              <FlatList
                  contentContainerStyle={styles.roleBenefitList}
                  data={benefitsList}
                  renderItem={renderRoleBenefit}
              />
            </View> }

            { benefitsList.length > 0 && <Divider
                style={styles.dividerView}
                color='#C5CDD9'
                orientation="horizontal"
                width={1} /> }

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

            {!jobPostData.isRemote ? <View style={{paddingHorizontal: '5%', paddingTop: '5%', borderRadius: 25}}>
            <List.Accordion
              title="View Business Location"
              style={{backgroundColor: 'white', paddingHorizontal: '5%', paddingTop: -15}}
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
            </View> : null}

            {!userInfo.id == '' ? !jobPostData.externalLink ? alreadyApplied ?
            <View style={{flexDirection:'row', alignSelf: 'center', marginLeft: -20, marginTop: 20, alignItems: 'center', alignContent: 'center'}}>
                <Ionicons name='checkmark-circle' size={30} color={'green'} style={{marginRight: 10}} />
                <Text style={{fontSize: 22, marginVertical: 10, fontWeight: '600', color: '#41c480'}}>You've already applied :)</Text>
            </View>
            :
            <TouchableOpacity
            style={styles.applyButton}
            onPress={applyJobTapped}>
                <Text style={styles.applyButtonText}>
                    Apply For This Job
                </Text>
            </TouchableOpacity> : <TouchableOpacity
            style={styles.applyButton}
            onPress={applyExternalJobTapped}>
                <Text style={styles.applyButtonText}>
                    Apply on External Link
                </Text>
            </TouchableOpacity> :
            <TouchableOpacity
            style={styles.applyButton}
            onPress={signInToApply}>
                <Text style={styles.applyButtonText}>
                    Sign in to Apply
                </Text>
            </TouchableOpacity> 
            }

            <BeautyWebView
                visible={visible} // Required for open and close
                onPressClose={() => setVisible(false)} // Required for closing the modal
                url={jobPostData.externalLink}
                // extraMenuItems={[
                //     {
                //     title: 'Extra Item',
                //     onPress: () => console.log('Extra Menu Item Clicked'),
                //     },
                // ]}
                />

        <View style={{height: 150, backgroundColor: 'white'}} />
        </View>
    </ScrollView>

    <Portal>
            <PaperModal visible={showReportModal}
                        onDismiss={() => {
                            setShowReportModal(false)
                            setReportMessage("")
                        }}
                        style={{marginTop: -100}}
            >
                <Card style={{width: '70%', alignSelf: 'center', borderRadius: 25}}>
                    <Card.Content>
                        <Title style={{fontWeight: '600', paddingBottom: 15}}>Report this post or a bug</Title>
                        <Paragraph style={{paddingBottom: 10}}>
                            Almost all of our report requests are processed within 24 hours. Contact support for additional support. Thank you.
                        </Paragraph>
                        <PaperButton icon="send" mode="contained" onPress={attemptToSendReport} loading={sendReportLoading} style={{width: 150, alignSelf: 'center', borderRadius: 25, height: 50, justifyContent: 'center', marginBottom: 20}} >
                            Submit
                        </PaperButton>
                        <TextInput
                            label="Report Message"
                            value={reportMessage}
                            multiline={true}
                            onChangeText={text => setReportMessage(text)}
                            style={{marginBottom: 20}}
                            />

                        {/* <TextInput
                            style={{height: 100, paddingHorizontal: 10, alignItems: 'flex-start'}}
                            left={true}
                            label="Report Message"
                            value={reportMessage}
                            onChangeText={setReportMessage}
                            placeholder="Describe what is hapening and any details we should know for our investigation"
                        /> */}
                    </Card.Content>
                </Card>
            </PaperModal>
        </Portal>
    {/* </SafeAreaView> */}
    </SafeAreaView>
    </View>
    {/* </KeyboardAvoidingView> */}
    </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: '5%',
        backgroundColor: 'white',
    },
    headerView: {
        flexDirection: 'row',
    },
    dividerView: {
        width:'85%',
        marginTop: 10,
        marginLeft: '7.5%'
    },
    logoView: {
        width: 120,
        height: 120,
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
        paddingRight: 10
    },
    jobTitleView: {
        width: '100%',
        height: 30,
        flexDirection: 'row',
        marginBottom: 3,
    },
    jobTitleText: {
        padding: 5,
        fontSize: 16,
        color: '#8B9CA8',
    },
    jobRoleView: {
        marginTop: 3,
        marginBottom: 10,
        paddingRight: 50,
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
        fontSize: 15,
        color: '#6F8394',
    },
    jobLocationView: {
        width: '100%',
        marginTop: 4,
        padding: 3,
        height: 30,
        flexDirection: 'row',
    },
    jobLocationText: {
        fontSize: 15,
        color: '#6F8394',
    },
    jobTypeView: {
        width: '100%',
        padding: 3,
        height: 30,
        flexDirection: 'row',
    },
    jobTypeText: {
        fontSize: 15,
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
        color: 'white',
    },
    roleBenefitChip: {
      margin: 5
    },
    roleBenefitList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
    webviewContainer: {
        justifyContent: 'center',
        height: 100,
        width: 20,
    },
})
