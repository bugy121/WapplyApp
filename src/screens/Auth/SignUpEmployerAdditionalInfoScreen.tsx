import * as React from 'react';
import { useState, } from 'react';
import { StyleSheet, TextInput, Platform } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/core';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { changeEmployerProfileData } from '../../store/EmployerProfileReducer';
import { EmployerProfileData } from '../../store/ReducerAllDataTypes';
import { Alert, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpEmployerAdditionalInfoScreen({route}) {
    const navigation = useNavigation();
    const employerProfile = useSelector(state => state.employerProfileReducer);
    const dispatch = useDispatch()

    const [businessName, setBusinessName] = useState("");
    const [streetAddr, setStreetAddr] = useState("");
    const [complementAddr, setComplementAddr] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("USA");

    // const [coordinates, setCoordinates] = useState([{longitude: 0, latitude: 0}]);

    const goBackToPrevScreen = () => {
        navigation.goBack();
    }

    const goNextScreen = async () => {
        const capAddr = await capitalizeAddr(streetAddr);
        const valid = await validationAndSignUp();

        if (!valid) {
            return
        }

        const updatedEmployerData: EmployerProfileData = {
            id: employerProfile.profileData.uid,
            firstName: employerProfile.profileData.firstName,
            lastName: employerProfile.profileData.lastName,
            userType: employerProfile.profileData.userType,
            email: employerProfile.profileData.email,
            phoneNumber: employerProfile.profileData.phoneNumber,
            address: {
                streetAddr: capAddr,
                complementAddr: complementAddr,
                city: city[0].toUpperCase() + city.substring(1),
                state: state.toUpperCase(),
                zip: zip,
                country: country
            },
            location: {
                lon: employerProfile.profileData.location.lon != null ? employerProfile.profileData.location.lon : -1,
                lat: employerProfile.profileData.location.lat != null ? employerProfile.profileData.location.lat : -1,
            },
            businessName: businessName,
            businessDescription: employerProfile.profileData.businessDescription,
            industry: employerProfile.profileData.industry,
            jobPostIds: employerProfile.profileData.jobPostIds,
            linkPostIds: employerProfile.profileData.linkPostIds,
            internPostIds: employerProfile.profileData.internPostIds,
            profilePicUrl: 'no image'
        }
        await dispatch(changeEmployerProfileData(updatedEmployerData))

        const decodedAddr = streetAddr + " " + city + " " + state;
        let coordinates;
        await Location.geocodeAsync(decodedAddr).then((loc) => {
            // setCoordinates(loc);
            coordinates = loc;

            if (!loc[0]) {
                Alert.alert('Please enter a valid address');
                console.log('here');
                return;
            } else {
                navigation.navigate("SignUpEmployerLocation", {
                    password: route.params?.password,
                    coordinates: coordinates,
                })
            }
            // setCoordinates({longitude: 0, latitude: 0});
        });
    }

    const validationAndSignUp = () => {
        if (businessName.length == 0) {
            Alert.alert("Business name is empty")
            return false
        } 
        if (businessName.length < 3) {
            Alert.alert("Business name is too short")
            return false
        } 
        if (businessName.length > 20) {
            Alert.alert("Business name cannot exceed 20 characters")
            return false
        }
        if (streetAddr.length == 0) {
            Alert.alert("Street address is empty")
            return false
        }
        if (city.length == 0) {
            Alert.alert("City is empty")
            return false
        }
        if (state.length == 0) {
            Alert.alert("State is empty")
            return false
        }
        if (!zip) {
            Alert.alert("Zip code is empty")
            return false
        }
        if (zip.length != 5) {
            Alert.alert("Enter a valid zip code")
            return false
        }
        return true;
    }

    const capitalizeAddr = (value) => {
        const splitAddr = value.split(' ');
        let capAddr = ''
        for (let s of splitAddr) {
            capAddr += s[0].toUpperCase() + s.substring(1) + ' ';
        }
        capAddr = capAddr.substring(0, capAddr.length - 1);
        return capAddr;
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
                    placeholder = "Business Name"
                    onChangeText = {setBusinessName}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder = "Street Address"
                    value={streetAddr}
                    onChangeText = {setStreetAddr}
                    autoCorrect={false}
                />
                <View style={{flexDirection: 'row', borderRadius: 20, backgroundColor: 'transparent'}}>
                <TextInput
                    style={[styles.textInput, {width: '40%'}]}
                    placeholder = "Apt/Unit"
                    value={complementAddr}
                    onChangeText = {setComplementAddr}
                    autoCorrect={false}
                />
                <TextInput
                    style={[styles.textInput, {width: '40%'}]}
                    placeholder = "City"
                    value={city}
                    onChangeText = {setCity}
                    autoCorrect={false}
                />
                </View>
                <View style={{flexDirection: 'row', borderRadius: 20, backgroundColor: 'transparent'}}>
                    <TextInput
                        style={[styles.textInput, {width: '20%'}]}
                        placeholder = "State"
                        value={state}
                        onChangeText = {setState}
                        autoCorrect={false}
                    />
                    <TextInput
                        style={[styles.textInput, {width: '60%'}]}
                        placeholder = "Zip Code"
                        value={zip}
                        onChangeText = {setZip}
                        autoCorrect={false}
                    />
                </View>
                <View style={{backgroundColor: 'transparent'}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {goBackToPrevScreen}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Go Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={goNextScreen}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Continue</Text>
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
        backgroundColor: '#f5f7fb',
        paddingTop: 40,
    },
    content: {
        backgroundColor: '#f5f7fb',
        paddingTop: 40,
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
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        width: windowWidth / 2,
        height: windowHeight / 10,
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
})
