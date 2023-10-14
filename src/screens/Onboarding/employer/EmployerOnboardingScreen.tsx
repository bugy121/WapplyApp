import Onboarding from 'react-native-onboarding-swiper';
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
    Text, View, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, 
    TouchableWithoutFeedback, Keyboard, Dimensions, Image
  } from 'react-native';
import { Button, Colors } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation from '../../../navigation';
import { useNavigation } from '@react-navigation/core';

const DoneButton = ({isLight, ...props}) => {
    const navigation = useNavigation()
    return (
        <Button color='black' onPress={() => navigation.navigate("Root")}>
            Done
        </Button>
    )

}

const cardView = (title: string, imageSource: number) => {
    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    return (
        <SafeAreaView>
            <View style={{height: windowHeight / 2, width: windowWidth, justifyContent: 'flex-start', alignItems: 'center', alignContent: 'flex-start', marginHorizontal: 20, marginTop: -50}}>
                <Text style={{fontSize: 28, alignContent: 'center', paddingBottom: 20, fontWeight: '600'}}>{title}</Text>
                <Image resizeMode='contain' source={imageSource} style={{width: windowWidth - 30,height: windowHeight / 2, borderRadius: 15}} />
            </View>
        </SafeAreaView>
    )
}

export default function EmployerOnboardingScreen() {
    const navigation = useNavigation()
    const images = [
        require('../../../../assets/images/onboard/onboard-employer-1.jpg'),
        require('../../../../assets/images/onboard/onboard-employer-2.jpg'),
        require('../../../../assets/images/onboard/onboard-employer-3.jpg'),
        require('../../../../assets/images/onboard/onboard-employer-4.jpg')
    ]
    const pages = [
        {
            backgroundColor: Colors.lightGreenA100,
            image: cardView("Step 1: Fill out profile information", images[0]),
            title: 'Fill out information such as business description and industry.'
        },
        {
            backgroundColor: Colors.lightBlue100,
            image: cardView("Step 2: Create job post", images[1]),
            title: 'Specify as much information as possible in your post and once you create your post, it is live!'
        },
        {
            backgroundColor: Colors.pink50,
            image: cardView("Step 3: Review applications", images[2]),
            title: 'You\'ll receive applicants for your job posts and you can review each application.'
        },
        {
            backgroundColor: Colors.pink100,
            image: cardView("Step 4: Contact", images[3]),
            title: 'Get in contact with applicants through in-app messaging or text/email'
        },
    ]
    return (
        <Onboarding 
            pages={pages}
            DoneButtonComponent={DoneButton}
            onSkip={() => navigation.navigate("Root")}
            onDone={() => navigation.navigate("Root")}
        />
    )
}

const styles = StyleSheet.create({

})
