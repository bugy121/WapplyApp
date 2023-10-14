import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/core';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Alert } from 'react-native';
import { EmployerProfileData } from '../../store/ReducerAllDataTypes';
import { changeEmployerProfileData } from '../../store/EmployerProfileReducer';
import Geolocation from 'react-native-geolocation-service';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { BarIndicator } from 'react-native-indicators';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addNewEmployerProfileAPI } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import { addNewPhoneNumberEmailPairAPI } from '../../apiService/firestoreApis/authenticationApi';

// FCM
import messaging from '@react-native-firebase/messaging';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpEmployerLocationScreen({route}) {

    const auth = getAuth();
    const navigation = useNavigation();
    const employerProfile = useSelector(state => state.employerProfileReducer);
    const dispatch = useDispatch()
    const [locationGranted, setLocationGranted] = useState(false);

    const [locationLoading, setLocationLoading] = useState(true)
    const [longitude, setLongitude] = useState(route.params.coordinates[0].longitude)
    const [latitude, setLatitude] = useState(route.params.coordinates[0].latitude)
    const [longitudeDelta, setLongitudeDelta] = useState(0.003)
    const [latitudeDelta, setLatitudeDelta] = useState(0.003)
    // const [longitude, setLongitude] = useState(employerProfile.profileData.location.lon)
    // const [latitude, setLatitude] = useState(employerProfile.profileData.location.lat)

    const [signupLoading, setSignupLoading] = useState(false);
    
    useEffect(() => { 
        (async () => {
            const permission = await Geolocation.requestAuthorization("whenInUse").then((val) => {
                setLocationGranted(true);

                // if (!locationGranted) {
                //     Alert.alert("Permission to access location was denied, please enable and retry again");
                //     return
                // }
                
                    Geolocation.getCurrentPosition(
                        (position) => {
                            // setLongitude(position.coords.longitude)
                            // setLatitude(position.coords.latitude)
                            if (longitude == 0 && latitude == 0) {
                                setLongitude(position.coords.longitude)
                                setLatitude(position.coords.latitude)
                            }
                            setLocationLoading(false)
                        },
                        (error) => {
                          // See error code charts https://github.com/Agontuk/react-native-geolocation-service.
                            Alert.alert("Failed to get location: please make application has location services and restart application :( " + error)
                        },
                        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                    );
            }).catch((err) => {
                Alert.alert("Requesting permission for location failed, please give access to location services in settings")
                console.log(err);
            })
        })();
    }, []);

    const goBackToPrevScreen = () => {
        navigation.goBack();
    }

    // // device notification token
    // messaging().getToken().then((token) => {
    //     console.log('token', token);
    // });

    async function handleSignUp() {
        setSignupLoading(true);
          createUserWithEmailAndPassword(auth, employerProfile.profileData.email, route.params?.password)
          .then(userCredentials => {
              const user = userCredentials.user;
              console.log('user object: ', user);
              const newUser: EmployerProfileData = {
                id: user.uid,
                firstName: employerProfile.profileData.firstName,
                lastName: employerProfile.profileData.lastName,
                userType: employerProfile.profileData.userType,
                email: employerProfile.profileData.email,
                phoneNumber: employerProfile.profileData.phoneNumber,
                address: {
                    streetAddr: employerProfile.profileData.address.streetAddr,
                    complementAddr: employerProfile.profileData.address.complementAddr,
                    city: employerProfile.profileData.address.city,
                    state: employerProfile.profileData.address.state,
                    zip: employerProfile.profileData.address.zip,
                    country: employerProfile.profileData.address.country
                },
                location: {
                    lon: longitude,
                    lat: latitude
                },
                businessName: employerProfile.profileData.businessName,
                businessDescription: employerProfile.profileData.businessDescription,
                industry: employerProfile.profileData.industry,
                jobPostIds: employerProfile.profileData.jobPostIds,
                linkPostIds: employerProfile.profileData.linkPostIds,
                internPostIds: employerProfile.profileData.internPostIds,
                profilePicUrl: "no image",
            }
  
              saveProfileDataToFirebase(newUser);
          })
          .catch(err => {
            setSignupLoading(false);
            if (err.code == "auth/email-already-in-use") {
                Alert.alert("Please use different email")
            } else if (err.code == "auth/invalid-password") {
                Alert.alert("The provided value for the password user property is invalid. It must be a string with at least six characters.")
            } else {
                Alert.alert("Sign up error: unknown D:. Sorry, please restart the process")
            }
            console.log(JSON.stringify(err));
          })
  
    }

    async function saveProfileDataToFirebase(profile: EmployerProfileData) {
        //somehow doesnt await
        // const encodedUser = encodeEmployerProfileData(profile)
        // await createEmployerProfileAPI(encodedUser)
        addNewEmployerProfileAPI(profile, (err: string) => {
            setSignupLoading(false);
            if (err == null) {
                // save phone number to email pair to firebase
                addNewPhoneNumberEmailPairAPI(profile);

                // Subscribe employer topic
                messaging()
                .subscribeToTopic('employer')
                .then(() => console.log('Subscribed to employer topic!'))
                .catch((err) => console.log('Cannot subscribed to employer topic! ', err));

                console.log("Uploaded profile successfully")
                dispatch(changeEmployerProfileData(profile))
                navigation.navigate('EmployerOnboarding')
            } else {
                Alert.alert("Cannot upload profile");
                console.log(err);
            }
        })

    }

    const signUpPressed = () => {
        handleSignUp();
    }


    return (
        <View style={styles.container}>
            <View style={{backgroundColor: '#f5f7fb', paddingLeft: 30}}>
                <Text style={styles.title}>Last Step: Location</Text>
                <Text style={styles.titleDescription}>Move the pin so the location is accurate</Text>
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
                // provider={PROVIDER_GOOGLE}
            >
                <Marker coordinate={{latitude: latitude, longitude: longitude}} />
            </MapView>

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
        paddingTop: 80,
        alignItems: 'center',
    },
    title: {
        fontSize: 30, 
        fontWeight: 'bold', 
        paddingBottom: 10
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
        height: '60%',
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