
import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert, Animated, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, FontAwesome, AntDesign, Octicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Avatar, Card, Title, Paragraph, Colors, Button, ActivityIndicator } from 'react-native-paper';
import { GiftedChat, Message, GiftedAvatar } from 'react-native-gifted-chat'
import { ChatMessage, serializeGiftedChatMessage, unserializeGiftedChatMessage } from './MessageDataModel';
import { sendNewMessageAPI, fetchMessageAPI, markReadNewMessages } from '../../../apiService/firestoreApis/Chat/ChatMessageApi';
import { useFocusEffect } from '@react-navigation/native';
import { markUnreadNewMessages } from '../../../apiService/firestoreApis/Chat/ChatMessageApi';
import { markChatRead } from '../../../store/ChatMessageReducer';
import { notifyEmployerAppMessage } from '../../../../functions/src';

export default function RootEmployerChatScreen({route}) {
    const applicationData = route.params.applicationData

    const applicantFirstName = applicationData.firstName
    const applicantLastName = applicationData.lastName
    const applicantName = `${applicantFirstName} ${applicantLastName}`
    const applicantProfilePicSource = applicationData.profilePicUrl != "no image" ? applicationData.profilePicUrl : require('../../../../assets/images/profileimg.png')

    const employerProfile = useSelector(state => state.employerProfileReducer).profileData;
    const employerProfilePicSource = employerProfile.profilePicUrl
    const employerName = `${employerProfile.firstName}`

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const [messages, setMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(true)

    useFocusEffect(
        React.useCallback(() => {
            fetchRecentMessages()
        }, [])
      );

    React.useEffect(() => {
        
      }, [])

    async function fetchRecentMessages() {
        fetchMessageAPI(applicationData.id, (err, messages) => {
            if (err != null || messages == null) {
                Alert.alert("Could not get messages")
                return
            }
            messages.map((msg) => {
                if (msg.senderId === employerProfile.id) {
                    msg.user = {
                        _id: employerProfile.id,
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
        markReadNewMessages(applicationData.id, false)
        dispatch(markChatRead(applicationData.id))
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

        const serializedMessage = serializeGiftedChatMessage(newMessage[0], employerProfile.id)
        sendNewMessageAPI(applicationData.id, serializedMessage, true, (err: string) => {
            if (err != null) {
                Alert.alert(err)
                return
            }
            
        })
        markUnreadNewMessages(applicationData.id, true)
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
                            name: applicantName,
                            avatar: applicantProfilePicSource,
                        }}
                    />
                    <Text style ={{fontWeight: '500', fontSize: 20, paddingLeft: 10}}>{applicantFirstName + " " + applicantLastName}</Text>
                </View>
                {/* replace this view with three dots button that shows action sheet */}
                <View />
            </View>

            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: employerProfile.id,
                    name: employerName,
                    avatar: employerProfilePicSource,
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
