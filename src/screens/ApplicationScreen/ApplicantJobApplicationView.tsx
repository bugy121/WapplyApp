import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text, Alert, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
//import Icon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';
import { JobApplicationData, ApplicationAnswerData } from '../../store/ReducerAllDataTypes';
import { createJobApplicationAPI } from '../../apiService/AWSProfileApi';
import uuid from 'react-native-uuid';
import { applyJobPostAPI } from '../../apiService/firestoreApis/ApplicantJobPostApi';
import { addNewAppliedJobPosting, addAppliedJobApplication } from '../../store/ApplicantAppliedJobPostingReducer';
import { updateApplicantProfileData, addApplicantAppliedJobs } from '../../store/ApplicantProfileReducer';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { verifyJobApplicationData } from '../../util/FormValidation';
import { getFileInfo, filesizeToMB } from '../../util/VideoHelper';
import { Video, AVPlaybackStatus } from 'expo-av';
import { UIImagePickerControllerQualityType } from 'expo-image-picker/build/ImagePicker.types';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import RNFetchBlob from 'rn-fetch-blob'
import { Platform } from 'react-native';
import { uploadAudioFile } from '../../apiService/firebaseStorage/AudioApi';
import { stringify } from '@firebase/util';
import { BarIndicator } from 'react-native-indicators';
import ConfettiCannon from 'react-native-confetti-cannon';
import {showApplyJobAnimation} from '../../store/ApplicantProfileReducer'
import { ActivityIndicator, Colors, Button as PaperButton } from 'react-native-paper';
import { Dimensions } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const windowWidth = Dimensions.get('window').width;

