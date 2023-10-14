import * as React from 'react';
import { useRef, useState } from 'react';
import { StyleSheet, Button, TextInput, ImageBackground, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { Text, View } from '../../components/Themed';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation, useRoute } from '@react-navigation/core';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { resetEmployerProfileData } from '../../store/EmployerProfileReducer';
import { resetApplicantProfileData } from '../../store/ApplicantProfileReducer';

const headerImage = require('../../../assets/images/lr-logo.png');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpUserTypeScreen() {
    const auth = getAuth();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [userType, onChangeUserType] = useState('');
 
    const goBackToPrevScreen = () => {
        dispatch(resetEmployerProfileData());
        dispatch(resetApplicantProfileData());
        navigation.navigate("Login");
    }

    const goToNextScreen = () => {
        if (userType == null || userType.length == 0) {
            Alert.alert("Please select a user type before proceeding")
            return
        }
        if (userType == 'Employer') {
            navigation.navigate('SignUpEmployerRoot')
        } else {
            navigation.navigate('SignUpApplicantEducation')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: "2%"}}>Sign Up User Type</Text>
            <Text style={{fontSize: 20}}>What are you signing up as?</Text>
            <View style={styles.content}>
                <TouchableOpacity
                    style={ userType!='Employer' ? styles.selectionButton : styles.selectionButtonSelected }
                    onPress = {() => onChangeUserType('Employer')}>
                    <Text style={{fontSize: 23, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Employer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={ userType!='LFW' ? styles.selectionButton : styles.selectionButtonSelected }
                    onPress = {() => onChangeUserType('LFW')}>
                    <Text style={{fontSize: 23, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Applicant looking for job</Text>
                </TouchableOpacity>
                <View style={{backgroundColor: 'transparent', marginTop: 20}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {() => goBackToPrevScreen()}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {goToNextScreen}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
        paddingTop: 80,
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#f5f7fb',
        paddingTop: '8%',
        alignItems: 'center',
    },
    headerBanner: {
        flex: 2,
        backgroundColor: '#f5f7fb',
        paddingTop: 50,
    },
    // content: {
    //     flex: 3,
    //     justifyContent: 'flex-start',
    //     alignItems: 'center',
    //     paddingTop: 0,
    //     backgroundColor: '#f5f7fb',
    // },
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
    selectionButton: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        //textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
        height: windowHeight / 5.5,
        width: windowWidth / 1.2,
    },
    selectionButtonSelected: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        //textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
        height: windowHeight / 5.5,
        width: windowWidth / 1.2,
        borderWidth: 3,
        borderColor: 'blue',
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
})