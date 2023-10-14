
import { StyleSheet, Alert, BackHandler, ScrollView, FlatList, TextInput, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from '../../components/Themed';
import { ReactReduxContext } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { JobPostingData, AdditionalQuestionData } from '../../store/ReducerAllDataTypes';
import { addNewJobPosting, bulkAddInternPost } from '../../store/EmployerJobListingReducer';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import uuid from 'react-native-uuid';
import { addNewJobPostAPI } from '../../apiService/firestoreApis/EmployerJobPostApi';
import { geohashForLocation } from 'geofire-common';
import { useNavigation } from '@react-navigation/core';
import { validateNewJobPosting } from '../../util/FormValidation'
import { savePostingData, resetPostingData } from '../../store/EmployerPostingCreationReducer';
import { Ionicons, Octicons, FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator, Colors, Button } from 'react-native-paper';
import { BarIndicator } from 'react-native-indicators';
import { SafeAreaView } from 'react-native';

// FCM
import messaging from '@react-native-firebase/messaging';

export default function CreationPostInformationScreen() {

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const userInfo = useSelector(state => state.employerProfileReducer).profileData;
    const jobPostingData = useSelector(state => state.employerPostingCreationReducer);
    const [creatingPost, setCreatingPost] = useState(false);

    const saveJobPost = () => {
        setCreatingPost(true);
        jobPostingData.status = "ACTIVE"
        addNewJobPostAPI(userInfo.id, jobPostingData, (err) => {
            if (err != null) {
                console.log(err)
                Alert.alert("Uploading new job failed, please try again");
                setCreatingPost(false);
                return
            }
            if (jobPostingData.isInternship) {
                dispatch(bulkAddInternPost([jobPostingData]));
            } else {
                dispatch(addNewJobPosting(jobPostingData));
            }
            dispatch(resetPostingData());

            // subscribe to this job post
            messaging()
                .subscribeToTopic(jobPostingData.id)
                .then(() => console.log('Subscribed to job post with id: ', jobPostingData.id))
                .catch((err) => console.log('Cannot subscribed to job post with id: ', jobPostingData.id));

            // true here denotes a job has been created so the previous screen will wipe out data
            navigation.navigate("RootInformationNewPosting", {data: true});
            setCreatingPost(false);
        });
    }

    const goPrevScreen = () => {
        navigation.goBack()
    }

    return (
        <ScrollView style={{paddingTop: 200, backgroundColor: 'white'}}>
            <Text style={{fontSize: 40, fontWeight: '600', paddingLeft: 20, paddingBottom: 30}}>Confirmation 🎉🎉</Text>
            <Text style={{fontWeight: '400', fontSize: 22, paddingHorizontal: 20, paddingBottom: 15}}>
                After job post is created, the job post will be visable to all applicants nearby immediately.
            </Text>
            <Text style={{fontWeight: '400', fontSize: 22, paddingHorizontal: 20, paddingBottom: 15}}>
                When an applicant applies, you will be able to review their application.
            </Text>
            <Text style={{fontWeight: '400', fontSize: 22, paddingHorizontal: 20}}>
                If it seems like a good match, you can send messages to them using the <Text style={{fontWeight: 'bold'}}>in-app chat</Text>.
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 40, backgroundColor: 'transparent'}}>
                <Button icon='chevron-left' 
                        onPress={goPrevScreen} 
                        color={Colors.blue400} 
                        labelStyle={{fontSize: 20, color: 'white', fontWeight: 'bold'}} 
                        mode='contained' 
                        style={{height: 70, borderRadius: 35, width: windowWidth / 2.5, alignItems: 'center', alignSelf: 'center', alignContent: 'center', justifyContent: 'center'}} 
                        disabled={creatingPost} 
                >
                    Back
                </Button>
                <Button icon='send' 
                        onPress={saveJobPost} 
                        color={Colors.green400} 
                        loading={creatingPost} 
                        contentStyle={{flexDirection: 'row-reverse'}} 
                        labelStyle={{fontSize: 20, color: 'white', fontWeight: 'bold'}} 
                        mode='contained' 
                        style={{height: 70, borderRadius: 35, width: windowWidth / 2.5, alignItems: 'center', alignSelf: 'center', alignContent: 'center', justifyContent: 'center'}} 
                        disabled={creatingPost}
                >
                    Create
                </Button>
            </View>
            { creatingPost && <View style={styles.overlayView}>
                <BarIndicator color='black' />
            </View> }
        </ScrollView>
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
        paddingBottom: 5,
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
        marginHorizontal: 30,
        marginTop: 20,
        width: 150
    },
    overlayView: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 0.7,
    },
});
