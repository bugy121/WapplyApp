import { StyleSheet, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from '../../components/Themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinkPostData } from '../../store/ReducerAllDataTypes';
import { useNavigation } from '@react-navigation/core';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { addNewLinkPostAPI } from '../../apiService/firestoreApis/EmployerJobPostApi';
import uuid from 'react-native-uuid'
import { geohashForLocation } from 'geofire-common';
import { bulkAddLinkPost } from '../../store/EmployerJobListingReducer';
import { saveLinkPostingData, resetLinkPostingData } from '../../store/EmployerLinkPostCreationReducer';

const windowWidth = Dimensions.get('window').width;

export default function LinkPostCreationScreen({route}) {
    const newJobPostData = useSelector(state => state.employerPostingCreationReducer);
    const userInfo = useSelector(state => state.employerProfileReducer).profileData;

    const dispatch = useDispatch();
    const [roleName, setRoleName] = useState('');
    const [hourlySalaryLow, setHourlySalaryLow] = useState('0');
    const [hourlySalaryHigh, setHourlySalaryHigh] = useState('0');
    const [hourlyWorkLow, setHourlyWorkLow] = useState('0');
    const [hourlyWorkHigh, setHourlyWorkHigh] = useState('0');

    const [fulltimeSelected, setFulltime] = useState(false);
    const [parttimeSelected, setParttime] = useState(false);
    const [internshipSelected, setInternship] = useState(false);
    const [benefits, setBenefits] = useState('');
    const [description, setDescription] = useState('');

    const [streetAddr, setStreetAddr] = useState("");
    const [city, setCity] = useState("");

    const [businessName, setBusinessName] = useState('');
    const [businessDescription, setBusinessDescription] = useState('');
    const [externalLink, setExternalLink] = useState('');

    const navigation = useNavigation();
    const scrollRef = useRef();

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    // Reset screen if navigated from finishing creating a job post
    const resetPostState = () => {
        if (route.params) {
            setRoleName("")
            setHourlySalaryLow("0")
            setHourlySalaryHigh("0")
            setHourlyWorkLow("0")
            setHourlyWorkHigh("0")
            setFulltime(false)
            setParttime(false)
            setInternship(false)
            setBenefits("");
            scrollToTop();
            route.params = undefined;
            navigation.navigate("Root")
        }
    }
    resetPostState();

    const addLinkPost = async () => {
        // validate post data
        if (!businessName) {
            Alert.alert('Please enter your business name!');
            return
        } else if (!roleName) {
            Alert.alert('Please enter a role name!');
            return
        } else if (!description) {
            Alert.alert('Please enter a role description!');
            return
        } else if (!streetAddr) {
            Alert.alert('Please enter the street address!');
            return
        } else if (!city) {
            Alert.alert('Please enter the city!');
            return
        } else if (!internshipSelected && !parttimeSelected && !fulltimeSelected) {
            Alert.alert('Please select at least one job type!');
            return
        } else if (!externalLink) {
            Alert.alert('Please enter an external link!');
            return
        }

        await Location.geocodeAsync(streetAddr + ', ' + city).then((loc) => {
            if (!loc[0]) {
                Alert.alert('Please enter a valid address');
                return;
            } else {
                const newLinkPost: LinkPostData = {
                    id: uuid.v4().toString(),
                    posterId: userInfo.id,
                    datePosted: Date(),
                    latestDateBumped: Date(),
                    address: {
                        streetAddr: streetAddr,
                        complementAddr: '',
                        city: city,
                        state: 'CA',
                        country: 'USA',
                        zip: '',
                    },
                    roleName: roleName,
                    roleBenefits: benefits,
                    roleDescription: description,
                    businessName: businessName,
                    businessDescription: businessDescription,
                    salaryRangeLow: parseInt(hourlySalaryLow),
                    salaryRangeHigh: parseInt(hourlySalaryHigh),
                    workHourLow: parseInt(hourlyWorkLow),
                    workHourHigh: parseInt(hourlyWorkHigh),
                    isInternship: internshipSelected,
                    isParttime: parttimeSelected,
                    isFulltime: fulltimeSelected,
                    status: "ACTIVE",
                    location: {
                        lon: loc[0].longitude,
                        lat: loc[0].latitude,
                    },
                    geoHash: geohashForLocation([loc[0].latitude, loc[0].longitude]),
                    logoImgUrl: 'no image',
                    distanceToApplicant: 0,
                    externalLink: externalLink,
                }
                addNewLinkPostAPI(userInfo.id, newLinkPost).then(() => {
                    dispatch(bulkAddLinkPost([newLinkPost]))
                    navigation.navigate('Root');
                    Alert.alert('Create new link post successfully!');
                });
            }
        });
    }

    const goPrev = () => {
        navigation.goBack()
    }

  return (
    <View style={{flex: 1}}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView ref={scrollRef} style={{flex: 1, paddingHorizontal: 20, paddingTop:70, paddingBottom: 50, backgroundColor: 'white'}}>
        <TouchableOpacity
            onPress={goPrev}
            style={{paddingBottom: 15}}
            >
                <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
        <Text style={[styles.sectionTitle, {fontSize: 24, marginBottom: 15, textAlign: 'center'}]}>Create a New Job Post</Text>
        <Text style={styles.sectionTitle}>Business Info</Text>
        <TextInput value={businessName}
            onChangeText={setBusinessName}
            style={styles.inputField}
            placeholder="Business Name"
        />
        {/* <TextInput value={businessDescription}
            onChangeText={setBusinessDescription}
            style={styles.multilineInput}
            multiline={true}
            placeholder="Business Description (optional)"
        /> */}
        <Text style={styles.sectionTitle}>Job Title</Text>
        <TextInput value={roleName}
            onChangeText={setRoleName}
            style={styles.inputField}
            placeholder="Brief but specific title"
        />
        <TextInput value={description}
            onChangeText={setDescription}
            style={styles.multilineInput}
            multiline={true}
            placeholder="Description"
        />
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput
            style={styles.textInput}
            placeholder = "Street Address"
            value={streetAddr}
            onChangeText = {setStreetAddr}
            autoCorrect={false}
        />
        <TextInput
            style={[styles.textInput, {width: '40%'}]}
            placeholder = "City"
            value={city}
            onChangeText = {setCity}
            autoCorrect={false}
        />
        <View style={{flexDirection: 'row'}}>
            <Text style={[styles.sectionTitle, {paddingTop: 2}]}>
                Salary Range (Optional)
            </Text>
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 30, justifyContent: 'space-between', padding: 10}}>
            <View style={styles.salaryBox}>
                <Text style={styles.dollarText}>$</Text>
                <TextInput value={hourlySalaryLow}
                    keyboardType='numeric'
                    onChangeText={setHourlySalaryLow}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>/hr</Text>
            </View>

            <Text style={{fontSize: 22, flex: 1, alignSelf: 'center', textAlign: 'center'}}>To</Text>
            <View style={styles.salaryBox}>
                <Text style={styles.dollarText}>$</Text>
                <TextInput value={hourlySalaryHigh}
                    keyboardType='numeric'
                    onChangeText={setHourlySalaryHigh}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>/hr</Text>
            </View>

        </View>
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.sectionTitle}>Work Hours (Optional)</Text>
            <AntDesign name='clockcircle' size={22} color={'#26c7fc'} style={{paddingLeft: 8}} />
        </View>

        <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 30, justifyContent: 'space-between', padding: 10}}>
            <View style={styles.salaryBox}>
                <TextInput value={hourlyWorkLow}
                    keyboardType='numeric'
                    onChangeText={setHourlyWorkLow}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>hours</Text>
            </View>

            <Text style={{fontSize: 22, flex: 1, alignSelf: 'center', textAlign: 'center'}}>To</Text>
            <View style={styles.salaryBox}>
                <TextInput value={hourlyWorkHigh}
                    keyboardType='numeric'
                    onChangeText={setHourlyWorkHigh}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>hours</Text>
            </View>

        </View>

        <Text style={styles.sectionTitle}>Employment Type</Text>
        <View style={{marginBottom: 30, flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 25, padding: 10}}>
            <TouchableOpacity style={{borderWidth: 1, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, padding: 10, backgroundColor: fulltimeSelected ? 'gray' : 'white'}}
                onPress={() => {
                    setFulltime(!fulltimeSelected)
                }}
            >
                <Text style={[styles.employmentType, {paddingRight: 10}]}>Fulltime</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, padding: 10, backgroundColor: parttimeSelected ? 'gray' : 'white', marginHorizontal: -25}}
                onPress={() => {
                    setParttime(!parttimeSelected)
                }}
            >
                <Text style={[styles.employmentType, {paddingRight: 10}]}>Part-time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderWidth: 1, borderTopRightRadius: 10, borderBottomRightRadius: 10, padding: 10, backgroundColor: internshipSelected ? 'gray' : 'white'}}
                onPress={() => {
                    setInternship(!internshipSelected)
                }}
            >
                <Text style={styles.employmentType}>Internship</Text>
            </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Job Benefits (Optional)</Text>
          <Text style={{fontWeight: '300', fontSize: 12}}>Please enter each benefit on its own line</Text>
          <TextInput value={benefits}
              onChangeText={setBenefits}
              style={styles.multilineInput}
              multiline={true}
              placeholder="Benefits"
              />
              <Text style={{alignSelf: 'flex-end', marginRight: 5, fontWeight: '300', fontSize: 12}}>Character Count: {benefits.length}/500</Text>
        </View>

        <Text style={styles.sectionTitle}>External Link</Text>
        <TextInput value={externalLink}
            onChangeText={setExternalLink}
            style={styles.multilineInput}
            multiline={true}
            placeholder="Put your link here"
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity style={[styles.savePostingButtonStyle, {width: windowWidth / 2}]}
            onPress={addLinkPost}>
                <Text style={{fontSize: 22}}>Add Link Post</Text>
            </TouchableOpacity>
        </View>

    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    inputField: {
        fontSize: 22,
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 30,
    },
    multilineInput: {
        fontSize: 22,
        marginBottom: 10,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        height: 150,
    },
    item: {
        fontSize: 22,
        marginBottom: 10,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        height: 150
    },
    salaryBox: {
        flex: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        //padding: 8,
        //width: windowWidth / 3,
        height: 50,
        flexDirection: 'row',
        //margin: 10,
    },
    salaryInput: {
        flex: 2,
        fontSize: 22,
        //marginBottom: 30,
        borderRadius: 10,
        paddingRight: 10,
        paddingLeft: 5,
        //width: windowWidth / 3,
        textAlign: 'right'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5,
        marginTop: 10,
    },
    sectionTitleAsterisk: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
    },
    hourText: {
        fontSize: 20,
        alignSelf: 'center',
        includeFontPadding: false,
        paddingRight: 12,
    },
    employmentType: {
        fontSize: 20,
        borderLeftColor: 'white',
        borderLeftWidth: 2,
    },
    dollarText: {
        fontSize: 24,
        alignSelf: 'center',
        paddingLeft: 5,
        includeFontPadding: false,
    },
    container: {
        flex: 1,
        //somehow we found a secret way to add color to iOS keyboard
        backgroundColor: 'blue'
    },
    questionBox: {
      fontSize: 22,
      marginBottom: 10,
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderRadius: 10,
      padding: 8,
      height: 300
    },
    button: {
      alignItems: "center",
      padding: 10,
      width: 150
    },
    applicantScrollView: {
        height: 300,
        width: '90%',
        marginLeft: '5%',
        marginVertical: 20,
        borderRadius: 15,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'gray'
    },
    savePostingButtonStyle: {
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 125,
        marginHorizontal: 15,
        marginTop: 20,
    },
    textInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth / 1.2,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white',
        borderWidth: 1,
    },
});
