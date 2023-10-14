import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Button, TextInput, ImageBackground, ScrollView, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../../components/Themed';
import { auth } from '../../constants/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation, useRoute } from '@react-navigation/core';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { addUserAPI } from '../../apiService/realtimeDB/realtimeDBApi';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Alert } from 'react-native';
import { ApplicantProfileData } from '../../store/ReducerAllDataTypes';
import { updateApplicantProfileData } from '../../store/ApplicantProfileReducer'
import Geolocation from 'react-native-geolocation-service';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { createApplicantProfileAPI } from '../../apiService/firestoreApis/ApplicantProfileDataApi';
import messaging from '@react-native-firebase/messaging';
import { addNewPhoneNumberEmailPairAPI } from '../../apiService/firestoreApis/authenticationApi';
import { BarIndicator } from 'react-native-indicators';
import { createReferralCodeAPI, fetchReferralCodeUserAPI, recordReferralAPI } from '../../apiService/firestoreApis/ReferralCodeApi';
import uuid from 'react-native-uuid';
import { json } from 'stream/consumers';
import { AppEventsLogger } from "react-native-fbsdk-next";

const headerImage = require('../../../assets/images/lr-logo.png');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpApplicantLocationScreen({route}) {

    const navigation = useNavigation();
    const applicantProfile = useSelector(state => state.applicantProfileReducer).profileData;
    const dispatch = useDispatch()
    const [locationGranted, setLocationGranted] = useState(false);

    const [longitude, setLongitude] = useState(applicantProfile.longitude)
    const [latitude, setLatitude] = useState(applicantProfile.latitude)
    const [longitudeDelta, setLongitudeDelta] = useState(0.003)
    const [latitudeDelta, setLatitudeDelta] = useState(0.003)
    const [locationLoading, setLocationLoading] = useState(true)
    const [signupLoading, setSignupLoading] = useState(false);
    const [referralText, setReferralText] = useState("");

    useEffect(() => {
        (async () => {
            const permission = await Geolocation.requestAuthorization("whenInUse").then((val) => {
                setLocationGranted(true)
                Geolocation.getCurrentPosition(
                    (position) => {
                        setLatitude(position.coords.latitude)
                        setLongitude(position.coords.longitude)
                        setLocationLoading(false)
                    },
                    (error) => {
                      // See error code charts https://github.com/Agontuk/react-native-geolocation-service.
                      Alert.alert("Failed to get location :( " + error)
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                );
            }).catch((err) => {
                Alert.alert("Requesting permission for location failed, please give access to location services in settings")
            })
        })()
    }, []);

    const goBackToPrevScreen = () => {
        navigation.goBack();
    }

    const test = () => {
      // check and register referral code inputted
      fetchReferralCodeUserAPI(referralText, (data, err) => {
        if (err != null) {
            console.log(err);
            return
        }
        const referrerId = data.id;
        console.log(referrerId);
        recordReferralAPI(referrerId);
      });
    }


    const signUpPressed = () => {
        if (!locationGranted) {
            Alert.alert("Permission to access location was denied, please enable and retry")
            return
        }

        let referralCode = uuid.v4().slice(0, 6);
        const numRetry = 3;

        for (let i = 0; i < numRetry; i++) {
          fetchReferralCodeUserAPI(referralCode, (data, err) => {
            if (data != null) {
              referralCode = uuid.v4().slice(0, 6);
              console.log(referralCode);
              console.log("Duplicate, generating new referral code");
            } else {
              console.log("Valid new referral code generated!");
            }
          });
        }

        const initialCoins = 200;

        const newUser: ApplicantProfileData = {
            id: applicantProfile.id,
            firstName: applicantProfile.firstName,
            lastName: applicantProfile.lastName,
            userType: applicantProfile.userType,
            email: applicantProfile.email,
            phoneNumber: applicantProfile.phoneNumber,
            longitude: longitude,
            latitude: latitude,
            employmentHistory: applicantProfile.employmentHistory,
            education: applicantProfile.education,
            educationLevel: applicantProfile.educationLevel,
            age: applicantProfile.age,
            profilePicUrl: "no image",
            appliedJobs: [],
            availability: applicantProfile.availability,
            referralCode: referralCode,
            referralNum: 0,
            coins: initialCoins
        }
        // dispatch(updateApplicantProfileData(newUser))
        // navigation.navigate("SignUpApplicantAdditionalInfo", {
        //     password: route.params?.password
        // })
        handleSignUp(newUser);
    }

    const handleSignUp = (newUser: ApplicantProfileData) => {
        setSignupLoading(true);
        createUserWithEmailAndPassword(auth, applicantProfile.email, route.params?.password)
        .then(userCredentials => {
            const user = userCredentials.user;
            newUser.id = user.uid

            // Firestore create applicant
            createApplicantProfileAPI(newUser, (err) => {
                if (err) {
                    Alert.alert("\n Sign up error: if persists, contact wapplyjobsearch@gmail.com");
                    return
                }

                // Subscribe employer topic
                messaging()
                .subscribeToTopic('applicant')
                .then(() => console.log('Subscribed to applicant topic!'))
                .catch((err) => console.log('Cannot subscribed to applicant topic! ', err));

                // save phone number to email pair to firebase
                addNewPhoneNumberEmailPairAPI(newUser);

                // add referral code pair with the userid for new user
                const referralCodeData = {
                  code: newUser.referralCode,
                  id: newUser.id
                }
                createReferralCodeAPI(referralCodeData);

                // check and register referral code inputted
                fetchReferralCodeUserAPI(referralText, (data, err) => {
                  if (err != null) {
                      console.log(err);
                      return
                  }
                  const referrerId = data.id;
                  console.log(referrerId);
                  recordReferralAPI(referrerId);
                });

                AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
                    [AppEventsLogger.AppEventParams.RegistrationMethod]: "email",
                  });

                navigation.navigate("ApplicantOnboarding")
            });

            dispatch(updateApplicantProfileData(newUser))
            setSignupLoading(false);
            navigation.navigate("Root", {
                data: true
            })
        })
        .catch(err => {
            console.log("\n alert msg: " + JSON.stringify(err))
          setSignupLoading(false);
          alert(err.message);
        })
    }

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={{paddingBottom: windowHeight * 0.6}}>
            <View style={{backgroundColor: '#f5f7fb', paddingLeft: 30}}>
                <Text style={styles.title}>Last Step: Location</Text>
                <Text style={styles.titleDescription}>We will recommend jobs nearby</Text>
                <Text style={{paddingTop: 10, paddingRight: 10, color: 'gray'}}>If your location doesn't show up correctly, go back to previous screen and return to this screen</Text>
            </View>
            <MapView
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                }}
                onRegionChangeComplete={(region) => {
                    setLongitude(region.longitude)
                    setLatitude(region.latitude)
                    setLatitudeDelta(region.latitudeDelta)
                    setLongitudeDelta(region.longitudeDelta)
                }}
                style={styles.map}
            >
                <Marker coordinate={{latitude: latitude, longitude: longitude}} />
            </MapView>

            <View style={{backgroundColor: '#f5f7fb', paddingLeft: 20, paddingTop: 20}}>
                <Text style={styles.title}>Referral Code</Text>
                <Text style={[styles.titleDescription, {marginTop: -10}]}>If you have one, enter a referral code here</Text>
            </View>
            <View style={styles.content}>
            <TextInput
                style={[styles.textInput, {marginBottom: 10}]}
                placeholder="Referral Code"
                onChangeText={setReferralText}
                value={referralText}
            />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#f5f7fb'}}>
                <TouchableOpacity style={styles.button} onPress={goBackToPrevScreen}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={signUpPressed}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', top: '50%', backgroundColor: 'transparent', width: 50, height: 50}}>
                <ActivityIndicator animating={locationLoading} color={Colors.deepPurple500} size={'large'} />
            </View>
            { signupLoading && <View style={styles.overlayView}>
                <BarIndicator color='black' />
            </View> }
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
        paddingTop: 80, 
    },
    content: {
        backgroundColor: '#f5f7fb',
        paddingTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    titleDescription: {
        fontSize: 18,
        color: 'gray'
    },
    headerBanner: {
        flex: 2,
        backgroundColor: '#f5f7fb',
        paddingTop: 50,
    },
    map: {
        marginTop: 20,
        width: '90%',
        height: '90%',
        marginLeft: 20,
        borderRadius: 20
    },
    image: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    textInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth / 1.2,
        fontSize: 20,
        margin: 10,
        borderWidth: 1
    },
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        width: windowWidth / 2.5,
        height: 70,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight:'bold',
        color: 'white'
    },
    overlayView: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 0.7,
    },
})
