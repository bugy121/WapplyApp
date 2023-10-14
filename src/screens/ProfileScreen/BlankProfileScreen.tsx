import * as React from 'react';
import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/core';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function BlankProfileScreen() {

    const navigation = useNavigation();
    const headerImage = require('../../../assets/images/wapply-logo-gradient.png');
    const gradientBackground = require('../../../assets/images/gradient1.png');

    return (
        <View style={styles.container}>
        {/* <ImageBackground source={gradientBackground} resizeMode="cover"> */}
            <ImageBackground source={headerImage}
                resizeMode="cover"
                style={styles.logoImage}
                imageStyle={{ borderRadius: 15}}/>

            <Text style={styles.title}> 
                Log in or Register to start applying
            </Text>

            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}> Get Started </Text>
            </TouchableOpacity>
        {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: '20%'
    },
    logoImage: {
        borderRadius: 10,
        padding: "25%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButton: {
        height: 70,
        width: 130,
        borderRadius: 15,
        backgroundColor: 'blue',
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: 'white', 
        fontSize: 18,
        fontWeight: 'bold'
    },
    registerButton: {
        height: 50,
        width: 100,
        borderRadius: 15,
        backgroundColor: '#FAFAFA',
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: 'blue', 
        fontSize: 18,
        fontWeight: 'bold'
    },
})
