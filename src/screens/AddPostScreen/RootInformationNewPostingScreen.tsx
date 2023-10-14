
import { StyleSheet, Alert, BackHandler, ScrollView, FlatList, TextInput, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from '../../components/Themed';
import { addNewJobPosting } from '../../store/EmployerJobListingReducer';
import { addNewJobPostAPI } from '../../apiService/firestoreApis/EmployerJobPostApi';
import { geohashForLocation } from 'geofire-common';
import { useNavigation } from '@react-navigation/core';
import { validateNewJobPosting } from '../../util/FormValidation'
import { savePostingData, resetPostingData } from '../../store/EmployerPostingCreationReducer';
import { Ionicons, Octicons, FontAwesome, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator, Colors, Button } from 'react-native-paper';
import { BarIndicator } from 'react-native-indicators';
import FastImage from 'react-native-fast-image';
import ConfettiCannon from 'react-native-confetti-cannon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootInformationNewPostingScreen({route}) {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation()

    const navRootOnSubmission = () => {
        if (route.params) {
            // route.params = undefined;
            navigation.navigate("Root")
            Alert.alert("Job post successfully created! It is live and will be viewed by applicants soon 🎉")
        }
    }
    navRootOnSubmission();

    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.employerProfileReducer).profileData;
    const jobPostingData = useSelector(state => state.employerPostingCreationReducer);

    const [creatingPost, setCreatingPost] = useState(false);

    const applicantInformations = [
        'Name',
        'Contact info(phone, email)',
        'Age',
        'Education',
        'Previous Employment',
    ]

    const goNext = () => {
        navigation.navigate('RootNewJobPosting')
    }

    const goLinkPost = () => {
        navigation.navigate('LinkPostCreationScreen')
    }

    const renderRequiredInformationRow = ({item, index}) => {
        return (
            <View style={{backgroundColor: 'transparent', flexDirection: 'row', marginVertical: 5, marginRight: 30, marginLeft: 15}}>
                <Octicons size={15} name='primitive-dot' style={{paddingTop: 5, paddingRight: 10}} />
                <Text style={{fontSize: 20}}>{item}</Text>
            </View>
        )
    }

    const profileImageURL = userInfo.profilePicUrl != "no image" ? {uri: userInfo.profilePicUrl} : require('../../../assets/images/profileimg.png')

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <SafeAreaView style={{marginTop: 10}}>
            <View style={{height: windowHeight * 0.1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30}}>
                <Text style={{fontSize: 30, fontWeight: '700', paddingVertical: 20}}>Create New Post</Text>
                <FastImage source={profileImageURL} style={{height: windowWidth * 0.2, width: windowWidth * 0.2 , alignSelf: 'center'}} />
            </View>
            </SafeAreaView>
            
            <View style={{backgroundColor: 'transparent', paddingTop: 10, paddingHorizontal: 20, paddingBottom: 50}}>
                <View style={{ backgroundColor: 'transparent'}}>
                    <Text style={styles.sectionTitle}><FontAwesome name='id-card-o' size={30} style={{paddingLeft: 10, marginTop: -5}} />  Information you will receive automatically from applications</Text>
                </View>
                <FlatList
                    style={{paddingBottom: 15}}
                    data={applicantInformations}
                    renderItem={renderRequiredInformationRow}
                    scrollEnabled={false}
                />
                <View style={{ backgroundColor: 'transparent'}}>
                    <Text style={styles.sectionTitle}>
                        <FontAwesome5 name='user-lock' color='green' size={30} style={{paddingLeft: 10, margin: 100}} />  Your email, name, and phone number will be only visible to you.
                    </Text>
                </View>
            </View>

            {/* <Button mode='contained'
                 onPress={goNext} 
                 color={Colors.blue500} 
                 labelStyle={{fontSize: 26, fontWeight: '700'}} 
                 style={{width: windowWidth / 1.3, height: windowHeight / 15, justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 25}}
            >
                Start
            </Button> */}

            <TouchableOpacity
                 onPress={goNext}
                 style={{backgroundColor: Colors.blue500, width: windowWidth / 1.3, height: windowHeight / 15, justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 25}}
            >
                <Text style={{fontSize: 26, fontWeight: '700', color: 'white'}}> START </Text>
            </TouchableOpacity>

            <TouchableOpacity
                 onPress={goLinkPost}
                 style={{marginTop: 20, backgroundColor: Colors.blue500, width: windowWidth / 1.3, height: windowHeight / 15, justifyContent: 'center', alignSelf: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 25}}
            >
                <Text style={{fontSize: 26, fontWeight: '700', color: 'white'}}> START LINK POST </Text>
            </TouchableOpacity>

            { creatingPost && <View style={styles.overlayView}>
                <BarIndicator color='black' />
            </View> }
        </View>
    )
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
        paddingBottom: 10,
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
        backgroundColor: 'white'
    },
    savePostingButtonStyle: {
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 125,
        marginHorizontal: 30,
        marginTop: 20,
        width: 150
    },
    overlayView: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: '#F2F2F2',
        opacity: 0.7,
    },
});
