import { StyleSheet, Alert, BackHandler, ScrollView, FlatList, TextInput, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from '../../components/Themed';
import { ReactReduxContext } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { JobPostingData, AdditionalQuestionData } from '../../store/ReducerAllDataTypes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import uuid from 'react-native-uuid';
import { addNewJobPostAPI } from '../../apiService/firestoreApis/EmployerJobPostApi';
import { geohashForLocation } from 'geofire-common';
import { useNavigation } from '@react-navigation/core';
import { validateNewJobPosting } from '../../util/FormValidation'
import { savePostingData, resetPostingData } from '../../store/EmployerPostingCreationReducer';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

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

export default function CreationCustomQuestionScreen({route}) {
    const navigation = useNavigation()
    const dispatch = useDispatch();

    const jobPostingData = useSelector(state => state.employerPostingCreationReducer)
    const [description, setDescription] = useState(jobPostingData.roleDescription);

    // question should match with the required information indices
    let [additionalQuestionsCounter, setAdditionalQuestionsCounter] = useState(jobPostingData.additionalQuestionTitles.length);

    const [additionalQuestionData, setAdditionalQuestionData] = React.useState(jobPostingData.additionalQuestionTitles);
    const [dataState, setDataState] = useState(false);

    const resetPostState = () => {
        if (route.params) {
            setAdditionalQuestionData([]);
            route.params = undefined;
        }
    }
    resetPostState();

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
                Text response length limit: 1,000 characters
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

    const userInfo = useSelector(state => state.employerProfileReducer).profileData;

    const goNextScreen = () => {
        const lat = userInfo.location.lat;
        const lng = userInfo.location.lon;

        // validate additional question
        for (let q of additionalQuestionData) {
            if (q.questionText.length == 0) {
                Alert.alert('One additional question is empty!');
                return
            }
        }

        const newPosting: JobPostingData = {
            id: uuid.v4().toString(),
            posterId: jobPostingData.posterId,
            datePosted: Date(),
            latestDateBumped: Date(),
            address: userInfo.address,
            roleName: jobPostingData.roleName,
            roleBenefits: jobPostingData.roleBenefits,
            roleDescription: description,
            businessName: userInfo.businessName,
            businessDescription: userInfo.businessDescription,
            salaryRangeLow: jobPostingData.salaryRangeLow,
            salaryRangeHigh: jobPostingData.salaryRangeHigh,
            workHourLow: jobPostingData.workHourLow,
            workHourHigh: jobPostingData.workHourHigh,
            isInternship: jobPostingData.isInternship,
            isParttime: jobPostingData.isParttime,
            isFulltime: jobPostingData.isFulltime,
            additionalQuestionTitles: additionalQuestionData,
            views: jobPostingData.views,
            applicants: jobPostingData.applicants,
            status: jobPostingData.status,
            applicationIds: [],
            location: {
                lat: lat,
                lon: lng
            },
            geoHash: geohashForLocation([lat, lng]),
            logoImgUrl: userInfo.profilePicUrl,
            educationLevel: jobPostingData.educationLevel,
            isRemote: jobPostingData.isRemote,
            distanceToApplicant: 0,
        }

        const validationErr: string = validateNewJobPosting(newPosting)
        if (validationErr.length > 0) {
            Alert.alert("Form error: " + validationErr)
            return
        } else if (userInfo.businessDescription == null || userInfo.businessDescription.length < 1) {
            Alert.alert("Profile incomplete: please fill business description")
            return
        }

        dispatch(savePostingData(newPosting));
        navigation.navigate("CreationPostInformation")
    }

    const goPrevScreen = () => {
        const newPosting: JobPostingData = {
            id: uuid.v4().toString(),
            datePosted: Date(),
            latestDateBumped: Date(),
            posterId: jobPostingData.posterId,
            address: userInfo.address,
            roleName: jobPostingData.roleName,
            roleBenefits: jobPostingData.roleBenefits,
            roleDescription: description,
            businessName: userInfo.businessName,
            businessDescription: userInfo.businessDescription,
            salaryRangeLow: jobPostingData.salaryRangeLow,
            salaryRangeHigh: jobPostingData.salaryRangeHigh,
            workHourLow: jobPostingData.workHourLow,
            workHourHigh: jobPostingData.workHourHigh,
            isInternship: jobPostingData.isInternship,
            isParttime: jobPostingData.isParttime,
            isFulltime: jobPostingData.isFulltime,
            additionalQuestionTitles: additionalQuestionData,
            views: jobPostingData.views,
            applicants: jobPostingData.applicants,
            status: jobPostingData.status,
            applicationIds: [],
            location: {
                lat: jobPostingData.location.lat,
                lon: jobPostingData.location.lon
            },
            geoHash: geohashForLocation([jobPostingData.location.lat, jobPostingData.location.lon]),
            logoImgUrl: userInfo.profilePicUrl,
            educationLevel: jobPostingData.education,
            distanceToApplicant: 0,
        }
        dispatch(savePostingData(newPosting))
        navigation.goBack()
    }

  return (
    <View style={{flex: 1}}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView style={{flex: 1, paddingHorizontal: 20, paddingTop: 65, paddingBottom: 50, backgroundColor: 'white'}}>
        <View style={{flex: 1,}}>
        <TouchableOpacity
          onPress={goPrevScreen}
          style={{paddingBottom: 45}}
        >
            <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>

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

        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
            {/* <TouchableOpacity style={styles.savePostingButtonStyle}
            onPress={goPrevScreen}>
                <Text style={{fontSize: 22}}>Back</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.savePostingButtonStyle}
            onPress={goNextScreen}>
                <Text style={{fontSize: 22}}>Next</Text>
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
        fontSize: 25,
        fontWeight: 'bold',
        paddingBottom: 5,
        marginBottom: 10,
    },
    subsectionTitle: {
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
        paddingLeft: 5,
        includeFontPadding: false,
        paddingRight: 5,
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
      padding: 10,
    },
    button: {
      alignItems: "center",
      padding: 10,
      width: 150,
      borderRadius: 20
    },
    deleteButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ed4569",
      height: 40,
      width: 310,
      borderRadius: 5,
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
        paddingVertical: 5,
        borderRadius: 25,
        marginHorizontal: 30,
        marginBottom: 125,
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 40
    },
});
