
import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { Component } from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert, Animated, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, FontAwesome, AntDesign, Octicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Avatar, Card, Title, Paragraph, Colors, Button, ActivityIndicator } from 'react-native-paper';
import { GiftedChat, Message, GiftedAvatar } from 'react-native-gifted-chat'
import { json } from 'stream/consumers';
import { sendNewMessageAPI, fetchMessageAPI, markReadNewMessages } from '../../apiService/firestoreApis/Chat/ChatMessageApi';
import { serializeGiftedChatMessage,  } from '../HomeScreen/Employer/MessageDataModel';
import { useFocusEffect } from '@react-navigation/native';
import { markChatRead } from '../../store/ChatMessageReducer';
import { useIsFocused } from '@react-navigation/native';

export default function ApplicantChatMessageScreen({route}) {

    const {employerProfileData, applicationData} = route.params

    const applicantFirstName = applicationData.firstName
    const applicantLastName = applicationData.lastName
    const applicantName = `${applicantFirstName} ${applicantLastName}`
    const applicantProfilePicSource = applicationData.profilePicUrl
    const applicantProfile = useSelector(state => state.applicantProfileReducer).profileData;

    // const applicantProfilePicSource = applicationData.profilePicUrl 
    const employerProfilePicSource = employerProfileData.profilePicUrl != "no image" ? employerProfileData.profilePicUrl : require('../../../assets/images/profileimg.png')
    const employerName = `${employerProfileData.businessName}`

    const navigation = useNavigation()

    const [messages, setMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(true)

    const dispatch = useDispatch()
    const isFocused = useIsFocused();

    useFocusEffect(
        React.useCallback(() => {
            fetchRecentMessages()
        }, [])
      );

    async function fetchRecentMessages() {
        fetchMessageAPI(applicationData.id, (err, messages) => {
            // if (err != null) {
            //     Alert.alert("Could not get messages :(")
            //     return
            // }
            messages.map((msg) => {
                if (msg.senderId === employerProfileData.id) {
                    msg.user = {
                        _id: employerProfileData.id,
                        name: employerName,
                        avatar: employerProfilePicSource
                    }
                } else {
                    msg.user = {
                        _id: "applicant",
                        name: applicantName,
                        avatar: applicantProfilePicSource
                    }
                }
                return msg
            })

            messages.reverse()
            setMessages(messages)
            setChatLoading(false)
        })
        if (isFocused) {
            markReadNewMessages(applicationData.id, true)
            dispatch(markChatRead(applicationData.id))
        }
    }

    const onSend = React.useCallback((newMessage = []) => {
        if (newMessage[0].text.length > 500) {
            Alert.alert("Please send messages no more than 500 characters long")
            return
        } else if (newMessage.length == 0) {
            Alert.alert("No messages send error")
            return
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage))

        const serializedMessage = serializeGiftedChatMessage(newMessage[0], applicantProfile.id)
        sendNewMessageAPI(applicationData.id, serializedMessage, false, (err: string) => {
            if (err != null) {
                Alert.alert(err)
            }
        })
      }, [])

    function goBackToPrevScreen() {
        navigation.goBack()
    }
   
    return (
        <View style={{paddingTop: 60, flex: 1, backgroundColor: 'white'}}>
            <ActivityIndicator color={Colors.green500} animating={chatLoading} 
                style={{
                    position: 'absolute', 
                    top: 0, left: 0, 
                    right: 0, bottom: 0, 
                    justifyContent: 'center', 
                    alignItems: 'center'}}
                size='large' />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight:30, paddingBottom: 10}}>
                <TouchableOpacity
                    onPress={goBackToPrevScreen}
                    style={{marginLeft: 15, paddingTop: 8}}
                >
                    <Ionicons name="chevron-back" size={22} color="black" />
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <GiftedAvatar 
                        user={{
                            name: employerProfileData.businessName,
                            avatar: employerProfilePicSource,
                        }}
                    />
                    <Text style ={{fontWeight: '500', fontSize: 20, paddingLeft: 10}}>{employerProfileData.businessName}</Text>
                </View>
                {/* replace this view with three dots button that shows action sheet */}
                <View />
            </View>

            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: "applicant",
                    name: applicantName,
                    avatar: applicantProfilePicSource,
                }}

            />
        </View>
    )
}


const styles = StyleSheet.create({
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
})
