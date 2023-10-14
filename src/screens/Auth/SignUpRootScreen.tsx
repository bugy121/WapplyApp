import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, Button, TextInput, ImageBackground, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const headerImage = require('../../../assets/images/lr-logo.png');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpRootScreen() {
    const auth = getAuth();
    const navigation = useNavigation();

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            uploadNewUserInfo();
        })
        .catch(err => alert(err.message))

    }

    const goBackToLogin = () => {
        navigation.navigate("Login");
    }

    const goNextScreen = () => {
        navigation.navigate("SignUpUserType", {
            'email': email,
            'password': password,
        });
    }

    const uploadNewUserInfo = () => {

    }

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    //const phoneNumberRef = useRef(null);

    return (
        <View style={styles.container}>
            <View style={styles.headerBanner}>
                <ImageBackground source={headerImage} 
                resizeMode="cover" 
                style={styles.image}
                imageStyle={{ borderRadius: 15}}/>
            </View>
            <View style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    ref={emailRef}
                    placeholder = "Email"
                    onChangeText = {(email) => setEmail(email)}
                />
                <TextInput
                    style={styles.textInput}
                    ref={passwordRef}
                    placeholder = "Password"
                    secureTextEntry={true} 
                    onChangeText = {(password) => setPassword(password)}
                />
                <TextInput
                    style={styles.textInput}
                    ref={nameRef}
                    placeholder = "Name"
                    onChangeText = {(name) => setName(name)}
                />
                
                <TextInput
                    style={styles.textInput}
                    //ref={phoneNumberRef}
                    placeholder = "Phone Number"
                    onChangeText = {(phoneNumber) => {
                        phoneNumber = phoneNumber.replace('.', '')
                        setPhoneNumber(phoneNumber)
                    }}
                    keyboardType={'numeric'}
                    value={phoneNumber}
                />
                <View style={{backgroundColor: 'transparent'}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {() => goBackToLogin()}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Back To Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {() => goNextScreen()}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}>Next</Text>
                    </TouchableOpacity>
                </View>

            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
        backgroundColor: '#f5f7fb',
    },
    headerBanner: {
        flex: 2,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#f5f7fb',
        //backgroundColor: 'red',
        paddingTop: 50,
    },
    content: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 0,
        backgroundColor: '#f5f7fb',
    },
    image: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    textInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth / 1.2,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white'
    },
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#00baff',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    }
})