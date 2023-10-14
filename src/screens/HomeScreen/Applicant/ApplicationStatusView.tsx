import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
//import Icon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function ApplicationStatusView({route}) {
    const data = route.params.data.app
    const navigation = useNavigation();
    const interestToggleData = [];

    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;

    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(8);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(8);
    const [shadowRadius, setShadowRadius] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.15);

    const goBackToPrevScreen = () => {
        //navigation.navigate("Root")
        navigation.goBack()
    }

    const withdrawApp = () => {
        // withdrawAppliedJobPost(userInfo.id, data.id);
    }

    return(
        <View style={{marginTop: 60}}>
            <TouchableOpacity
                onPress={goBackToPrevScreen}
                style={{paddingLeft: 15}}
            >
                <Ionicons name="chevron-back" size={22} color="black" />
            </TouchableOpacity>

            <View style={{paddingLeft: 30, paddingVertical: 30}}>
                <Text style={styles.title}>{data.firstName} {data.lastName}</Text>
                {/* <Text style={styles.dateText}>Posted On: {data.postedOn}</Text> */}

                <View style={styles.salaryView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Age
                    </Text>
                    <Text style={{fontSize: 20, marginBottom: 10, marginLeft: 15, }}> {data.age} </Text>
                </View>
                <View style={styles.salaryView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Education
                    </Text>
                    <Text style={{fontSize: 20, marginBottom: 10, marginLeft: 15, }}> {data.education} </Text>
                </View>

                <View style={styles.detailView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Additional Question Answer
                    </Text>
                    <Text style={{fontSize: 18, marginBottom: 10, marginLeft: 15, }}>
                        Educates customers by presenting and explaining the coffee drink menu.
                        Sells coffees and coffee grinding and brewing equipment by explaining differences in coffee beans and coffee preparation machines.
                    </Text>
                </View>
                <View style={styles.salaryView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Application Status
                    </Text>
                    <Text style={{fontSize: 20, marginBottom: 10, marginLeft: 15, }}>{data.status}</Text>
                </View>

                <TouchableOpacity style={styles.acceptButtonView} onPress={() => withdrawApp()}>
                    <Text style={{fontSize: 22, marginVertical: 10, fontWeight: '600', color: '#39c936'}}>
                        Accept Application
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rejectButtonView} onPress={() => withdrawApp()}>
                    <Text style={{fontSize: 22, fontWeight: '600', color: 'red'}}>
                        Decline Application
                    </Text>
                </TouchableOpacity>
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
    salaryView: {
        width: '90%',
        height: 90,
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
    detailView: {
        width: '90%',
        height: 190,
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
    acceptButtonView: {
        width: '90%',
        height: 80,
        marginTop: 45,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButtonView: {
        width: '90%',
        height: 80,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
})