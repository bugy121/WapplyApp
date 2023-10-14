import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Divider } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { addNewJobAppliedAPI } from '../../apiService/realtimeDB/realtimeDBApi';
import { useNavigation } from '@react-navigation/core';
import { getJobApplicationsAPI } from '../../apiService/firestoreApis/EmployerJobPostApi';
import { Badge } from 'react-native-paper';

const img = require('../../../assets/images/blankbg.png');

export default function OutOfAppPostCard(data) {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    // console.log("\n open card data: " + JSON.stringify(jobPostData))

    const userInfo = useSelector(state => state.employerProfileReducer).profileData
    const postInfo = useSelector(state => state.employerJobListingReducer);
    
    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(8);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(8);
    const [shadowRadius, setShadowRadius] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.15);

    const cardData = data.data;

    const goToApplicationsDetailView = () => {
        navigation.navigate("LinkPostDetailView", {
            data: cardData,
        })
    }
    
    let latestDateBumped = cardData.latestDateBumped.split(" ")[1] + " " + cardData.latestDateBumped.split(" ")[2] +
    ", " + cardData.latestDateBumped.split(" ")[3]

    return(
        <TouchableOpacity onPress={goToApplicationsDetailView}>
            <View style={[styles.container, {
                shadowOffset: {
                width: shadowOffsetWidth,
                height: shadowOffsetHeight
                },
                shadowOpacity,
                shadowRadius
            }]}>
                <ImageBackground 
                    source={img} 
                    resizeMode="cover" 
                    style={styles.image}
                    imageStyle={{ borderRadius: 15}}>
                    <View style={{backgroundColor: 'transparent', width: '70%'}}> 
                        <Text style={styles.title}>{cardData.roleName} </Text>
                        <Divider 
                            style={{marginBottom: '5%'}}
                            orientation="horizontal" 
                            width={1} />
                        <Text style={styles.content}>Updated: {latestDateBumped} </Text>
                        <Text style={styles.content}>Job Post {cardData.status == 'ACTIVE' ? "Active" : "Inactive"} </Text>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        backgroundColor: 'white',
        fontWeight: 'bold'
    },
    content: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 5
    },
    image: {
        flex: 1,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
})