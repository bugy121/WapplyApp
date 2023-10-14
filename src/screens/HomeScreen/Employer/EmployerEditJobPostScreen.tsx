import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert, Animated, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
//import Icon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonGroup } from 'react-native-elements';
import { deleteJobPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { getJobApplicationsAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import JobPostInfoSubview from './JobPostInfoSubview';
import JobPostApplicantsSubview from './JobPostApplicantsSubview';
import { getApplicationList } from '../../../apiService/firestoreApis/JobPostingApplicationListApi';
import { addApplicationData, deletePosting } from '../../../store/EmployerJobListingReducer';
import { deactivateJobPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { Ionicons, FontAwesome, AntDesign, Octicons, MaterialCommunityIcons, MaterialIcons, Foundation } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Avatar, Card, Title, Paragraph, Colors, Button, Badge } from 'react-native-paper';
import { AdditionalQuestionData, JobPostingData } from '../../../store/ReducerAllDataTypes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import uuid from 'react-native-uuid';
import { validateNewJobPosting } from '../../../util/FormValidation';
import { validate } from 'email-validator';
import { updateJobPost } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { updateJobPostingData } from '../../../store/EmployerJobListingReducer';

const QuestionButton = ({questionTypeColor, questionTypeTitle, questionTypeIcon, questionContentColor, onPress}) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: questionTypeColor}]}>
      <Text style={[{color: questionContentColor}]}>{questionTypeTitle}</Text>
      <FontAwesomeIcon
        name={questionTypeIcon}
        size={32}
        color={questionContentColor}
      />
    </TouchableOpacity>
  );

