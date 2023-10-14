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

export default function SignUpApplicantContactInfo() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const applicantProfile = useSelector(state => state.applicantProfileReducer).profileData;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

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

    const validPhoneNumber = (num: string) => {
        if (isNaN(num)) {
            Alert.alert('Please provide your phone number');
            return false
        }
        if (num.length != 10) {
            Alert.alert('Phone number is invalid');
            return false;
        }
        return true
    }

    const validPassword = (password: string) => {
        if (password.length < 8) {
            return false;
        }
        return true;
    }

    const goNextScreen = async () => {
        // phone number duplicate check
        let duplicated = false;
        await getEmailAddressByPhoneNumberAPI(phoneNumber, (data) => {
            if (data) {
                duplicated = true;
            }
        })

        if (!validPhoneNumber(phoneNumber)) {
            return
        } else if (!EmailValidator.validate(email)) {
            Alert.alert('Email address invalid')
            return
        } else if (!validPassword(password)) {
            Alert.alert('Need stronger password')
            return
        } else if (duplicated) {
            Alert.alert("This phone number is already registered!")
            return
        }
        const newUser: ApplicantProfileData = {
            id: "",
            firstName: applicantProfile.firstName,
            lastName: applicantProfile.lastName,
            userType: "applicant",
            email: email,
            phoneNumber: "+1" + parseInt(phoneNumber),
            longitude: longitude,
            latitude: latitude,
            employmentHistory: [],
            education: applicantProfile.education,
            educationLevel: applicantProfile.educationLevel,
            age: 0,
            appliedJobs: [],
            profilePicUrl: "no image",
            availability: applicantProfile.availability
        }
        dispatch(updateApplicantProfileData(newUser))

        navigation.navigate("PhoneAuthScreen", {
            password: password,
            phoneNumber: phoneNumber,
            userType: "applicant",
        });
        // navigation.navigate("SignUpApplicantLocation", {
        //     password: password,
        // });
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
                <Text style={{fontSize: 26, fontWeight: '700', padding: 20, marginTop: 20}}> What's your contact info? </Text>
            </View>
            <View style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    ref={emailRef}
                    placeholder = "Email"
                    onChangeText = {setEmail}
                    value={email}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    //ref={phoneNumberRef}
                    placeholder = "Phone Number"
                    onChangeText = {(phoneNumber) => {
                        phoneNumber = phoneNumber.replace('.', '')
                        setPhoneNumber(phoneNumber)
                    }}
                    keyboardType={'numeric'}
                    value={phoneNumber}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <View style={{height: 30}} />
                <TextInput
                    style={styles.textInput}
                    ref={passwordRef}
                    placeholder = "Password"
                    secureTextEntry={true}
                    onChangeText = {setPassword}
                    value={password}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
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
        marginTop: '5%',
        alignItems: 'center',
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
        flexDirection: 'row',
        borderRadius: 15,
        backgroundColor: 'transparent',
    },
    firstNameTextInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth / 2.6,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white'
    },
    lastNameTextInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth / 2.5,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white'
    }
})
