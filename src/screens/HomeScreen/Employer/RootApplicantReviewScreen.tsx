
import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert, Animated, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonGroup } from 'react-native-elements';
import { deleteJobPosting } from '../../../store/EmployerJobListingReducer';
import { deleteJobPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { getJobApplicationsAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import JobPostInfoSubview from './JobPostInfoSubview';
import ApplicationsDetailTabView from './ApplicationsDetailTabView';
import JobPostApplicantsSubview from './JobPostApplicantsSubview';
import { getApplicationList } from '../../../apiService/firestoreApis/JobPostingApplicationListApi';
import { addApplicationData } from '../../../store/EmployerJobListingReducer';
import ApplicationReviewProfileSubview from './ApplicationReviewProfileSubview';
import ApplicationReviewAnswersSubview from './ApplicationReviewAnswersSubview';
import { Ionicons, FontAwesome, AntDesign, Octicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Avatar, Card, Title, Paragraph, Colors, Button, Badge } from 'react-native-paper';
import FastImage from 'react-native-fast-image';

export default function RootApplicantReviewScreen({route}) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const iconNames = ['person', 'paper-plane-outline']

    const data = route.params
    const jobPostId = data.jobPostId
    const applicationId = data.applicationId
    const layout = useWindowDimensions();
    const navigation = useNavigation();
    const employerApplicationsData = useSelector(state => state.employerJobListingReducer);
    const employerProfile = useSelector(state => state.employerProfileReducer).profileData;
    const applications = employerApplicationsData.postingIdsToApplications[jobPostId];

    
    const chatNotificationData = useSelector(state => state.chatMessageReducer)
    let showNotificationsBadge = false
    if (applicationId) {
        showNotificationsBadge = chatNotificationData.chatStatuses[applicationId] > 0
    }

    const applicationData = applications.find((appData) => {
        return appData.app.id == applicationId
    }).app
    // console.log("Application data: " + JSON.stringify(applicationData))
    const ApplicantProfileRoute = () => (
        <ApplicationReviewProfileSubview applicationData={applicationData} />
    );

    const ApplicationAnswersRoute = () => (
        <ApplicationReviewAnswersSubview applicationData={applicationData} jobPostId={jobPostId} isInternship={data.isInternship}/>
    );

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'profile', title: 'Profile' },
        { key: 'application', title: 'Application' },
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
                                <Ionicons name={iconNames[i]} size={25} style={{paddingRight: 5}} color={(index === i) ? 'white': 'black'} />
                                <Animated.Text style={{ opacity, fontSize: 20, fontWeight: '600', color: (index === i) ? 'white': 'black' }}>{route.title}</Animated.Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )
    }

    const renderScene = SceneMap({
        profile: ApplicantProfileRoute,
        application: ApplicationAnswersRoute,
      });

    const goBackToPrevScreen = () => {
        navigation.goBack()
    }

    const acceptApplication = () => {
        Alert.alert("You are going to accept this application, are you sure?")
    }

    const rejectApplication = () => {
        Alert.alert("you are going to reject this application, are you sure?")
    }

    const operator = Platform.OS === "ios" ? "&" : "?";
    const smsUrl = `sms:${applicationData.phoneNumber}${operator}body=${''}`;

    const emailSubject = `[Wapply] Message from ${employerProfile.firstName} at ${employerProfile.businessName}`;
    const emailUrl =`mailto:${applicationData.email}${operator}subject=${emailSubject}`;

    const [profileImageURL, _] = useState(applicationData.profilePicUrl != "no image" ? {uri: applicationData.profilePicUrl} : require('../../../../assets/images/profileimg.png'));

    const openSMS = async () => {
      await Linking.openURL(smsUrl);
    }

    const openEmail = async () => {
      await Linking.openURL(emailUrl);
    }

    function directMessagePress() {
        navigation.navigate("RootEmployerChat", {
            applicationData: applicationData
        })
    }

    return (
        <View style={{marginTop: 60}}>
            <TouchableOpacity
                onPress={goBackToPrevScreen}
                style={{paddingLeft: 15, marginBottom: 20}}
            >
                <Ionicons name="chevron-back" size={22} color="black" />
            </TouchableOpacity>
            <View style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingBottom: 10}}>
                    <FastImage 
                        source={profileImageURL}
                        style={styles.logoImg}
                     />
                    <Text style={{fontSize: 30, fontWeight: 'bold', paddingTop: 10, paddingBottom: 5, paddingLeft: 10}}>{applicationData.firstName} {applicationData.lastName}</Text>
                </View>
                <View>
                    <Button icon="message" mode="contained" 
                        color={Colors.greenA400}
                        labelStyle={{fontSize: 20, fontWeight: 'bold', color:'white'}}
                        style={{width: '100%', justifyContent: 'center', alignItems: 'flex-start', borderRadius: 25, marginVertical: 5}}
                        onPress={directMessagePress}>
                        In-App direct message
                    </Button>
                    {showNotificationsBadge &&
                        <Badge visible={true} size={20} style={{position: 'absolute', alignSelf: 'flex-end', alignContent: 'flex-start'}}> </Badge>
                    }
                </View>
                
                <Button icon="cellphone" mode="contained"
                  color={Colors.lightBlue600}
                  labelStyle={{fontSize: 20}}
                  style={{width:'100%', justifyContent: 'center', alignItems: 'flex-start', borderRadius: 25, marginVertical: 5}}
                  onPress={() => openSMS()}>
                  Phone: {applicationData.phoneNumber}
                </Button>
                <Button icon="email" mode="contained" uppercase={false}
                  color={Colors.red300}
                  labelStyle={{fontSize: 14}}
                  style={{justifyContent: 'center', alignItems: 'flex-start', borderRadius: 25, marginVertical: 5}}
                  onPress={() => openEmail()}>
                  Email: {applicationData.email}
                </Button>
            </View>
            <View style={{height: '100%'}}>
                <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
                style={{}}
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
    },
    logoImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
})
