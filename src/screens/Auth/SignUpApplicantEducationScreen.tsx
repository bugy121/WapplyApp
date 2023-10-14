import * as React from 'react';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicantProfileData } from '../../store/ReducerAllDataTypes';
import { updateApplicantProfileData } from '../../store/ApplicantProfileReducer';
import RadioGroup from 'react-native-radio-buttons-group';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const educationLevelGroup = [{
    id: '2', // acts as primary key, should be unique and non-empty string
    size: 30,
    label: 'Some High School',
    labelStyle: {
        fontSize: 18,
    },
    value: '2'
}, {
    id: '3',
    size: 30,
    label: 'High School Graduated',
    labelStyle: {
        fontSize: 18,
    },
    value: '3'
}, {
    id: '4',
    size: 30,
    label: 'Some College',
    labelStyle: {
        fontSize: 18,
    },
    value: '4'
}, {
    id: '5',
    size: 30,
    label: 'College Graduated',
    labelStyle: {
        fontSize: 18,
    },
    value: '5'
}]

export default function SignUpApplicantEducationScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const applicantProfile = useSelector(state => state.applicantProfileReducer).profileData;

    const [schoolName, setSchoolName] = useState('');
    const [radioButtons, setRadioButtons] = useState(educationLevelGroup);
    const [radioButtonSelected, setRadioButtonSelected] = useState('1');
    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);

        for (let button of radioButtonsArray) {
            if (button.selected) {
                setRadioButtonSelected(button.id);
            }
        }
    }

    const goNextScreen = async () => {

        if (schoolName.length == 0) {
            Alert.alert("Please enter your school name!");
            return
        }

        if (radioButtonSelected == '0') {
            Alert.alert("Please choose your education level!");
            return
        }

        const newUser: ApplicantProfileData = {
            id: "",
            firstName: "",
            lastName: "",
            userType: "applicant",
            email: "",
            phoneNumber: "",
            longitude: applicantProfile.longitude,
            latitude: applicantProfile.latitude,
            employmentHistory: [],
            education: schoolName,
            educationLevel: parseInt(radioButtonSelected),
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
        navigation.navigate("SignUpApplicantContactInfo");
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={styles.headerBanner}>
                <Text style={{fontSize: 28, fontWeight: '700', padding: 20, marginTop: 20, textAlign: 'center'}}> What's your level of education? </Text>
            </View>
            <View style={styles.content}>
            <RadioGroup 
                radioButtons={educationLevelGroup} 
                onPress={onPressRadioButton}
                containerStyle={{alignItems: 'flex-start'}}
            />
            </View>
            <View style={{marginTop: '15%'}}>
                <TextInput value={schoolName} onChangeText={setSchoolName} style={styles.schoolNameInput} placeholder='School Name'/>
            </View>
            <View style={{backgroundColor: 'transparent', paddingTop: '15%'}}>
                <TouchableOpacity
                    style={styles.button}
                    onPress = {goNextScreen}>
                    <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Next</Text>
                </TouchableOpacity>
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
        backgroundColor: '#f5f7fb',
        paddingTop: 50,
    },
    content: {
        marginTop: '10%',
        alignItems:'flex-start',
    },
    button: {
        borderRadius: 15,
        backgroundColor: '#00baff',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    schoolNameInput: {
        width: windowWidth * 0.7, 
        borderBottomWidth: 1,
        fontSize: 18,
        padding: 10,
        textAlign: 'center'
    }
})