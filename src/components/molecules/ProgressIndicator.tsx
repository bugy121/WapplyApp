import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FlatList, View, Text, Alert, StyleSheet, ImageBackground, 
    TouchableOpacity, Button, SafeAreaView, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import window from '../../constants/Layout';
import JobTitleTags from '../../components/atoms/JobTitleTags';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function ProgressIndicator (status) {

    let inProgress = false;
    let result = false;

    if (status.state == 'applied') {
        inProgress = true;
        result = false;
    } else {
        inProgress = false;
        result = true;
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.statusView}>
                <Text style={[styles.statusText, {marginLeft: 10, color: '#5CE1E6'}]}> Applied </Text>
                <Text style={[styles.statusText, {color: '#fcba03'}]}> In Progress </Text>
                <Text style={[styles.statusText, {marginRight: 15, color: '#06bf00'}]}> Result </Text>
            </View> 
            <View style={styles.statusIndicator}>
                <View style={styles.indicatorBox}> 
                    <FontAwesome5 name="check" size={30} color="#5CE1E6" />
                </View>
                <View style={[styles.indicatorLine, {backgroundColor:'#fcba03'}]} />
                <View style={inProgress ? [styles.indicatorBoxReversed, {backgroundColor: '#fcba03', borderColor: '#fcba03'}] : [styles.indicatorBox, {borderColor:'#fcba03'}]}> 
                    { !inProgress && <FontAwesome5 name="check" size={30} color="#fcba03" /> }
                    { inProgress && <Text style={styles.progressTextReversed}> 2 </Text> }
                </View>
                <View style={[styles.indicatorLine, {backgroundColor:'#06bf00'}]} />
                <View style={result ? [styles.indicatorBoxReversed, {borderColor: '#06bf00', backgroundColor: '#06bf00'}] : [styles.indicatorBox, {borderColor: '#06bf00'}]}> 
                    { result && <FontAwesome5 name="check" size={30} color="white" /> }
                    { !result && <Text style={styles.progressText}> 3 </Text> }
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop: '-12%'
    },
    statusView: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: 'transparent', 
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: -15,
    },
    statusIndicator: {
        flexDirection: 'row',
        height: 100,
        backgroundColor: 'transparent', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorLine: { 
        width:'16%', 
        backgroundColor: '#5CE1E6', 
        height: 2, 
        alignSelf: 'center'
    },
    indicatorBox: {
        height: 70,
        width: 70,
        borderRadius: 45,
        borderColor: '#5CE1E6',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorBoxReversed: {
        height: 70,
        width: 70,
        borderRadius: 45,
        borderColor: '#5CE1E6',
        backgroundColor: '#5CE1E6',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#06bf00'
    },
    progressTextReversed: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white'
    }
})