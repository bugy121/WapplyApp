import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Alert, Image, 
    TextInput, Platform, ActionSheetIOS, Linking } from "react-native";
import { Text, View } from '../../components/Themed';
import { Divider } from 'react-native-elements';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { EmployerProfileData, changeEmployerProfileData, resetEmployerProfileData } from '../../store/EmployerProfileReducer';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';
import MapView from 'react-native-maps';
//import GetLocation from 'react-native-get-location';
import Geolocation from '@react-native-community/geolocation';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { encodeEmployerProfileData } from '../../apiService/AWSUtils';
import { updateEmployerProfileDataAPI } from '../../apiService/AWSProfileApi';
import { decodeEmployerProfileData } from '../../apiService/AWSUtils';
import { manipulateAsync } from 'expo-image-manipulator'
import { updateEmployerProfilePicAPI } from '../../apiService/AWSProfileApi';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from 'react-native-uuid';
import { updateEmployerProfileAPI } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import { validateEmployerProfileData } from '../../util/FormValidation';
import { updateEmployerProfilePicUrlAPI } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import { addressToString } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import { StackActions, CommonActions } from '@react-navigation/native';
import { resetJobListingReducer } from '../../store/EmployerJobListingReducer';
import { Button, Colors, FAB } from 'react-native-paper';
import { Portal, Provider, Button as PaperButton, Modal as PaperModal } from 'react-native-paper';
import { Pressable } from 'react-native';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import FastImage from 'react-native-fast-image'

