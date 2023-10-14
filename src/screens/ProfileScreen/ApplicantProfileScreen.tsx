import * as React from 'react';
import { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform, TextInput, ScrollView, ActionSheetIOS, Alert, Modal, Linking, Dimensions, Clipboard } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Divider } from 'react-native-elements';
import { getAuth } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from 'react-native-uuid'
import { manipulateAsync } from 'expo-image-manipulator'
import { updateApplicantProfilePicUrlAPI } from '../../apiService/firestoreApis/ApplicantProfileDataApi';
import { ApplicantProfileData } from '../../store/ReducerAllDataTypes';
import { updateApplicantProfileAPI } from '../../apiService/firestoreApis/ApplicantProfileDataApi';
import { validateApplicantProfileData } from '../../util/FormValidation';
import { updateApplicantProfileData, resetApplicantProfileData } from '../../store/ApplicantProfileReducer';
import { StackActions, CommonActions } from '@react-navigation/native';
import { updateProfileImageURL } from '../../store/ApplicantProfileReducer';
import { resetJobListingReducer } from '../../store/ApplicantJobListingReducer';
import { Button, Colors, FAB } from 'react-native-paper';
import { Portal, Provider, Button as PaperButton, Modal as PaperModal } from 'react-native-paper';
import { Card, Title, Paragraph } from 'react-native-paper';
import { resetApplicantAppliedJobReducer } from '../../store/ApplicantAppliedJobPostingReducer';
import FastImage from 'react-native-fast-image'
import { Dropdown } from 'react-native-element-dropdown';
import { fetchReferralCodeUserAPI } from '../../apiService/firestoreApis/ReferralCodeApi';
import { AppEventsLogger } from 'react-native-fbsdk-next';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ApplicantProfileScreen() {

    const pencil = require('../../../assets/images/profilepage-edit.png');
    const checkmark = require('../../../assets/images/profilepage-checkmark.png');

    const auth = getAuth();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { showActionSheetWithOptions } = useActionSheet();
    const applicantProfile = useSelector(state => state.applicantProfileReducer).profileData;

    const [firstName, setFirstName] = React.useState(applicantProfile.firstName);
    const [lastName, setLastName] = React.useState(applicantProfile.lastName);
    const [email, onChangeEmail] = React.useState(applicantProfile.email);
    const [phone, onChangePhone] = React.useState(applicantProfile.phoneNumber);
    const [employmentHistory1, onChangeEmploymentHistory1] = React.useState(applicantProfile.employmentHistory[0] || "");
    const [employmentHistory2, onChangeEmploymentHistory2] = React.useState(applicantProfile.employmentHistory[1] || "");
    const [age, setAge] = React.useState(applicantProfile.age == 0 ? null : applicantProfile.age.toString())
    const [education, setEducation] = React.useState(applicantProfile.education || "")
    const [educationLevel, setEducationLevel] = React.useState(applicantProfile.educationLevel || 1);
    const [highlightEducationLevel, setHighlightEducationLevel] = React.useState(false);

    const [editable, setEditable] = React.useState(false);
    const [showSupportModal, setShowSupportModal] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    const [saveProfileLoading, setSaveProfileLoading] = React.useState(false)

    const educationData = [
        { label: 'In High School', value: 2 },
        { label: 'High School Graduated', value: 3 },
        { label: 'In College', value: 4 },
        { label: 'College Graduated', value: 5 },
    ];

    // update user state with redux
    const userSignOut = () => {

        auth
            .signOut()
            .then(() => console.log('User signed out!'))
            .then(() => navigation.dispatch(StackActions.popToTop()))
            .then(() => dispatch(resetJobListingReducer()))
            .then(() => dispatch(resetApplicantAppliedJobReducer()))
            .then(() => navigation.navigate("Root"))
            .then(() => dispatch(resetApplicantProfileData()));
    }

    const link = applicantProfile.profilePicUrl
    const [profileimg, setProfileimg] = useState(link != "no image" ? {uri: link}:require('../../../assets/images/profileimg.png'));

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
                setLoading(true);

                const manipResult = await manipulateAsync(
                    pickerResult.uri,
                    [ {resize: {width: 250, height: 250}} ],
                    { compress: 0.25 }
                );
                const downloadURL = await uploadImageAsync(manipResult.uri);
                setProfileimg(pickerResult)

                // update profile data
                updateApplicantProfilePicUrlAPI(applicantProfile.id, downloadURL, () => {
                    setLoading(false);
                    dispatch(updateProfileImageURL(downloadURL))
                });

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

    const updateUserProfileInfo = () => {

        // for old users who don't have referral fields
        if (!applicantProfile.referralCode) {
            let referralCode = uuid.v4().slice(0, 6);
            const numRetry = 3;

            for (let i = 0; i < numRetry; i++) {
            fetchReferralCodeUserAPI(referralCode, (data, err) => {
                if (data != null) {
                referralCode = uuid.v4().slice(0, 6);
                console.log(referralCode);
                console.log("Duplicate, generating new referral code");
                } else {
                console.log("Valid new referral code generated!");
                }
            });
            }

            const initialCoins = 200;

            applicantProfile.referralCode = referralCode;
            applicantProfile.referralNum = 0;
            applicantProfile.coins = initialCoins;
        }

        // for old users who don't have availability field
        if (!applicantProfile.availability) {
            applicantProfile.availability = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            }
        }

        const updatedProfile: ApplicantProfileData = {
            id: applicantProfile.id,
            firstName: firstName,
            lastName: lastName,
            userType: applicantProfile.userType,
            email: applicantProfile.email,
            age: age,
            phoneNumber: applicantProfile.phoneNumber,
            longitude: applicantProfile.longitude,
            latitude: applicantProfile.latitude,
            appliedJobs: applicantProfile.appliedJobs,
            education: education,
            educationLevel: educationLevel,
            employmentHistory: [employmentHistory1, employmentHistory2],
            profilePicUrl: applicantProfile.profilePicUrl,
            availability: applicantProfile.availability,
            referralCode: applicantProfile.referralCode,
            referralNum: applicantProfile.referralNum,
            coins: applicantProfile.coins
        }
        const validationErr = validateApplicantProfileData(updatedProfile)
        if (validationErr.length > 0) {
            Alert.alert("Saving Profile Failed", validationErr)
            if (validationErr == 'Please enter your education level') {
                setHighlightEducationLevel(true);
                console.log('highlight: ', highlightEducationLevel);
            }
            return
        } else {
            setSaveProfileLoading(true)
            updateApplicantProfileAPI(updatedProfile, (err) => {
                if (err != null) {
                    Alert.alert("Saving Profile Failed", err)
                    setSaveProfileLoading(false)
                    return
                }
                AppEventsLogger.logEvent("profileSaved", {
                    "date": Date(),
                });
                dispatch(updateApplicantProfileData(updatedProfile))
                setSaveProfileLoading(false)
                setEditable(false);
            })
        }
    }

    const saveButtonToggle = () => {
        if (editable) {
            updateUserProfileInfo()
        }
        setEditable(true);
    }

    async function emailSupportPressed() {
        const operator = Platform.OS === "ios" ? "&" : "?";
        const emailSubject = `[Wapply] Applicant support inquiry`;
        const emailUrl =`mailto:wapplyjobsearch@gmail.com${operator}subject=${emailSubject}`;
        await Linking.openURL(emailUrl);
    }

    const selectAvailability = () => {
        navigation.navigate("TimeAvailabilityView");
    }

    const referralData = applicantProfile.hasOwnProperty('referralCode') && applicantProfile.hasOwnProperty('referralNum');

    const copyReferralCode = () => {
      Clipboard.setString(applicantProfile.referralCode);
    }

    return (
        <Provider>
        <View style={{flex: 1}}>
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
                    <View style={{backgroundColor: 'transparent', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                        <TextInput style={editable ? styles.businessNameTextEditing : styles.businessNameTextSaved} value={firstName} onChangeText={setFirstName} editable={editable} placeholder='First' />
                        <TextInput style={editable ? styles.businessNameTextEditing : styles.businessNameTextSaved} value={lastName} onChangeText={setLastName} editable={editable} placeholder='Last'/>
                    </View>
                </View>
            </View>

            <Modal
            transparent={true}
            visible={loading}
            animationType="fade">
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent"}}>
                <View style={styles.loadingModal}>
                  <Text style={styles.loadingText}>Updating Profile</Text>
                </View>
              </View>
            </Modal>

            <View style={{backgroundColor: 'transparent', paddingTop: 15}}>

                <View style={styles.availabilityView}>
                    <TouchableOpacity style={styles.availabilityButton} onPress={selectAvailability}>
                        <Text style={styles.availabilityText}>
                            Set Time Availability
                        </Text>
                        <Ionicons name="chevron-forward" size={22} color="black" />
                    </TouchableOpacity>
                </View>

                <Divider
                    style={styles.divider}
                    orientation="horizontal"
                    width={1} />

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>


                        <View style={styles.email}>
                            <View style={styles.educationView}>
                            <Text style={styles.educationTitle}>
                                Education
                                {/* <Text style={{fontSize: 12, color: 'gray'}}>i.e. name,year</Text> */}
                            </Text>
                            <Dropdown
                                    style={highlightEducationLevel ? styles.dropdownHighlighted : styles.dropdown}
                                    placeholderStyle={{fontSize: 14}}
                                    selectedTextStyle={!editable ? {fontSize: 14, color: 'gray'} : {fontSize: 14}}
                                    data={educationData}
                                    maxHeight={120}
                                    value={educationLevel}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='Education Level'
                                    disable={!editable}
                                    onChange={val => {
                                        setHighlightEducationLevel(false);
                                        setEducationLevel(val.value);
                                    }}
                                />
                            </View>
                            <TextInput
                                style={editable ? styles.inputEditing : styles.inputSaved }
                                onChangeText={setEducation}
                                value={education}
                                editable={editable}
                                placeholder="Enter education"
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

                    {/* <Divider
                        style={styles.divider}
                        orientation="horizontal"
                        width={1} /> */}

                <View style={{borderRadius: 30,}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.phone}>
                            <Text style={styles.settingTitle}>
                                Age
                            </Text>
                            <TextInput
                                style={editable ? styles.inputEditing : styles.inputSaved}
                                onChangeText={(newAge) => {
                                    setAge(newAge.replace('.', ''))
                                }}
                                value={age}
                                editable={editable}
                                keyboardType='numeric'
                                placeholder='Enter age'
                            />
                        </View>
                    </View>

                    {/* <Divider
                        style={styles.divider}
                        orientation="horizontal"
                        width={1} /> */}

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.employmentHistorySection}>
                            <Text style={styles.settingTitle}>
                                Employment History 1
                            </Text>
                            <TextInput
                                style={editable ? styles.multilineInputEditing: styles.multilineInputSaved}
                                onChangeText={onChangeEmploymentHistory1}
                                value={employmentHistory1}
                                editable={editable}
                                placeholder="Leave blank if you don't have one"
                                multiline={true}
                            />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15}}>
                        <View style={styles.employmentHistorySection}>
                            <Text style={styles.settingTitle}>
                                Employment History 2
                            </Text>
                            <TextInput
                                style={editable ? styles.multilineInputEditing: styles.multilineInputSaved}
                                onChangeText={onChangeEmploymentHistory2}
                                value={employmentHistory2}
                                editable={editable}
                                placeholder="Leave blank if you don't have one"
                                multiline={true}
                            />
                        </View>
                    </View>

                    {/* <Divider
                        style={styles.divider}
                        orientation="horizontal"
                        width={1} /> */}

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.phone}>
                            <Text style={styles.settingTitle}>
                                Phone
                            </Text>
                            <TextInput
                                style={styles.inputSaved}
                                value={phone.substring(0, 2) + ' (' + phone.substring(2, 5) + ') ' + phone.substring(5, 8) + '-' + phone.substring(8)}
                                editable={false}
                            />
                        </View>
                    </View>

                    {/* <Divider
                        style={styles.divider}
                        orientation="horizontal"
                        width={1} /> */}

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.email}>
                            <Text style={styles.settingTitle}>
                                Email
                            </Text>
                            <TextInput
                                style={styles.inputSaved}
                                value={email}
                                editable={false}
                            />
                        </View>
                    </View>

                        { referralData && <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={styles.referrals}>
                                <Text style={styles.settingTitle}>
                                    Referrals
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                  <Text style={styles.settingSubTitle}>
                                    Referral Code: {applicantProfile.referralCode}
                                  </Text>
                                  <Button
                                    icon = 'content-copy'
                                    color={Colors.blue400}
                                    onPress={copyReferralCode}
                                    style={{alignSelf: 'center', marginLeft: -10, borderWidth: 1}}
                                    mode='outlined'
                                  >
                                  Copy
                                  </Button>
                                </View>
                                <Text style={styles.settingSubTitle}>
                                  Users Referred: {applicantProfile.referralNum}
                                </Text>
                                <Text style={styles.settingSubTitle}>
                                  Coins: {applicantProfile.coins}
                                </Text>
                            </View>
                        </View> }

                    {/* <Divider
                        style={styles.divider}
                        orientation="horizontal"
                        width={1} /> */}
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => userSignOut()}
                    >
                        <Text style={styles.logoutText}> Log Out </Text>
                    </TouchableOpacity>
                </View>
            </View>


        </ScrollView>
        <FAB
            style={styles.supportFab}
            icon="face-agent"
            onPress={() => setShowSupportModal(true)}
        />
        <FAB
            style={styles.editFab}
            icon={editable ? "check" : "pencil"}
            label={editable ? "Save" : "Edit"}
            onPress={saveButtonToggle}
            loading={saveProfileLoading}
        />
        <Portal>
            <PaperModal visible={showSupportModal} onDismiss={() => setShowSupportModal(false)} >
                {/* <View style={{}}>
                    <Text>Example Modal.  Click outside this area to dismiss.</Text>
                </View> */}
                <Card style={{width: '60%', alignSelf: 'center', borderRadius: 25}}>
                    <Card.Content>
                        <Title style={{fontWeight: '800'}}>Contact support</Title>
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
        </View>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
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
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 22,
        marginHorizontal: 30,
        marginTop: 50,
        fontWeight: '500',
        fontFamily: 'AcherusGrotesque-Bold',
    },
    profileDetails: {
        backgroundColor: 'transparent',
        margin: 15,
        width: 120,
        height: 120,
    },
    profileImage: {
        backgroundColor: 'transparent',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profileNameText: {
        fontSize: 30,
        marginTop: -5,
        marginBottom: 5,
        color: 'black',
        fontFamily: 'AcherusGrotesque-Bold',
    },
    profileIDText: {
        fontSize: 15,
        color: '#C9CDD0',
    },
    divider: {
        width: '86%',
        marginHorizontal: '7%'
    },
    settingView: {
        marginTop: 35,
        height: "56%",
        borderRadius: 20,
        width: '90%',
        marginLeft: '5%',
        backgroundColor: 'white'
    },
    settingStrip: {
        marginTop: '3%',
        marginHorizontal: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingIcon: {
        width: 60,
        height: 60,
        marginRight: 15,
        backgroundColor: '#F7F6F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    settingText: {
        fontSize: 15,
        fontFamily: 'AcherusGrotesque-Bold',
    },
    inputEditing: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 30,
        color: 'black',
        width: '100%',
        fontFamily: 'Verdana',
        borderBottomWidth: 1,
        borderBottomColor: '#24a695'
    },
    inputSaved: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 30,
        color: 'grey',
        width: '100%',
        fontFamily: 'Verdana',
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    inputMultiline: {
        height: 150,
        marginHorizontal: 30,
        color: 'grey',
        width: '80%',
        fontFamily: 'Verdana'
    },
    educationView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    educationTitle: {
        fontSize: 20,
        marginTop: 20,
        marginHorizontal: 30,
        fontFamily: 'Verdana',
    },
    dropdown: {
        marginLeft: '10%',
        marginTop: windowHeight * 0.017,
        width: windowWidth * 0.4,
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 8,
        height: 35,
    },
    dropdownHighlighted: {
        marginLeft: '10%',
        marginTop: windowHeight * 0.017,
        width: windowWidth * 0.4,
        borderBottomWidth: 2,
        borderColor: 'red',
        paddingHorizontal: 8,
        height: 35,
    },
    settingTitle: {
        fontSize: 20,
        marginTop: 20,
        marginHorizontal: 30,
        fontFamily: 'Verdana',
    },
    settingSubTitle: {
        fontSize: 16,
        marginTop: 10,
        marginHorizontal: 30,
        fontFamily: 'Verdana',
    },
    phone: {
        // backgroundColor: '#f5dac1',
        height: 100,
        width: '80%',
        borderRadius: 15,
    },
    email: {
        // backgroundColor: '#c1f5da',
        height: 100,
        width: '80%',
    },
    referrals: {
      height: 150,
      width: '80%',
    },
    availabilityView: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    availabilityButton: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    availabilityText: {
        fontSize: 20,
        fontFamily: 'Verdana',
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
        marginBottom: '8%',
        paddingVertical: 10,
        alignSelf: 'center'
    },
    logoutText: {
        fontSize: 25,
        color: 'white',
        fontWeight: '500'
    },
    map: {
        marginTop: 20,
        width: '85%',
        height: 300,
        marginLeft: 30
    },
    businessNameTextSaved: {
        marginHorizontal: 10,
        fontSize: 30,
        color: 'black',
        fontFamily: 'Verdana',
    },
    businessNameTextEditing: {
        marginHorizontal: 10,
        fontSize: 30,
        color: 'black',
        fontFamily: 'Verdana',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        borderColor: '#24a695'
    },
    multilineInputSaved: {
        height: 150,
        marginHorizontal: 30,
        color: 'gray',
        borderWidth: 1,
        fontFamily: 'Verdana',
        marginTop: 10,
        paddingTop: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        fontSize: 17
    },
    multilineInputEditing: {
        height: 150,
        marginHorizontal: 30,
        color: 'black',
        borderColor: '#24a695',
        borderWidth: 1,
        fontFamily: 'Verdana',
        marginTop: 10,
        borderRadius: 25,
        paddingTop: 15,
        paddingHorizontal: 15,
        fontSize: 17
    },
    employmentHistorySection: {
        width: '100%',
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingModal: {
      backgroundColor:"white",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'grey',
      width: '60%',
      height: '15%',
      justifyContent: "center",
      alignItems: "center"
    },
    loadingText: {
      fontSize: 20,
      color: 'black',
      fontFamily: 'Verdana',
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
    },
})
