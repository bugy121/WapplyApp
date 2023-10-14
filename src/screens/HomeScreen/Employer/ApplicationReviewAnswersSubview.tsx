import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import Navigation from '../../../navigation';
import { useNavigation } from '@react-navigation/native';
import { getJobApplicationsAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { timeSince } from '../../../util/DateHelper';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
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
import SoundPlayer from 'react-native-sound-player'
import BackgroundTimer from 'react-native-background-timer'

export default function ApplicationReviewAnswersSubview({applicationData, jobPostId, isInternship}) {

    const navigation = useNavigation();
    const dispatch = useDispatch()
    const audioRecorderPlayer = new AudioRecorderPlayer();

    const additionalQuestionAnswers = applicationData.additionalQuestionAnswer

    const jobListingData = useSelector(state => state.employerJobListingReducer);
    const jobPosts = jobListingData.postings;
    const internPosts = jobListingData.internPostings;

    let jobPostInfo;
    if (isInternship) {
        jobPostInfo = internPosts.find((jobPost) => {
            return jobPost.id == jobPostId
        })
    } else {
        jobPostInfo = jobPosts.find((jobPost) => {
            return jobPost.id == jobPostId
        })
    }
    const [playingIndex, setPlayingIndex] = useState(-1)

    const additionalQuestionTitles = jobPostInfo.additionalQuestionTitles

    // const videoLoadInit = []
    const audioPlayTimes = []
    const audioDurationTimes = []
    for (let index = 0; index < additionalQuestionAnswers.length; index++) {
    //   videoLoadInit.push(false);
      audioPlayTimes.push(useState(audioRecorderPlayer.mmss(0)))
      audioDurationTimes.push(useState(additionalQuestionAnswers[index].duration))
    }

    //Play timer counter
    const [timer, setTimer] = useState(0)
    const [counter, setCounter] = useState()
    
    const startPlaying = async(item, index) => {
        const questionData = additionalQuestionAnswers[index]
        setPlayingIndex(index)

        // background timer start code
        //this is some god tier level code written by the boy rxue
        let secondsPlayed = 0
        const interval = BackgroundTimer.setInterval(() => {
            setTimer(secondsPlayed);
            secondsPlayed += 1;
            console.log('cd: ', secondsPlayed);
        }, 1000)
        setCounter(interval)

        console.log("starting playing: " + JSON.stringify(questionData.audioDownloadURL))
        try {
            SoundPlayer.playUrl(questionData.audioDownloadURL)
            SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
                BackgroundTimer.clearInterval(interval);
                stopPlaying(item, index)
              })
        } catch(e) {
            Alert.alert(e)
            setPlayingIndex(-1)
        }
    }

    const stopPlaying = async(item, index) => {
        try {
            console.log('stop playing audio')
            // background timer stop code
            BackgroundTimer.clearInterval(counter);
            setTimer(0);

            SoundPlayer.stop()
            setPlayingIndex(-1)
        } catch(e) {
            setPlayingIndex(-1)
            Alert.alert(e)
        }
    }

    // const [videoLoadStatuses, setVideoLoadStatuses] = useState(videoLoadInit);
    const [dataState, setDataState] = useState(false);

    const renderAdditionalQuestionSection = ({item, index}) => {
        console.log("\n question: " + JSON.stringify(item))
        const playTime = audioRecorderPlayer.mmss(timer)
        const duration = audioDurationTimes[index][0]
        return (

            <View style={[styles.sectionView, {padding: 10}]}>
            {item.questionType == 0 &&
                <View>
                  <Text style={{paddingBottom: 10, fontSize: 24, fontWeight: '300'}}>Question {index + 1}</Text>
                  <Text style={{paddingBottom: 10, fontSize: 20, fontWeight: '600'}}>{item.questionTitle}</Text>
                  <Text style={{paddingBottom: 5, fontSize: 20}}>{index < additionalQuestionAnswers.length ? additionalQuestionAnswers[index].questionResponseText : 'nothing'}</Text>
                </View>}
            {item.questionType == 1 &&
              <View>
                <Text style={{paddingBottom: 10, fontSize: 24, fontWeight: '300'}}>Question {index + 1}</Text>
                <Text style={{paddingBottom: 10, fontSize: 20, fontWeight: '600'}}>{item.questionTitle}</Text>
                <TouchableOpacity
                    onPress={() => {
                        if (playingIndex == index) {
                            stopPlaying(item, index)
                        } else if (playingIndex != -1) {
                            stopPlaying(additionalQuestionAnswers[playingIndex], index)
                            startPlaying(item, index)
                        } else {
                            startPlaying(item, index)
                        }
                    }}
                >
                    {playingIndex != index ?
                    //If this one is currently not getting played
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 50}}>
                        <Ionicons name='play' size={30} />
                        <Text style={{fontSize: 18}}>00:00 / {duration}</Text>
                    </View>
                    :
                    //If current one is getting played
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 50}}>
                    <Ionicons name='pause' size={30} color={'red'} />
                    <Text style={{fontSize: 18}}><Text style={{color: 'green'}}>{playTime}</Text> / {duration}</Text>
                    </View>
                    }
                </TouchableOpacity>
                {/* <TouchableOpacity
                style={styles.viewVideoButton}
                onPress={() => {
                  videoLoadStatuses[index] = true;
                  setDataState(!dataState);
                }}>
                  <Text style={styles.viewVideoText}>Listen Audio Response</Text>
                </TouchableOpacity> */}
                {/* {videoLoadStatuses[index] && <WebView
                  source={{ uri: additionalQuestionAnswers[index].questionResponseVideo}}/>} */}
              </View>
            }
            </View>
        )
    }

    return(
        <View style={{height: 500, paddingBottom: 20}}>
        <ScrollView>
            {additionalQuestionAnswers.length == 0 &&
                <View style={{marginHorizontal: 30, marginTop: 40, justifyContent: 'center', alignContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: '500', alignSelf: 'center', textAlign: 'center', paddingBottom: 20}}>Empty here because your job posting did not ask any application questions or at the time this application was sent, the job post did not ask any screening questions.</Text>
                    <Text style={{fontSize: 16, fontWeight: '200', alignSelf:'center', textAlign: 'center'}}>(We highly recommend asking audio application questions to get to know your applicants better)</Text>
                </View>
            }
            <FlatList
                data={additionalQuestionAnswers}
                renderItem={renderAdditionalQuestionSection}
            />
            <View style={{height: 100}} />
        </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    additionalQuestionView: {
        backgroundColor: 'transparent'
    },
    sectionView: {
        width: '90%',
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    },
    additionalQuestionText: {
        fontSize: 20,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 15,
        fontWeight: '600',
    },
    profileImage: {
        backgroundColor: 'transparent',
        width: 60,
        height: 60,
        borderRadius: 60,
    },
    viewVideoButton: {
        borderRadius: 10,
        backgroundColor: "#00A36C",
        width: '70%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    viewVideoText: {
      fontSize: 16,
      color: 'white'
    }
})