export default function SettingsScreen() {

    const dispatch = useDispatch()
    const auth = getAuth();
    const navigation = useNavigation();
    const employerProfile = useSelector(state => state.employerProfileReducer).profileData;
    const [showSupportModal, setShowSupportModal] = useState(false)


    const [mapLocation, setMapLocation] = useState({
        latitude: employerProfile.location.lat != null ? employerProfile.location.lat : 0.0,
        longitude: employerProfile.location.lon != null ? employerProfile.location.lon : 0.0,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });
    const [errorMsg, setErrorMsg] = useState("");
    
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        
            let location = await Location.getCurrentPositionAsync({});
            setMapLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            })
        })();
    }, []);

    const [email, onChangeEmail] = React.useState(employerProfile.email);
    const [phone, onChangePhone] = React.useState(employerProfile.phoneNumber.toString());
    const [name, onChangeName] = React.useState(employerProfile.firstName + ' ' + employerProfile.lastName);
    let address = '';
    addressToString(employerProfile.address, (addr)  => {
        address = addr;
    })
    const [industry, setIndustry] = React.useState(employerProfile.industry);
    const [businessDescription, setBusinessDescription] = React.useState(employerProfile.businessDescription);
    const [saveProfileLoading, setSaveProfileLoading] = React.useState(false)

    const emailRef = useRef(null);
    const phoneRef = useRef(null);

    const [editable, setEditable] = React.useState(false);
    const [descriptionEditable, setDescriptionEditable] = React.useState(false);

    const link = employerProfile.profilePicUrl
    const [profileimg, setProfileimg] = useState(link != "no image" ? {uri: link}:require('../../../assets/images/profileimg.png'));
    
    const changeUserProfileInfo = (industry: string, businessDescription: string) => {
        const updatedUser: EmployerProfileData = {
            id: employerProfile.id,
            firstName: employerProfile.firstName,
            lastName: employerProfile.lastName,
            userType: employerProfile.userType,
            email: employerProfile.email,
            phoneNumber: employerProfile.phoneNumber,
            address: {
                streetAddr: employerProfile.address.streetAddr,
                complementAddr: employerProfile.address.complementAddr,
                city: employerProfile.address.city,
                state: employerProfile.address.state,
                zip: employerProfile.address.zip,
                country: employerProfile.address.country
            },
            location: {
                lon: employerProfile.location.lon,
                lat: employerProfile.location.lat,
            },
            businessName: employerProfile.businessName,
            businessDescription: businessDescription,
            industry: industry,
            jobPostIds: employerProfile.jobPostIds,
            linkPostIds: employerProfile.linkPostIds,
            internPostIds: employerProfile.internPostIds,
            profilePicUrl: employerProfile.profilePicUrl,
        }
        const validationErr = validateEmployerProfileData(updatedUser)
        if (validationErr.length < 1) {
            setSaveProfileLoading(true)
            updateEmployerProfileAPI(updatedUser, (err: string) => {
                if (err != null) {
                    console.log(err)
                    return
                }
                dispatch(changeEmployerProfileData(updatedUser));
                setSaveProfileLoading(false)
            })
        } else {
            Alert.alert("Save profile error: " + validationErr)
        }
    }

    const saveButtonToggle = () => {
        if (editable) {
            changeUserProfileInfo(industry, businessDescription)
        }
        setEditable(!editable)
    }

    // const descriptionSaveButtonToggle = () => {
    //     if (descriptionEditable) {
    //         changeUserProfileInfo(industry)
    //     }
    //     setDescriptionEditable(!descriptionEditable)
    // }

    const userSignOut = () => {
        auth
            .signOut()
            .then(() => navigation.dispatch(StackActions.popToTop()))
            .then(() => dispatch(resetJobListingReducer()))
            .then(() => navigation.navigate("Root"))
            .then(() => dispatch(resetEmployerProfileData()));

    }
    // const gear = require('../../../assets/images/profilepage-gear.png');
    // const pencil = require('../../../assets/images/profilepage-edit.png');
    // const checkmark = require('../../../assets/images/profilepage-checkmark.png');

    const getGalleryPermission = async () => {
        if (Platform.OS !== 'web') {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need photo album permissions to make this work!');
          } else {
            console.log('Permission Granted!');
          }
        }
    };

    const getCameraPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } =
                await Camera.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
            } else {
                takePhoto();
                console.log('Permission Granted!');
            }
        }
    };

    const pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        handleImagePicked(pickerResult);
    };

    const takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        handleImagePicked(pickerResult);
      };

      const handleImagePicked = async (pickerResult) => {
        try {
            if (!pickerResult.cancelled) {
                const manipResult = await manipulateAsync(
                    pickerResult.uri,
                    [ {resize: {width: 250, height: 250}} ],
                    { compress: 0.25 }
                );
                const downloadURL = await uploadImageAsync(manipResult.uri);
                setProfileimg(pickerResult)

                // update profile data 
                updateEmployerProfilePicUrlAPI(employerProfile.id, downloadURL)
            }
        } catch (e) {
          console.log(e);
          alert("Upload failed, sorry :(");
        }
    }

    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
      
        const fileRef = ref(getStorage(), uuid.v4());
        const result = await uploadBytes(fileRef, blob);
      
        // We're done with the blob, close and release it
        blob.close();
        
        return await getDownloadURL(fileRef);
    }

    async function emailSupportPressed() {
        const operator = Platform.OS === "ios" ? "&" : "?";
        const emailSubject = `[Wapply] Applicant support inquiry`;
        const emailUrl =`mailto:wapplyjobsearch@gmail.com${operator}subject=${emailSubject}`;
        await Linking.openURL(emailUrl);
    }

    const changeProfileImg = () =>
    ActionSheetIOS.showActionSheetWithOptions(
    {
        options: ['Cancel', 'Upload Image'],
        cancelButtonIndex: 0,
    },
    buttonIndex => {
        if (buttonIndex === 0) {
        // cancel action
        } else if (buttonIndex === 1) {
            getGalleryPermission();
            pickImage();
        } 
        // else if (buttonIndex === 2) {
        //     getCameraPermission();
        //     // takePhoto();
        // }
      }
    );

    return (
        <Provider>
        <ScrollView style={styles.container}>
            <View style={{backgroundColor: 'transparent'}}>
                <View style={styles.header}>

                    <Text style={styles.title}> 
                        Profile
                    </Text>
                </View>
                <View style={{backgroundColor: 'transparent', alignItems: 'center'}}> 
                    <TouchableOpacity
                        style={styles.profileDetails}
                        onPress={() => changeProfileImg()}
                    >
                        <FastImage
                            style={styles.profileImage}
                            source={profileimg}
                        />
                    </TouchableOpacity>
                    <View style={{backgroundColor: 'transparent', alignItems: 'center'}}> 
                        <Text style={styles.businessNameText}>{employerProfile.businessName ? employerProfile.businessName : "Business Name Unknown" } </Text>
                    </View>
                </View>
            </View>  

            <View style={styles.businessDescriptionView}> 
                <View style={styles.phone}> 
                    <View style={styles.businessDescriptionTextView}>
                        <Text style={styles.descriptionTitle}> 
                            Business Description
                        </Text>
                    </View>
                    <TextInput
                        ref={phoneRef}
                        style={ editable ? styles.multilineInputEditing: styles.multilineInputSaved }
                        onChangeText={setBusinessDescription}
                        value={businessDescription}
                        editable={editable}
                        multiline={true}
                        placeholder="Write Business Description"
                        spellCheck={false}
                    />
                    { editable && <Text style={{alignSelf: 'flex-end', marginRight: 5, fontWeight: '300', fontSize: 12}}>Character Count: {businessDescription.length}/200</Text> }
                </View>
                <View> 
                    {/* <TouchableOpacity
                        style={styles.editButton}
                        onPress={descriptionSaveButtonToggle}
                    >
                        {descriptionEditable ? 
                        <Image
                        style={styles.editButtonImage}
                        source={checkmark}
                        /> :
                        <Image
                        style={styles.editButtonImage}
                        source={pencil}
                        /> }
                    </TouchableOpacity>             */}
                </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
                <View style={styles.phone}> 
                    <Text style={styles.settingTitle}> 
                        Industry <Text style={{fontSize: 12, color: 'gray'}}>i.e. restaurant</Text>
                    </Text>
                    <TextInput
                        style={ editable ? styles.inputEditing : styles.inputSaved }
                        onChangeText={setIndustry}
                        value={industry}
                        editable={editable}
                        placeholder="Empty"
                        spellCheck={false}
                    />
                </View>
                {/* <View> 
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={saveButtonToggle}
                    >
                        {editable ? 
                        <Image
                        style={styles.editButtonImage}
                        source={checkmark}
                        /> :
                        <Image
                        style={styles.editButtonImage}
                        source={pencil}
                        /> }
                    </TouchableOpacity>            
                </View> */}
            </View>

            <Divider 
                style={styles.divider}
                orientation="horizontal" 
                width={1} />

            <View style={{borderRadius: 30,}}> 
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
                    <View style={styles.phone}> 
                        <Text style={styles.settingTitle}> 
                            Address
                        </Text>
                        <TextInput
                            style={styles.inputSaved}
                            value={address}
                            editable={false}
                            spellCheck={false}
                        />
                    </View>
                </View>

                <Divider 
                    style={styles.divider}
                    orientation="horizontal" 
                    width={1} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
                    <View style={styles.phone}> 
                        <Text style={styles.settingTitle}> 
                            Manager Name
                        </Text>
                        <TextInput
                            ref={phoneRef}
                            style={styles.inputSaved}
                            onChangeText={onChangeName}
                            value={name}
                            editable={false}
                            spellCheck={false}
                        />
                    </View>
                </View>

                <Divider 
                    style={styles.divider}
                    orientation="horizontal" 
                    width={1} />
                    
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
                    <View style={styles.phone}> 
                        <Text style={styles.settingTitle}> 
                            Phone
                        </Text>
                        <TextInput
                            ref={phoneRef}
                            style={styles.inputSaved}
                            onChangeText={onChangePhone}
                            value={phone}
                            editable={false}
                            spellCheck={false}
                        />
                    </View>
                </View>

                <Divider 
                    style={styles.divider}
                    orientation="horizontal" 
                    width={1} />

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
                    <View style={styles.email}> 
                        <Text style={styles.settingTitle}> 
                            Email
                        </Text>
                        <TextInput
                            ref={emailRef}
                            style={styles.inputSaved}
                            onChangeText={onChangeEmail}
                            value={email}
                            editable={false}
                            spellCheck={false}
                        />
                    </View>
                </View>

                <Divider 
                    style={styles.divider}
                    orientation="horizontal" 
                    width={1} />

                <View style={{height: 400}}> 
                    <Text style={styles.settingTitle}> 
                        Hiring Location
                    </Text>
                    <MapView
                        pitchEnabled={false}
                        rotateEnabled={false}
                        zoomEnabled={false}
                        scrollEnabled={false}
                        initialRegion={mapLocation}
                        style={styles.map}
                    >
                    </MapView>
                </View>

                <Divider 
                    style={styles.divider}
                    orientation="horizontal" 
                    width={1} />
            </View>

            <View> 
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => userSignOut()}
                >
                    <Text style={styles.logoutText}> Log Out </Text>
                </TouchableOpacity>
            </View>
            
            {/* <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => printUserType()}
                >
                <Text style={styles.logoutText}> Go to login page without log out </Text>
            </TouchableOpacity>
             */}

        </ScrollView>
        <FAB
            style={styles.supportFab}
            icon={"face-agent"}
            onPress={() => setShowSupportModal(true)}
        />
    <Portal>
        <PaperModal visible={showSupportModal} onDismiss={() => setShowSupportModal(false)} >
            {/* <View style={{}}>
                <Text>Example Modal.  Click outside this area to dismiss.</Text>
            </View> */}
            <Card style={{width: '60%', alignSelf: 'center', borderRadius: 25}}>
                <Card.Content>
                    <Title style={{fontWeight: '800'}}>Contact support</Title>
                    <Paragraph style={{fontSize: 20, paddingVertical: 10, fontWeight: '600'}}>Phone</Paragraph>
                    <Paragraph style={{fontSize: 14}}>
                    9AM - 1PM (907-978-1983)
                    </Paragraph>
                    <Paragraph style={{fontSize: 14}}>
                    1PM - 5PM (805-403-8868)
                    </Paragraph>
                    <Paragraph style={{fontSize: 14}}>
                    5PM - 9PM (510-384-8598)
                    </Paragraph>
                    <Paragraph style={{fontSize: 20, paddingVertical: 10, fontWeight: '600'}}>Email</Paragraph>
                    <Paragraph style={{fontSize: 14}}>
                    wapplyjobsearch@gmail.com
                    </Paragraph>
                    <Button icon='email' onPress={emailSupportPressed} mode='contained' color={Colors.greenA200} style={{marginTop: 20, borderRadius: 25}}>
                            Email Support
                    </Button>
                </Card.Content>
            </Card>
        </PaperModal>
    </Portal>
    <FAB 
        style={styles.editFab}
        icon={editable ? "check" : "pencil"}
        label={editable ? "Save" : "Edit"}
        onPress={saveButtonToggle}
        loading={saveProfileLoading}
    />
    </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
      },
    header: {
        flexDirection: 'row',
        // backgroundColor: '#e9c1f5',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 18,
        marginHorizontal: 30,
        marginTop: 50,
        fontWeight: '500',
        fontFamily: 'Verdana',
    },
    businessDescriptionView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    profileDetails: {
        backgroundColor: 'transparent',
        margin: 20,
        width: 120,
        height: 120,
    },
    profileImage: {
        backgroundColor: 'transparent',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    multilineInputSaved: {
        height: 160,
        color: 'gray',
        borderWidth: 1,
        borderColor: 'black',
        fontFamily: 'Verdana',
        marginTop: 10,
        paddingTop: 20,
        paddingHorizontal: 15,
        borderRadius: 25,
        fontSize: 17,
        zIndex: 1,
    },
    multilineInputEditing: {
        height: 160,
        borderWidth: 1,
        color: 'black',
        fontFamily: 'Verdana',
        marginTop: 10,
        borderRadius: 25,
        paddingTop: 20,
        paddingHorizontal: 15,
        fontSize: 17,
        zIndex: 1,
    },
    businessNameText: {
        marginHorizontal: 10,
        fontSize: 30,
        marginBottom: 10,
        color: 'black',
        fontFamily: 'Verdana',
    },
    profileIDText: {
        fontSize: 15,
        color: '#C9CDD0',
    },
    divider: {
        width: '86%', 
        marginHorizontal: '7%'
    },
    settings: {
        alignItems: "center",
        // backgroundColor: "#DDDDDD",
        marginTop: 50,
        marginRight: 40,
    },
    settingButton: {
        width: 25,
        height: 25,
        // backgroundColor: 'black',
    },
    settingTitle: {
        fontSize: 20,
        marginTop: 20,
        marginHorizontal: 30,
        fontFamily: 'Verdana',
    },
    businessDescriptionTextView: {
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 2,
    },
    descriptionTitle: {
        fontSize: 16,
        fontFamily: 'Verdana',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        position: 'absolute',
        zIndex: 2,
    },
    email: {
        // backgroundColor: '#c1f5da',
        height: 100,
        width: '80%',
    },
    phone: {
        // backgroundColor: '#f5dac1',
        // height: 100,
        width: '80%',
        borderRadius: 15,
    },
    inputSaved: {
        // height: 40,
        marginHorizontal: 30,
        marginVertical: 10,
        color: 'grey',
        width: '90%',
        fontFamily: 'Verdana',
        // backgroundColor: 'blue',
    },
    inputEditing: {
        // height: 40,
        marginHorizontal: 30,
        marginVertical: 10,
        color: 'black',
        width: '90%',
        fontFamily: 'Verdana',
        // backgroundColor: 'blue',
    },
    editButton: {
        marginRight: 200, 
        marginTop: 20,
    },
    editButtonImage: {
        width: 30,
        height: 30,
        // backgroundColor: 'black',
        marginLeft: 10
    },
    editButtonText: {
        fontSize: 18,
        color: 'grey',
        fontFamily: 'Verdana'
    },
    logoutButton: {
        // backgroundColor: 'black',
        marginTop: 50,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'red',
        borderRadius: 20,
        alignItems: 'center',
        width: '50%',
        height: 50,
        marginBottom: '8%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    logoutText: {
        fontSize: 25,
        color: 'white',
        fontWeight: '500'
    },
    map: {
        marginTop: 20,
        marginLeft: "5%",
        width: '90%',
        height: 300,
    },
    supportFab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
    },
    editFab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        top: 40
    }
})