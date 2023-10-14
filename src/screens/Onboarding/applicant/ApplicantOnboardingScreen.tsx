import Onboarding from 'react-native-onboarding-swiper';
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
    Text, View, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Dimensions, Image, SafeAreaView
  } from 'react-native';
import {Button, Colors} from 'react-native-paper'
import { useNavigation } from '@react-navigation/core';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { showFirstLoginAnimation } from '../../../store/ApplicantProfileReducer';

const DoneButton = ({isLight, ...props}) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    return (
        <Button color='black' onPress={() => {
            dispatch(showFirstLoginAnimation())
            navigation.navigate("Root")}
        }>
            Done
        </Button>
    )
}

const cardView = (title: string, imageSource: number) => {
    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    return (
        <SafeAreaView>
            <View style={{height: windowHeight / 2, width: windowWidth, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20}}>
            <Text style={{fontSize: 28, alignContent: 'center', paddingBottom: 20, fontWeight: '600'}}>{title}</Text>
                <Image resizeMode='contain' source={imageSource} style={{width: windowWidth - 30, height: windowHeight / 2, borderRadius: 15}} />
            </View>
        </SafeAreaView>
    )
}

export default function ApplicantOnboardingScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const images = [
        require('../../../../assets/images/onboard/onboard-applicant-1.jpg'),
        require('../../../../assets/images/onboard/onboard-applicant-2.jpg'),
        require('../../../../assets/images/onboard/onboard-applicant-3.jpg'),
        require('../../../../assets/images/onboard/onboard-applicant-4.jpg'),
    ]
    const pages = [
        {
            backgroundColor: Colors.lightGreenA100,
            image: cardView("Welcome! ", images[0]),
            title: 'Fill out profile information',
            subtitle: 'More complete profiles get responses back faster.'
        },
        {
            backgroundColor: Colors.lightBlue100,
            image: cardView("Step 2: Find and Apply", images[1]),
            title: 'Find and Apply to jobs nearby.'
        },
        {
            backgroundColor: Colors.pink50,
            image: cardView("Step 3: Application", images[2]),
            title: 'Apply by answering audio or text questions.'
        },
        {
            backgroundColor: Colors.pink100,
            image: cardView("Step 4: Next Steps", images[3]),
            title: 'Await response from employer',
            subtitle: 'Employers will react out through in-app messaging or text/email.'
        },
    ]
    return (
        <Onboarding 
            pages={pages}
            DoneButtonComponent={DoneButton}
            onSkip={() => {
                dispatch(showFirstLoginAnimation())
                navigation.navigate("Root")
                
            }}
        />
    )
}

const styles = StyleSheet.create({
    
})
