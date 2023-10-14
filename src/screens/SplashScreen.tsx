import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { Text, View } from '../components/Themed';
import { useDispatch, useSelector, } from 'react-redux';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react'
import VersionCheck from 'react-native-version-check';
import { updateApplicantProfileData } from '../store/ApplicantProfileReducer';
import { changeEmployerProfileData } from '../store/EmployerProfileReducer';
import { fetchEmployerProfile } from '../apiService/firestoreApis/employerProfileApiFireStore';
import { fetchApplicantProfileDataAPI } from '../apiService/firestoreApis/ApplicantProfileDataApi';


export default function SplashScreen () {
    const auth = getAuth();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    let uid: string = "";

    const postInfo = useSelector(state => state.employerJobListingReducer);
    const employerInfo = useSelector(state => state.employerProfileReducer).profileData;
    const applicantInfo = useSelector(state => state.applicantProfileReducer).profileData;

    const [loginLoading, setLoginLoading] = useState(false);

    const updateUser = (userInfo) => {
        // if (!loginLoading) {
            if (userInfo.userType.toLowerCase() == "employer") {
                dispatch(changeEmployerProfileData(userInfo));
            } else if (userInfo.userType.toLowerCase() == "applicant") {
                // update applicant profile data
                dispatch(updateApplicantProfileData(userInfo));
            }
            navigation.navigate("Root");
        // }
    }

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                const uid = user.uid
                fetchEmployerProfile(uid, async (err, profile) => {
                    if (err != null) {
                        return
                    }
                    await updateUser(profile)
                })
                fetchApplicantProfileDataAPI(uid, async (data) => {
                    // update user profile data
                    await updateUser(data);
                })
            } else {
                navigation.navigate("Root");
            }
        })
        
    }, [])

    const splashScreenPath = require('../../assets/images/lr-logo.png');
    return (
        <View style={styles.content}>
            {/* <Image
                style={styles.SplashScreenImage}
                source={splashScreenPath}
                /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SplashScreenImage: {
        width: 300,
        height: 300
    }
})
