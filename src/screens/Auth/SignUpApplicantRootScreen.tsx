import * as React from 'react';
import { useRef, useEffect } from 'react';
import { StyleSheet, Button, TextInput, ImageBackground, ScrollView } from 'react-native';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../../types';
import { auth } from '../../constants/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Navigation from '../../navigation';
import { useNavigation } from '@react-navigation/core';
import { Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import * as EmailValidator from 'email-validator';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicantProfileData } from '../../store/ReducerAllDataTypes';
import { updateApplicantProfileData } from '../../store/ApplicantProfileReducer';
import { getEmailAddressByPhoneNumberAPI } from '../../apiService/firestoreApis/authenticationApi';
import Geolocation from 'react-native-geolocation-service';

const headerImage = require('../../../assets/images/lr-logo.png');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpApplicantRootScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const applicantProfile = useSelector(state => state.applicantProfileReducer)

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const nameRef = useRef(null);

    const [longitude, setLongitude] = React.useState(0)
    const [latitude, setLatitude] = React.useState(0)

    useEffect(() => {
        (async () => {
            const permission = await Geolocation.requestAuthorization("whenInUse").then((val) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        setLongitude(position.coords.longitude)
                        setLatitude(position.coords.latitude)
                    },
                    (error) => {
                      // See error code charts https://github.com/Agontuk/react-native-geolocation-service.
                        Alert.alert("Failed to get location: please make application has location services and restart application :( " + error)
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                );
            }).catch((err) => {
                Alert.alert("Requesting permission for location failed, please give access to location services in settings")
            })
        })();
    }, []);


    const goBackToPrevScreen = () => {
        navigation.navigate("SignUpUserType");
    }

    const goNextScreen = async () => {
        if (firstName.length == 0 || lastName.length == 0) {
            Alert.alert('Name cannot be empty')
            return
        }
        const newUser: ApplicantProfileData = {
            id: "",
            firstName: firstName,
            lastName: lastName,
            userType: "applicant",
            email: "",
            phoneNumber: "",
            longitude: longitude,
            latitude: latitude,
            employmentHistory: [],
            education: "",
            educationLevel: 0,
            age: 0,
            appliedJobs: [],
            profilePicUrl: "no image",
            availability: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            }
        }
        dispatch(updateApplicantProfileData(newUser))
        // navigation.navigate("PhoneAuthScreen", {
        //     password: password,
        //     phoneNumber: phoneNumber,
        //     userType: "applicant",
        // });
        navigation.navigate("SignUpApplicantEducation");
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={styles.headerBanner}>
                {/* <ImageBackground source={headerImage} 
                resizeMode="cover" 
                style={styles.image}
                imageStyle={{ borderRadius: 15}}/> */}
                <Text style={{fontSize: 30, fontWeight: '700', padding: 20, marginTop: 20}}> What's your name? </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.nameFields}>
                    <TextInput
                        style={styles.firstNameTextInput}
                        ref={nameRef}
                        placeholder = "First Name"
                        onChangeText = {setFirstName}
                        value={firstName}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                    <TextInput
                        style={styles.lastNameTextInput}
                        ref={nameRef}
                        placeholder = "Last Name"
                        onChangeText = {setLastName}
                        value={lastName}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>
                <View style={{backgroundColor: 'transparent', paddingTop: '15%'}}>
                    {/* <TouchableOpacity
                        style={styles.button}
                        onPress = {goBackToPrevScreen}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Back To Login</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {goNextScreen}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Next</Text>
                    </TouchableOpacity>
                </View>

            </View>
            
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fb',
        marginTop: '-15%'
    },
    headerBanner: {
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#f5f7fb',
        //backgroundColor: 'red',
        paddingTop: 50,
    },
    content: {
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fb',
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
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    nameFields: {
        borderRadius: 15,
        backgroundColor: 'transparent',
    },
    firstNameTextInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth * 0.8,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white'
    },
    lastNameTextInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth * 0.8,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white'
    }
})