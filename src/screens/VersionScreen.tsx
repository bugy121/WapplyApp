import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Text, View } from '../components/Themed';
import { Dimensions } from 'react-native';
import VersionCheck from 'react-native-version-check';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function VersionScreen () {

    const logoImg = require('../../assets/images/wapply-logo-gradient.png');

    let storeUrl = "";
    VersionCheck.needUpdate()
    .then(async res => {
        storeUrl = res.storeUrl;
    });

    const goToAppStore = () => {
        Linking.openURL(storeUrl);
    }

    return (
        <View style={styles.content}>
            <Image style={styles.VersionScreenImage} source={logoImg}/>
            <Text style={styles.title}>
                New Wapply
            </Text>
            <Text style={styles.title}>
                Update Available
            </Text>
            <View style={styles.detailView}>
                <Text style={styles.detailText}>
                    To get the best Wapply experience, please update to the newest version of Buzz in the App Store
                </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={goToAppStore}>
                <Text style={styles.buttonText}>
                    Open App Store
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    VersionScreenImage: {
        width: windowWidth * 0.4,
        height: windowWidth * 0.4,
        borderRadius: 25,
        marginBottom: '15%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    detailView: {
        width: '80%',
        marginVertical: '10%',
    },
    detailText: {
        fontSize: 16,
        color: '#a6a6a6',
        textAlign: 'center',
    },
    button: {
        borderWidth: 2,
        width: '80%',
        height: 60,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500'
    }
})