export default function ApplicantJobApplicationView({route}) {
  const jobPostData = route.params.data;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const goBackToPrevScreen = () => {
      navigation.goBack()
  }

  // overlay state
  const [submittingApp, setSubmittingApp] = useState(false);

  const [dataState, setDataState] = useState(false); // is this needed?
  //How many states we waiting on before we submit application
  const appId = uuid.v4().toString()

  const jobDatePosted = jobPostData.datePosted.split(" ")[1] + " " + jobPostData.datePosted.split(" ")[2] +
          ", " + jobPostData.datePosted.split(" ")[3]

  const userInfo = useSelector(state => state.applicantProfileReducer).profileData;

  const audioRecorderPlayer = new AudioRecorderPlayer();
  const audioSet: AudioSet = {
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.low,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };

  const audioPlayTimes = []
  const audioDurationTimes = []
  const questionDataArray = []
  // for each additional questions, create a response object in the response list
  for (let index = 0; index < jobPostData.additionalQuestionTitles.length; index++) {
    const dirs = RNFetchBlob.fs.dirs;
    let recordPath = ''
    if (Platform.OS == 'ios') {
      recordPath = `file://${dirs.CacheDir}/${jobPostData.id}-Q${index.toString()}.m4a`
    } else {
      //TODO MIGHT NEED TO FIX ANDROID PATH
      recordPath = `file://${dirs.CacheDir}/${jobPostData.id}-Q${index.toString()}.mp3`
    }
    const newQuestionResponse: ApplicationAnswerData = {
      questionTitle: jobPostData.additionalQuestionTitles[index].questionText,
      questionResponseText: '',
      questionType: jobPostData.additionalQuestionTitles[index].questionType, // 0 - text; 1 - audio
      recordLocation: jobPostData.additionalQuestionTitles[index].questionType == 1 ? recordPath : null,
      duration: audioRecorderPlayer.mmss(0),
      playTime: audioRecorderPlayer.mmss(0),
      audioUri: null,
      audioDownloadURL: null,
    }
    questionDataArray.push(useState(newQuestionResponse))
    audioPlayTimes.push(useState(audioRecorderPlayer.mmss(0)))
    audioDurationTimes.push(useState(audioRecorderPlayer.mmss(0)))
  }
  const [questionResponseData, setQuestionResponseData] = useState(questionDataArray)

  const getGalleryPermission = async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need photo album permissions to make this work!');
        } else {
          alert('Permission Granted!');
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
              alert('Permission Granted!');
          }
      }
  };

  // const pickVideoResponse = async (index) => {
  //     getGalleryPermission();

  //     let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //         allowsEditing: true,
  //         aspect: [4, 3],
  //         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  //         quality: 0,
  //         //video preset works but videoquality doesnt, quality is for images
  //         videoExportPreset: 2
  //         // UIImagePickerControllerQualityType: 2
  //     });
  //     handleMediaPicked(pickerResult, index);
  // };

  // const recordVideoResponse = async (index) => {
  //     getCameraPermission();

  //     let pickerResult = await ImagePicker.launchCameraAsync({
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       mediaTypes: ImagePicker.MediaTypeOptions.Videos
  //     });

  //     handleMediaPicked(pickerResult, index);
  // };

  // Audio start
  // const [recordAudioState, setRecordAudioState] = useState({})
  // const [playAudioState, setPlayAudioState] = useState({currentPosition: audioRecorderPlayer.mmss(0), duration: audioRecorderPlayer.mmss(0)})
  const recordButtonRef = React.useRef(null)
  const playPauseButtonRef = React.useRef(null)
  const [recordingIndex , setRecordingIndex] = useState(-1)
  const [playingIndex, setPlayingIndex] = useState(-1)

  // Have to use a callback here otherwise the recording doesn't stop
  //https://github.com/hyochan/react-native-audio-recorder-player/issues/313
  const startRecording = React.useCallback(async (item ,index) => {
    recordButtonRef.current.setNativeProps({
      disabled: true
    })
    if (recordingIndex != -1) {
      await stopRecording(questionResponseData[recordingIndex][0], recordingIndex)
    }
    if (playingIndex != -1) {
      await stopPlaying(questionResponseData[playingIndex][0], playingIndex)
    }
    try {
      const uri = await audioRecorderPlayer.startRecorder(questionResponseData[index][0].recordLocation, audioSet, true);
      const [audioData, setAudioData] = questionResponseData[index]
      audioData.audioUri = uri
      setAudioData(audioData)
      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        //Max 3 minutes recordings allow
        if (e.currentPosition / 1000 > 180) {
          stopRecording(item, index)
        } else {
          audioData.playTime = audioRecorderPlayer.mmss(0)
          audioData.duration = audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
          setAudioData(audioData)
          audioDurationTimes[index][1](audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)))
        }
      });
      setRecordingIndex(index)
      recordButtonRef.current.setNativeProps({
        disabled: false
      })
    } catch (e) {
      Alert.alert("Start recording failed: " + e)
      recordButtonRef.current.setNativeProps({
        disabled: false
      })
    }
  }, [])

  // Have to use a callback here otherwise the recording doesn't stop
  //https://github.com/hyochan/react-native-audio-recorder-player/issues/313
  const stopRecording = React.useCallback(async (item, index) => {
    //This is to prevent multiple recordings from playing/recording at once
    recordButtonRef.current.setNativeProps({
      disabled: true
    })
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordingIndex(-1)
      recordButtonRef.current.setNativeProps({
        disabled: false
      })
    } catch (e) {
      Alert.alert("Stop recording failed: " + e)
      recordButtonRef.current.setNativeProps({
        disabled: false
      })
    }

  }, []);

  const startPlaying = React.useCallback(async (item, index) => {
    playPauseButtonRef.current.setNativeProps({
      disabled: true
    })

    try {
      const [audioData, setAudioData] = questionResponseData[index]
      setPlayingIndex(index)
      const msg = await audioRecorderPlayer.startPlayer(audioData.audioUri);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition == e.duration) {
          setPlayingIndex(-1)
        }
        audioData.playTime = audioRecorderPlayer.mmss(Math.floor((e.currentPosition > 0 ? e.currentPosition : 0.0) / 1000))
        setAudioData(audioData)
        audioPlayTimes[index][1](audioData.playTime);
        return;
      });
      playPauseButtonRef.current.setNativeProps({
        disabled: false
      })
    } catch (e) {
      Alert.alert("Playing audio error: " + e)
      setPlayingIndex(-1)
      playPauseButtonRef.current.setNativeProps({
        disabled: false
      })
    }

  }, []);

  const stopPlaying = React.useCallback(async (item, index) => {
    playPauseButtonRef.current.setNativeProps({
      disabled: true
    })
    try {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingIndex(-1)
      playPauseButtonRef.current.setNativeProps({
        disabled: false
      })
    } catch (e) {
      Alert.alert("Stop play audio error: " + e)
      playPauseButtonRef.current.setNativeProps({
        disabled: false
      })
    }

  }, []);

  const renderAdditionalQuestionResponse = ({ item, index }) => {
    const answerData = item[0]
    const questionNum = index + 1;
    const questionTitle = "Additional Question " + questionNum.toString();
    const questionData = jobPostData.additionalQuestionTitles[index]
    const playTime = audioPlayTimes[index][0]
    const duration = audioDurationTimes[index][0]
    return (
      <View style={[styles.questionBox, {flex:1}]}>
        <Text style={[styles.sectionTitle]}>{questionTitle}</Text>
        {questionData.questionType == 0 &&
          <Text style={[styles.sectionSubTitle]}>{questionData.questionText}</Text>
        }
        {questionData.questionType == 1 &&
          <Text style={[styles.sectionSubTitle]}>{questionData.questionText}<Text style={{fontSize: 14}}>  Max 3 minutes response</Text></Text>
        }
        {questionData.questionType == 0 &&
          <View style={{paddingBottom: 5}}>
            <TextInput
              value={answerData.questionReponseText}
              onChangeText={(questionTextInput) => {
                answerData.questionResponseText = questionTextInput
                setDataState(!dataState)
              }}
              style={[styles.multilineInput]}
              multiline={true}
              placeholder={"Enter your response to the employer's question"}
              editable={true}
            />
            <Text style={{alignSelf: 'flex-end', marginTop: -30, marginRight: 5, fontWeight: '300', fontSize: 12}}>Character Count: {questionResponseData[index][0].questionResponseText.length}/1000</Text>
          </View>

        }
        {questionData.questionType == 1 &&
          <View style={{flexDirection:'column', alignItems: 'center'}}>
          {/* {item.

          } */}
          {/* <TouchableOpacity
              style={styles.videoOptionButton}
              onPress={() => recordVideoResponse(index)}
              >
              <Text style={{fontSize: 22, marginVertical: 10, fontWeight: '600', color: 'blue'}}>
                  Record Video
              </Text>
          </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.videoOptionButton}
              onPress={() => {
                if (recordingIndex != -1) {
                  stopRecording(questionData, index)
                } else {
                  startRecording(questionData, index)
                }
              }}
              ref={recordButtonRef}
            >
              {recordingIndex == index ?
                <Text style={{fontSize: 22, marginVertical: 10, fontWeight: '600', color: 'blue'}}>
                    Stop Recording   <FontAwesome name='microphone' size={25} color={"red"} />
                </Text>
                :
                <Text style={{fontSize: 22, marginVertical: 10, fontWeight: '600', color: 'blue'}}>
                    Record Audio   <FontAwesome name='microphone' size={25} color={"black"} />
                </Text>
              }

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                  if (playingIndex == -1 && recordingIndex == -1) {
                    startPlaying(answerData, index)
                      .catch((e) => {
                        Alert.alert("Internal audio error: " + e)
                      })
                  } else {
                    stopPlaying(answerData, index)
                  }
                }}
                style={{paddingTop: 15, paddingBottom: 5, width: '100%'}}
                disabled={recordingIndex == index}
                ref={playPauseButtonRef}
              >
            {answerData.audioUri != null &&
              <View>
                {playingIndex != index ?
                //If this one is currently not getting played
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 50}}>
                  <Ionicons name='play' size={30} />
                  <Text style={{fontSize: 18}}>{playTime} / {duration}</Text>
                </View>
                :
                //If current one is getting played
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 50}}>
                  <Ionicons name='pause' size={30} color={'red'} />
                  <Text style={{fontSize: 18}}><Text style={{color: 'green'}}>{playTime}</Text> / {duration}</Text>
                </View>
                }
              </View>
            }
            </TouchableOpacity>

          </View>
        }
      </View>
    )
  }

  const createNewApplication = async (appId: string, callback) => {
    let audioQuestions = false;

    const applicationData: JobApplicationData = {
      id: appId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      longitude: userInfo.longitude,
      latitude: userInfo.latitude,
      employmentHistory: userInfo.employmentHistory,
      education: userInfo.education,
      age: userInfo.age,
      profilePicUrl: userInfo.profilePicUrl,
      status: "Applied",
      additionalQuestionAnswer: questionResponseData.map((hook) => hook[0]),
      dateApplied: Date(),
      availability: userInfo.availability,
    }

    const validationErrors = verifyJobApplicationData(applicationData)
    if (validationErrors != null) {
      Alert.alert(validationErrors)
      setSubmittingApp(false);
      return
    }

    const audioDownloadURLs = []

      // loop through video questions and upload the videos from the given uri
    try {
      for (let index = 0; index < jobPostData.additionalQuestionTitles.length; index++) {
        const [questionData, setQuestionData] = questionResponseData[index]
        if (questionData.questionType == 1) {
          await uploadAudioFile(questionData.audioUri, appId, uuid.v4(), async (err, downloadURL) => {
            if (err != null) {
              Alert.alert("Upload audio files failed :( sorry")
              return
            }
            audioDownloadURLs.push([index, downloadURL])
          })
        }
      }
    } catch (e) {
      alert("Upload audio failed, sorry :(");
      setSubmittingApp(false);
      return;
    }

    callback(audioDownloadURLs)
  }

  const onSubmitTapped = async () => {
    setSubmittingApp(true); // overlay indicator
    await createNewApplication(appId, async (audioDownloadURLs) => {
      dispatch(showApplyJobAnimation())
      let customQuestionAnswers = questionResponseData.map((hook) => hook[0])
      audioDownloadURLs.forEach(([index, downloadURL]) => {
        customQuestionAnswers[index].audioDownloadURL = downloadURL
      })
      const finalApplicationData: JobApplicationData = {
        id: appId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        longitude: userInfo.longitude,
        latitude: userInfo.latitude,
        employmentHistory: userInfo.employmentHistory,
        education: userInfo.education,
        age: userInfo.age,
        profilePicUrl: userInfo.profilePicUrl,
        status: "Applied",
        additionalQuestionAnswer: customQuestionAnswers,
        dateApplied: Date(),
        availability: userInfo.availability,
      }

      await applyNewJobPost(finalApplicationData, appId);
      Alert.alert("\n Job applied successfully!")
      navigation.navigate('Root');
      setSubmittingApp(false);
    })
  }

  const applyNewJobPost = async (newApplication: JobApplicationData, appId: string) => {
      // Firestore create job application
      await applyJobPostAPI(userInfo.id, newApplication, jobPostData);

      // Add to reducer
      await dispatch(addAppliedJobApplication(jobPostData.id, {app: newApplication}));
      await dispatch(addNewAppliedJobPosting(jobPostData));

      await dispatch(addApplicantAppliedJobs(Object({postId: jobPostData.id, appId: appId})));

      // subscribe to this job post
      messaging()
      .subscribeToTopic(appId + '-applicant')
      .then(() => console.log('Subscribed to job post with id: ', appId + '-applicant'))
      .catch((err) => console.log('Cannot subscribed to job post with id: ', appId + '-applicant'));
  }

  return (
    <View>
    <ScrollView style={{marginTop: 60}}>
      <TouchableOpacity
          onPress={goBackToPrevScreen}
          style={{paddingLeft: 15}}
      >
        <Ionicons name="chevron-back" size={22} color="black" />
      </TouchableOpacity>
      <View style={{paddingVertical: 30, paddingLeft: 30}}>
        <Text style={styles.title}>{jobPostData.roleName}</Text>
        <Text style={styles.dateText}>Posted On: {jobDatePosted}</Text>
        <View style={styles.statView}>
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            <Text style={{fontSize: 20, marginLeft: 10, fontWeight: 'bold'}}>
                Salary Range:
            </Text>
            <Text style={{fontSize: 18, marginLeft: 10}}>${jobPostData.salaryRangeLow} - ${jobPostData.salaryRangeHigh} Hourly</Text>
          </View>
          <View style={{marginTop: 10, flexDirection: 'row'}}>
          <Text style={{fontSize: 20, marginLeft: 10, fontWeight: 'bold'}}>
              Work Hours / Week
          </Text>
          <Text style={{fontSize: 18, marginLeft: 10}}>{jobPostData.workHourLow} - {jobPostData.workHourHigh} Hours</Text>
          </View>
        </View>
        <View style={styles.descriptionView}>
            <Text style={{fontSize: 20, marginLeft: 15, fontWeight: 'bold', marginVertical: 10}}>
                Job Description
            </Text>
            <Text style={{fontSize: 16, marginBottom: 10, marginLeft: 15}}>
                {jobPostData.roleDescription}
            </Text>
        </View>

        {questionResponseData.length > 0 && <View>
        <Text style={[styles.title, {marginTop: 20, }]}>Additional Questions</Text>
        <FlatList
            data={questionResponseData}
            renderItem={renderAdditionalQuestionResponse}
            keyExtractor={item => item.id}
        />
        </View>}

      </View>
      {/* <TouchableOpacity style={styles.submitApplicationButtonStyle}
       onPress={onSubmitTapped}>
          <Text style={{fontSize: 22, marginVertical: 10}}>Submit Application</Text>
      </TouchableOpacity> */}
      <PaperButton icon='send' labelStyle={{fontSize: 18}} onPress={onSubmitTapped} loading={submittingApp} color={Colors.green600} mode='contained' style={{borderRadius: 25, height: 50, justifyContent: 'center', alignContent: 'center', width: windowWidth / 1.3, alignSelf: 'center', marginBottom: 10, }} >
        Submit Application
      </PaperButton>

      {/* { submittingApp && <View style={styles.overlayView}>
          <BarIndicator color='black' />
      </View> } */}

      <View style={{height: 50}} />

    </ScrollView>
    <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', backgroundColor: 'transparent', width: 50, height: 50, top: '50%', left: windowWidth/2 - 25,
    right: 0, bottom: 0, }}>
        <ActivityIndicator animating={submittingApp} color={Colors.green600} size={'large'} />
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 30,
        marginBottom: 8,
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    dateText: {
        fontSize: 16,
        marginBottom: 10,
    },
    statView: {
        width: '90%',
        marginTop: 15,
        paddingBottom: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        flexDirection: 'column'
    },
    descriptionView: {
        width: '90%',
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        alignSelf: 'flex-start',
        paddingRight: 15,
    },
    videoOptionButton: {
        width: '90%',
        height: 50,
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: '400',
        paddingBottom: 5,
    },
    sectionSubTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    questionBox: {
      fontSize: 22,
      marginBottom: 10,
      borderRadius: 10,
      paddingHorizontal: 8,
      padding: 8,
      backgroundColor: 'white',
      width: '90%',
    },
    multilineInput: {
        fontSize: 16,
        marginBottom: 10,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        height: 150,
    },
    submitApplicationButtonStyle: {
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 5,
        borderRadius: 25,
        marginHorizontal: 45,
        marginBottom: 10
    },
    overlayView: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: 'white',
      opacity: 0.7,
      marginTop: '70%',
    }
})