export default function EmployerEditJobPostScreen({route}) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const jobPostDataId = route.params.jobPostDataId
    const jobListingData = useSelector(state => state.employerJobListingReducer);
    const jobList = jobListingData.postings;

    let jobPostData: JobPostingData;
    jobList.forEach((posting: JobPostingData) => {
        if (posting.id == jobPostDataId) {
            jobPostData = posting
        }
    })

    if (!jobPostData) {
        return (<View></View>)
    }

    const [roleName, setRoleName] = useState(String(jobPostData.roleName));
    const [hourlySalaryLow, setHourlySalaryLow] = useState(String(jobPostData.salaryRangeLow));
    const [hourlySalaryHigh, setHourlySalaryHigh] = useState(String(jobPostData.salaryRangeHigh));
    const [hourlyWorkLow, setHourlyWorkLow] = useState(String(jobPostData.workHourLow));
    const [hourlyWorkHigh, setHourlyWorkHigh] = useState(String(jobPostData.workHourHigh));

    const [fulltimeSelected, setFulltime] = useState(jobPostData.isFulltime);
    const [parttimeSelected, setParttime] = useState(jobPostData.isParttime);
    const [internshipSelected, setInternship] = useState(jobPostData.isInternship);
    const [roleBenefits, setRoleBenefits] = useState(jobPostData.roleBenefits);

    const [description, setDescription] = useState(jobPostData.roleDescription)
    const [additionalQuestionData, setAdditionalQuestionData] = React.useState(jobPostData.additionalQuestionTitles);
    const [dataState, setDataState] = useState(false);

    const [updateJobPostLoading, setUpdateJobPostLoading] = useState(false)

    const renderAdditionalQuestion = ({ item, index }) => {
        const buttonColorText = item.questionType === 0 ? "#5F9EA0" : "#DDDDDD";
        const buttonColorAudio = item.questionType === 1 ? "#00A36C" : "#DDDDDD";
        const buttonTitleText = "Text";
        const buttonTitleAudio = "Audio";
        const buttonIconText = "file-text";
        const buttonIconAudio = "microphone";
        const buttonContentColorText = item.questionType === 0 ? "white" : "black";
        const buttonContentColorAudio = item.questionType === 1 ? "white" : "black";
        const questionNum = index + 1;
        const questionTitle = "Screening Question " + questionNum.toString();
        return (
        <View style={[styles.questionBox, {flex:1}]}>
            <Text style={[styles.subsectionTitle]}>{questionTitle}</Text>
            <TextInput
              value={item.questionText}
              onChangeText={(questionTextInput) => {
                additionalQuestionData[index].questionText = questionTextInput
                setDataState(!dataState)
              }}
              style={[styles.multilineInput]}
              multiline={true}
              placeholder={"Enter Question, example: Why do you want to work here?"}
            />
            <View style={[{flexDirection: 'row'}, {justifyContent: 'space-evenly'}]}>
            <QuestionButton
              questionTypeColor = {buttonColorText}
              questionTypeTitle = {buttonTitleText}
              questionTypeIcon = {buttonIconText}
              questionContentColor = {buttonContentColorText}
              onPress = {() => {
                  additionalQuestionData[index].questionType = 0;
                  setDataState(!dataState)
              }}
            />
            <QuestionButton
              questionTypeColor = {buttonColorAudio}
              questionTypeTitle = {buttonTitleAudio}
              questionTypeIcon = {buttonIconAudio}
              questionContentColor = {buttonContentColorAudio}
              onPress = {() => {
                  additionalQuestionData[index].questionType = 1;
                  setDataState(!dataState)
              }}
            />
            </View>
            <View style={{alignItems: 'center', paddingTop: 10}}>
              {item.questionType === 0 ?
              <Text style={{fontSize: 15, paddingHorizontal: 15, paddingBottom: 10, fontWeight: '200'}}>
                  <Ionicons name="ios-warning" size={20} color="gray" />
                  Text response length limit: 1000 characters
              </Text>
              :
              <Text style={{fontSize: 15, paddingHorizontal: 15, paddingBottom: 10, fontWeight: '200'}}>
                  <Ionicons name="ios-warning" size={20} color="gray" />
                  Audio response length limit: 3 minutes
              </Text>
              }
            <TouchableOpacity
            style={styles.deleteButton}
            onPress = {()=> {
              additionalQuestionData.splice(index, 1);
              setDataState(!dataState);
            }}
            >
              <Text style={{fontSize: 20, color: 'white'}}>
                Delete Question
              </Text>
            </TouchableOpacity>
            </View>
        </View>
        );
      };  

    function goBackToPrevScreen() {
        //Add alert to ask user to confirm leaving
        navigation.goBack()
    }

    function validateInput() {
        if (!hourlyWorkHigh || !hourlyWorkLow) {
            return "Please enter valid work hours / week"
        } else if (!hourlySalaryLow || !hourlySalaryHigh) {
            return "Please enter valid salary range"
        }
        return null
    }

    function saveButtonPressed() {
        setUpdateJobPostLoading(true)

        const inputErrs = validateInput()
        if (inputErrs) {
            Alert.alert(inputErrs)
            setUpdateJobPostLoading(false)
            return
        }

        for (let q of additionalQuestionData) {
            if (q.questionText.length == 0) {
                Alert.alert('One additional question is empty!');
                setUpdateJobPostLoading(false)
                return
            }
        }
        console.log("hourly work low: " + parseInt(hourlyWorkLow))
        const newPosting: JobPostingData = {
            id: jobPostData.id,
            posterId: jobPostData.posterId,
            datePosted: jobPostData.datePosted,
            latestDateBumped: Date(),
            address: jobPostData.address,
            roleName: roleName,
            roleBenefits: roleBenefits,
            roleDescription: description,
            businessName: jobPostData.businessName,
            businessDescription: jobPostData.businessDescription,
            salaryRangeLow: parseInt(hourlySalaryLow),
            salaryRangeHigh: parseInt(hourlySalaryHigh),
            workHourLow: parseInt(hourlyWorkLow),
            workHourHigh: parseInt(hourlyWorkHigh),
            isInternship: internshipSelected,
            isParttime: parttimeSelected,
            isFulltime: fulltimeSelected,
            additionalQuestionTitles: additionalQuestionData,
            views: jobPostData.views,
            applicants: jobPostData.applicants,
            status: jobPostData.status,
            applicationIds: jobPostData.applicationIds,
            location: jobPostData.location,
            geoHash: jobPostData.geoHash,
            logoImgUrl: jobPostData.logoImgUrl,
            educationLevel: jobPostData.educationLevel,
            isRemote: jobPostData.isRemote,
            distanceToApplicant: 0,
        }

        const validationErr: string = validateNewJobPosting(newPosting)
        if (validationErr.length > 0) {
            Alert.alert("Form error: " + validationErr)
            setUpdateJobPostLoading(false)
            return
        }
        updateJobPost(newPosting, newPosting.id, (err: string) => {
            if (err != null) {
                Alert.alert("Update job post failed")
                setUpdateJobPostLoading(false)
                return
            }
            dispatch(updateJobPostingData(newPosting))
            Alert.alert("Successfully updated job post!")
            navigation.goBack()
        })

        setUpdateJobPostLoading(false)
        // dispatch(savePostingData(newPosting));
    }

    return(
        <ScrollView style={{marginTop: 60, paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={goBackToPrevScreen}
                    style={{marginBottom: 10}}
                >
                    <Ionicons name="chevron-back" size={22} color="black" />
                </TouchableOpacity>
                <Button icon='check' onPress={saveButtonPressed} loading={updateJobPostLoading} color={Colors.blueA700} mode='outlined' labelStyle={{fontSize: 18, color: '#147EFB', fontWeight: 'bold'}} style={{borderRadius: 25}}>
                    Update
                </Button>
            </View>

            <Text style={styles.sectionTitle}>Job Title</Text>
            <TextInput value={roleName}
                onChangeText={setRoleName}
                style={styles.inputField}
                placeholder="Brief but specific title"
                />

            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.sectionTitle, {paddingTop: 2}]}>
                    Salary Range
                </Text>
                <FontAwesome name="money" size={30} color="green" style={{paddingLeft: 10}} />
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
                <Text style={styles.sectionTitle}>Work Hours / Week</Text>
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
                <Text style={styles.sectionTitle}>Job Benefits</Text>
                <Text style={{fontWeight: '300', fontSize: 12, paddingBottom: 5}}>Please enter each benefit on its own line</Text>
                <TextInput value={roleBenefits}
                    onChangeText={setRoleBenefits}
                    style={styles.multilineInput}
                    multiline={true}
                    placeholder="Benefits"
                    />
                <Text style={{alignSelf: 'flex-end', marginRight: 5, fontWeight: '300', fontSize: 12}}>Character Count: {roleBenefits.length}/500</Text>
            </View>

            <Text style={styles.sectionTitle}>Job Description</Text>
            <TextInput value={description}
                onChangeText={setDescription}
                style={styles.multilineInput}
                multiline={true}
                placeholder="Description"
                />
            <Text style={{alignSelf: 'flex-end', marginRight: 5, fontWeight: '300', fontSize: 12}}>Character Count: {description.length}/2000</Text>

            <Text style={[styles.sectionTitle, {marginTop: 20}]}>Add Screening Questions</Text>

            <FlatList
                data={additionalQuestionData}
                keyExtractor={item => item.id.toString()}
                renderItem={renderAdditionalQuestion}
                extraData={dataState}
            />

            <TouchableOpacity
                style={{alignItems: 'center', borderWidth: 1, paddingVertical: 5, borderRadius: 25, marginHorizontal: 30, marginBottom: 30, marginTop: 15}}
                onPress={() => {
                    if (additionalQuestionData.length >= 15) {
                        Alert.alert("We currently only allow up to 15 questions per application")
                        return
                    }
                    let newQuestion: AdditionalQuestionData = {
                        id: uuid.v4().toString(),
                        questionText: '',
                        questionType: 0,
                    }
                    additionalQuestionData.push(newQuestion)
                    setDataState(!dataState)
                }}>
                <Text style={{fontSize: 22}}>Add Question</Text>
            </TouchableOpacity>

            <Button 
                onPress={saveButtonPressed}
                loading={updateJobPostLoading}
                mode='contained' 
                icon='check'
                color={Colors.blueA700}
                labelStyle={{fontSize: 20, fontWeight: 'bold'}} 
                style={{borderRadius: 25, marginHorizontal: 20, height: 50, justifyContent: 'center'}}
            >   
                Update Post
            </Button>

            <View style={{height: 150}} />

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
        height: 50,
        flexDirection: 'row',
    },
    salaryInput: {
        flex: 2,
        fontSize: 22,
        borderRadius: 10,
        paddingRight: 10,
        paddingLeft: 5,
        textAlign: 'right'
    },
    sectionTitle: {
        fontSize: 25,
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
    deleteButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ed4569",
        height: 40,
        width: 310,
        borderRadius: 5,
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
    subsectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5,
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
});
