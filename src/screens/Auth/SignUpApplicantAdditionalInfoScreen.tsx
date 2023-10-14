import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Button, TextInput, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';

import { Text, View } from '../../components/Themed';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation, useRoute } from '@react-navigation/core';
import { Dimensions } from 'react-native';
import { NativeViewGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import { addApplicantUserAPI, addUserAPI } from '../../apiService/realtimeDB/realtimeDBApi';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployerUserAPI } from '../../apiService/realtimeDB/realtimeDBApi';
import { Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ApplicantProfileData } from '../../store/ReducerAllDataTypes';
import { updateApplicantProfileData } from '../../store/ApplicantProfileReducer';
import { createApplicantProfileAPI } from '../../apiService/firestoreApis/ApplicantProfileDataApi';
import { addNewPhoneNumberEmailPairAPI } from '../../apiService/firestoreApis/authenticationApi';
import { BarIndicator } from 'react-native-indicators';
import uuid from 'react-native-uuid';

import { createReferralCodeAPI, fetchReferralCodeUserAPI, recordReferralAPI } from '../../apiService/firestoreApis/ReferralCodeApi';



// FCM
import messaging from '@react-native-firebase/messaging';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpApplicantAdditionalInfoScreen({route}) {
    const auth = getAuth();
    const navigation = useNavigation();
    const applicantProfile = useSelector(state => state.applicantProfileReducer);
    const dispatch = useDispatch()

    // const [mapLocation, setMapLocation] = useState({
    //     latitude: 0,
    //     longitude: 0,
    //     latitudeDelta: 0.001,
    //     longitudeDelta: 0.001,
    // });
    // const [locationObtained, setLocationObtained] = useState(false);
    const [age, setAge] = useState("");
    const [education, setEducation] = useState("");
    const [referralText, setReferralText] = useState("");

    const [signupLoading, setSignupLoading] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             Alert.alert('Permission to access location was denied')
    //             return;
    //         }

    //         let location = await Location.getCurrentPositionAsync({});
    //         console.log("setting location")
    //         console.log(location)
    //         setMapLocation({
    //             latitude: location.coords.latitude,
    //             longitude: location.coords.longitude,
    //             latitudeDelta: 0.001,
    //             longitudeDelta: 0.001,
    //         })
    //         // setLocationObtained(true)
    //     })();
    // }, []);

    const goBackToPrevScreen = () => {
        navigation.navigate("SignUpApplicantLocation");
    }

    const signUpPressed = () => {
        // if (!locationObtained) {
        //     Alert.alert("Please enable location for better job recommendation")
        //     return
        // }
        if (applicantProfile.latitude == 0 && applicantProfile.longitude == 0) {
            Alert.alert("Location error: Please enable location")
            return
        }
        const intAge = parseInt(age)
        if (intAge < 16 || intAge > 80) {
            Alert.alert("Please enter an age range between 16 and 80");
            return
        }
        const maxEducationDescriptionLen = 150
        if (education.length > maxEducationDescriptionLen) {
            Alert.alert("Education description needs to be under " + maxEducationDescriptionLen)
            return
        }

        let referralCode = uuid.v4().slice(0, 6);
        validReferralCode = false;
        while (!validReferralCode) {
          fetchReferralCodeUserAPI(referralCode, (data, err) => {
            if (err != null) {
              console.log(err);
              referralCode = uuid.v4().slice(0, 6);
            } else {
              console.log("Valid referral code generated!");
              validReferralCode = true;
            }
          });
        }

        const initialCoins = 200;

        const newUser: ApplicantProfileData = {
            id: applicantProfile.profileData.id,
            firstName: applicantProfile.profileData.firstName,
            lastName: applicantProfile.profileData.lastName,
            userType: applicantProfile.profileData.userType,
            email: applicantProfile.profileData.email,
            phoneNumber: applicantProfile.phoneNumber,
            longitude: applicantProfile.profileData.longitude,
            latitude: applicantProfile.profileData.latitude,
            employmentHistory: applicantProfile.profileData.employmentHistory,
            education: education,
            educationLevel: applicantProfile.profileData.educationLevel,
            age: intAge,
            profilePicUrl: "no image",
            appliedJobs: [],
            availability: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            },
            referralCode: referralCode,
            referralNum: 0,
            coins: initialCoins
        }
        handleSignUp(newUser)
    }

    const handleSignUp = (newUser: ApplicantProfileData) => {
        setSignupLoading(true);
        createUserWithEmailAndPassword(auth, applicantProfile.profileData.email, route.params?.password)
        .then(userCredentials => {
            const user = userCredentials.user;
            newUser.id = user.uid

            // // AWS create Applicant
            // const encodedUser = encodeApplicantProfileData(newUser)
            // createApplicantProfileAPI(encodedUser)

            // Firestore create applicant
            createApplicantProfileAPI(newUser, (err) => {
                if (err) {
                    console.log("\n err msg: " + JSON.stringify(err))
                    Alert.alert(err);
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
                })
                navigation.navigate("ApplicantOnboarding")
            });

            dispatch(updateApplicantProfileData(newUser))
            setSignupLoading(false);
            // navigation.navigate("Root", {
            //     data: true
            // })
        })
        .catch(err => {
            console.log("\n alert msg: " + JSON.stringify(err))
          setSignupLoading(false);
          alert(err.message);
        })
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={{backgroundColor: '#f5f7fb', paddingLeft: 30}}>
                <Text style={styles.title}>Additional Info</Text>
                <Text style={styles.titleDescription}>Almost there to finishing!</Text>
            </View>
            <View style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    placeholder = "Age"
                    onChangeText = {(age) => {
                        age = age.replace('.', '')
                        setAge(age)
                    }}
                    autoCorrect={false}
                    keyboardType='numeric'
                    value={age}
                />
                <TextInput
                    style={[styles.textInputMulti, {marginBottom: 10}]}
                    placeholder="Education(i.e. school you attend/year)"
                    onChangeText={setEducation}
                    value={education}
                    multiline={true}
                />
                <TextInput
                    style={[styles.textInput, {marginBottom: 10}]}
                    placeholder="Referral Code"
                    onChangeText={setReferralText}
                    value={referralText}
                />
                <View style={{backgroundColor: 'transparent'}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {goBackToPrevScreen}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Go Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={signUpPressed}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                {signupLoading && <Text style = {{paddingTop: 10}}>Signing Up</Text>}
            </View>
            { signupLoading && <View style={styles.overlayView}>
                <BarIndicator color='black' />
            </View> }
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
        paddingTop: 40,
    },
    content: {
        backgroundColor: '#f5f7fb',
        paddingTop: '10%',
        alignItems: 'center',
    },
    headerBanner: {
        flex: 2,
        backgroundColor: '#f5f7fb',
        paddingTop: 50,
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
        backgroundColor: 'white'
    },
    textInputMulti: {
        textAlign: 'center',
        borderRadius: 15,
        height: 200,
        width: windowWidth / 1.2,
        fontSize: 20,
        backgroundColor: 'white',
        paddingTop: 15,
        paddingHorizontal: 15
    },
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        width: windowWidth / 2.5,
        height: windowHeight/ 10,
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
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    titleDescription: {
        fontSize: 18,
        color: 'gray'
    },
    overlayView: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 1,
    },
})
