import * as React from 'react';
import { useRef, useState } from 'react';
import { StyleSheet, Animated, TextInput, ImageBackground, Alert, ActivityIndicator } from 'react-native';

import { Text, View } from '../../components/Themed';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux'
import { changeEmployerProfileData } from '../../store/EmployerProfileReducer';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { updateApplicantProfileData } from '../../store/ApplicantProfileReducer'
import { fetchApplicantProfileDataAPI } from '../../apiService/firestoreApis/ApplicantProfileDataApi';
import { fetchEmployerProfile } from '../../apiService/firestoreApis/employerProfileApiFireStore';
import { getEmailAddressByPhoneNumberAPI } from '../../apiService/firestoreApis/authenticationApi';
import FadeInView from '../../components/organisms/FadeInView';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BarIndicator } from 'react-native-indicators';
import { signInWithPhoneNumber } from '../../apiService/firestoreApis/authenticationApi';
import BackgroundTimer from 'react-native-background-timer';
import Video from 'react-native-video';

const headerImage = require('../../../assets/images/wapply-logo-gradient.png');
const gradientBackground = require('../../../assets/images/gradient1.png');
const backgroundVideo = require('../../../assets/videos/sample2.mp4')

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LoginScreen({route}) {
    const auth = getAuth();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    let uid: string = "";

    const alreadyLoggedin = route.params?.data;

    const [loginLoading, setLoginLoading] = useState(false);

    // for testing
    const applicantJobList = useSelector(state => state.applicantJobListingReducer);
    const appliedJobList = useSelector(state => state.applicantAppliedJobReducer);

    const updateUser = (userInfo) => {
        if (!loginLoading) {
            setLoginLoading(true);
            if (userInfo.userType.toLowerCase() == "employer") {
                dispatch(changeEmployerProfileData(userInfo));
            } else if (userInfo.userType.toLowerCase() == "applicant") {
                // update applicant profile data
                dispatch(updateApplicantProfileData(userInfo));
            }
            setApplicantLogin(false);
            setEmployerLogin(false);
            navigation.navigate("Root");
            setLoginLoading(false);
        }
    }


    React.useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                uid = user.uid
                setLoginLoading(true);

                // if (employerLogin || alreadyLoggedin) {
                    // console.log('Login as an employer');
                    // Firestore get employer profile data
                    fetchEmployerProfile(uid, async (err, profile) => {
                        if (err != null) {
                            setLoginLoading(false);
                            return
                        }
                        // update user profile data
                        await updateUser(profile)
                    })
                // }
                
                // if (applicantLogin || alreadyLoggedin) {
                    // console.log('Login as an applicant');
                    // Firestore get applicant profile data
                    fetchApplicantProfileDataAPI(uid, async (data) => {
                        // update user profile data
                        await updateUser(data);
                    });
                // }
            }
        })

        return unsubscribe
    }, [])

    const goToSignUpRootScreen = () => {
        navigation.navigate("SignUpUserType")
    }

    const handleLogin = () => {
        // login with phone number
        if (phone && phoneLogin) {
            getEmailAddressByPhoneNumberAPI(phone, (email) => {
                const loginPromise = signInWithEmailAndPassword(auth, email, password)
                loginPromise.then((result) => {
                console.log("Login success")
            }, err => {
                Alert.alert("Sign In Error", "Account doesn't exist or password wrong")
                });
            });
        } else {
            const loginPromise = signInWithEmailAndPassword(auth, email, password)
            loginPromise.then((result) => {
                // console.log("Sucess: " + JSON.stringify(result))
                console.log("Login success")
            }, err => {
                Alert.alert("Sign In Error", "Account doesn't exist or password wrong")
            })
        }
    }

    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [password, setPassword] = React.useState('');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // user type
    const [applicantLogin, setApplicantLogin] = React.useState(true);
    const [employerLogin, setEmployerLogin] = React.useState(false);

    // login method
    const [emailLogin, setEmailLogin] = React.useState(false);
    const [phoneLogin, setPhoneLogin] = React.useState(false);

    // // usertype button animation
    // var moveAnimation = new Animated.ValueXY({ x: 0, y: 0 })
    // const moveBallLeft = () => {
    //     console.log('moving left');
    //     Animated.spring(moveAnimation, {
    //       toValue: {x: 150, y: 0},
    //     }).start(() => console.log('after move'))
    // }
    // const moveBallRight = () => {
    //     console.log('moving right');
    //     Animated.spring(moveAnimation, {
    //       toValue: {x: 0, y: 0},
    //     }).start(() => console.log('after move'))
    // }

    // forgot password
    const [resetEmail, setResetEmail] = useState('');
    const [resetPhone, setResetPhone] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false); // reset password with email
    const [forgotPasswordPhone, setForgotPasswordPhone] = useState(false); // reset password with email
    const [codeSent, setCodeSent] = useState(false); // if the code is sent succesfully
    const [confirm, setConfirm] = useState(); // the confirmation object
    const [verificationCode, setVerificationCode] = useState(); // code to login

    // countdown timer
    const [timer, setTimer] = useState(60);
    const [backgroundTimer, setBackgroundTimer] = useState();

    const resetPassword = (resetEmail: string) => { 
        console.log('start resetting password on email');
        sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
            // Password reset email sent!
            console.log('password reset email sent!');
            Alert.alert('Reset password information sent to your email address!');
            setForgotPassword(false); 
            setEmailLogin(true);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('reset password failed');
            console.log(errorMessage);
            Alert.alert('There is no account associated to this email address!')
        }
    )}

    const resetPasswordPhone = (resetPhone: string) => { 
        console.log('start resetting password on phone');
        try {
            sendVerificationCode(resetPhone);
            setCodeSent(true);
        } catch (err) {
            console.log('Send code to phone number failed!');
            console.log(err);
            BackgroundTimer.clearInterval(backgroundTimer);
            Alert.alert('There is no account associated to this phone number!')
        }
    }

    // Send verification Code
    async function sendVerificationCode(phoneNumber) {
        const confirmation = signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    
        let cd = 60;
        const interval = BackgroundTimer.setInterval(() => { 
        //code that will be called every 3 seconds 
        console.log('cd: ', cd);
        setTimer(cd--);

        //rest of code will be performing for iOS on background too
        if (cd == 0) {
            setTimer(60);
            BackgroundTimer.clearInterval(interval);
        }
        }, 
        1000);
        setBackgroundTimer(interval);
    }

    // confirm verification code
    async function confirmCode() {
        try {
          setLoginLoading(true);
          await confirm.confirm(verificationCode);
          setLoginLoading(false);
          console.log('verified successfully')!
        } catch (error) {
          console.log('Invalid code: ', verificationCode);
          Alert.alert('Invalid verification code');
          setLoginLoading(false);
        }
      }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
        {/* <ImageBackground source={gradientBackground} resizeMode="cover" style={styles.backgroundImage}> */}
        <Video
          source={backgroundVideo}
          style={styles.backgroundVideo}
          muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.0}
          ignoreSilentSwitch={"obey"}
        />
        <View style={styles.backgroundImage}>
            <View style={styles.headerBanner}>
                <ImageBackground source={headerImage}
                resizeMode="cover"
                style={styles.logoImage}
                imageStyle={{ borderRadius: 15}}/>
            </View>

            {/* { !forgotPassword && !forgotPasswordPhone && !emailLogin && !phoneLogin && 
            <Animated.View style={styles.userTypeView}>
                <TouchableOpacity style={applicantLogin ? styles.applicantLoginButtonSelected : styles.applicantLoginButton} 
                onPress={() => {setApplicantLogin(true); setEmployerLogin(false); }}>
                    <Text style={applicantLogin ? styles.applicantLoginTextSelected : styles.applicantLoginText}> Applicant </Text>
                </TouchableOpacity>

                <TouchableOpacity style={employerLogin ? styles.employerLoginButtonSelected : styles.employerLoginButton} 
                onPress={() => {setEmployerLogin(true); setApplicantLogin(false); }}>
                    <Text style={employerLogin ? styles.employerLoginTextSelected : styles.employerLoginText}> Employer </Text>
                </TouchableOpacity>
            </Animated.View> } */}

            <Text style={styles.title}> Get a job in 5 minutes</Text>

            { !forgotPassword && !forgotPasswordPhone && !emailLogin && !phoneLogin && <FadeInView style={styles.loginMethodView}>
                <TouchableOpacity
                    style={styles.phoneLoginButton}
                    onPress = {() => setPhoneLogin(true)}>
                    <FontAwesome name='mobile-phone' size={30} style={{color: '#465f9e', marginLeft: '20%'}} />
                    <Text style={{fontSize: 18, textAlign: 'center', color: '#465f9e', marginLeft: 25}}>Login with Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.emailLoginButton}
                    onPress = {() => setEmailLogin(true)}>
                    <Ionicons name='ios-mail' size={24} style={{color: '#68469e', marginLeft: '18.5%'}} />
                    <Text style={{fontSize: 18, textAlign: 'center', color: '#68469e', marginLeft: 20}}>Login with Email</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: '10%'}}>
                    <View style={{ width:'30%', backgroundColor: 'white', height: 1, alignSelf: 'center'}} />
                    <Text style={{ color:"white", alignSelf:'center', paddingHorizontal:5, fontSize: 20, backgroundColor: 'transparent' }}>     OR     </Text>
                    <View style={{ width:'30%', backgroundColor: 'white', height: 1, alignSelf: 'center'}} />
                </View>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress = {goToSignUpRootScreen}>
                    <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Register</Text>
                </TouchableOpacity>
            </FadeInView> }

            { !forgotPassword && !forgotPasswordPhone && emailLogin && <FadeInView style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    ref={emailRef}
                    placeholder = "email"
                    onChangeText = {(email) => setEmail(email)}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    ref={passwordRef}
                    placeholder = "password"
                    secureTextEntry={true}
                    onChangeText = {(password) => setPassword(password)}
                />
                <View style={{backgroundColor: 'transparent'}}>
                    <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress = {() => {setForgotPassword(true)}}>
                        <Text style={{fontSize: 18, textAlign: 'center', color: '#2e5fff', }}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {handleLogin}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress = {() => {setEmailLogin(false); setPhoneLogin(false)}}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Go back</Text>
                    </TouchableOpacity>
                </View>
                {loginLoading && <Text style = {{paddingTop: 10}}>Logging In</Text>}
                {loginLoading && <ActivityIndicator size="large"/>}
            </FadeInView> }

            { !forgotPassword && !forgotPasswordPhone && phoneLogin && <FadeInView style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    placeholder = "phone number"
                    onChangeText = {(phone) => setPhone(phone)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='numeric'
                />
                <TextInput
                    style={styles.textInput}
                    ref={passwordRef}
                    placeholder = "password"
                    secureTextEntry={true}
                    onChangeText = {(password) => setPassword(password)}
                />
                <View style={{backgroundColor: 'transparent'}}>
                    {/* <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress = {() => {setForgotPasswordPhone(true)}}>
                        <Text style={{fontSize: 18, textAlign: 'center', color: '#2e5fff', }}>Forgot password?</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {handleLogin}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress = {() => {setEmailLogin(false); setPhoneLogin(false)}}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Go back</Text>
                    </TouchableOpacity>
                </View>
            </FadeInView> }

            { forgotPassword && !forgotPasswordPhone && <FadeInView style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    placeholder = "Email Address"
                    onChangeText = {(email) => setResetEmail(email)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={resetEmail}
                />
                <View style={{backgroundColor: 'transparent', marginTop: '8%'}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress = {() => resetPassword(resetEmail)}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Send Reset Password Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress = {() => {setForgotPassword(false); setEmailLogin(true)}}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Go back</Text>
                    </TouchableOpacity>
                </View>
            </FadeInView> }

            { forgotPasswordPhone && !forgotPassword && <FadeInView style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    placeholder = "Phone Number"
                    onChangeText = {(phone) => setResetPhone(phone)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={resetPhone}
                />
                { codeSent && <TextInput
                    style={styles.textInput}
                    placeholder = "Code"
                    onChangeText = {(code) => setVerificationCode(code)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={verificationCode}
                /> }
                <View style={{backgroundColor: 'transparent', marginTop: '8%'}}>
                { codeSent && 
                <TouchableOpacity
                    style={styles.button} onPress = {() => {confirmCode}}>
                    <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Verify</Text>
                </TouchableOpacity> }

                    { timer == 60 ? 
                    <TouchableOpacity
                        style={styles.button} onPress = {() => resetPasswordPhone(resetPhone)} disabled={timer != 60}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Send Code</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}> Re-send in {timer} seconds </Text>
                    </TouchableOpacity> }

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress = {() => {setForgotPasswordPhone(false); setPhoneLogin(true)}}>
                        <Text style={{fontSize: 20, textAlign: 'center', color: 'white',fontWeight:'bold'}}>Go back</Text>
                    </TouchableOpacity>
                </View>
            </FadeInView> }

            { loginLoading && <View style={styles.overlayView}>
                <BarIndicator color='black' />
            </View> }

        {/* </ImageBackground> */}
        </View>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '12%',
        backgroundColor: 'transparent',
    },
    loginMethodView: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    backgroundImage: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    backgroundVideo: {
        height: windowHeight,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0
    },
    headerBanner: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        borderRadius: 10,
        width: windowWidth * 0.4,
        height: windowWidth * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10%',
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        color: 'white',
    },
    textInput: {
        textAlign: 'center',
        borderRadius: 15,
        height: 50,
        width: windowWidth / 1.2,
        fontSize: 20,
        margin: 10,
        backgroundColor: 'white',
    },
    button: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#5ce1e6',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        //flex: 1,
        borderRadius: 15,
        backgroundColor: '#bfbfbf',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    userTypeView: {
        height: '8%',
        width: '70%',
        borderRadius: 45,
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    // typeBubble: {
    //     height: '100%',
    //     width: '50%',
    //     position: 'absolute',
    //     borderRadius: 45,
    //     backgroundColor: 'blue',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     flexDirection: 'row',
    // },
    applicantLoginButton: {
        height: '60%',
        borderRadius: 45,
        backgroundColor: 'white',
        // backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '10%',
        flexDirection: 'row',
    },
    applicantLoginButtonSelected: {
        height: '60%',
        borderRadius: 45,
        backgroundColor: '#6b95ff',
        // backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '10%',
        flexDirection: 'row',
    },
    employerLoginButton: {
        height: '60%',
        borderRadius: 45,
        backgroundColor: 'white',
        // backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%',
        flexDirection: 'row',
    },
    employerLoginButtonSelected: {
        height: '60%',
        borderRadius: 45,
        backgroundColor: '#c29cff',
        // backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%',
        flexDirection: 'row',
    },
    applicantLoginText: {
        fontSize: 18, 
        textAlign: 'center', 
        color: '#465f9e'
    },
    applicantLoginTextSelected: {
        fontSize: 18, 
        fontWeight: 'bold',
        textAlign: 'center', 
        color: 'white'
    },
    employerLoginText: {
        fontSize: 18, 
        textAlign: 'center', 
        color: '#68469e'
    },
    employerLoginTextSelected: {
        fontSize: 18, 
        fontWeight: 'bold',
        textAlign: 'center', 
        color: 'white'
    },
    phoneLoginButton: {
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#465f9e',
        width: windowWidth / 1.4,
        height: 60,
        textAlign: 'center',
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        flexDirection: 'row',
    },
    emailLoginButton: {
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#68469e',
        width: windowWidth / 1.4,
        height: 60,
        textAlign: 'center',
        alignItems: 'center',
        // justifyContent: 'center',
        marginTop: 20,
        flexDirection: 'row',
    },
    forgotPasswordButton: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        justifyContent: 'center',
    },
    registerButton: {
        borderRadius: 15,
        backgroundColor: '#5ce1e6',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: '10%',
    },
    switchButton: {
        borderRadius: 15,
        backgroundColor: '#5ce1e6',
        width: windowWidth / 1.4,
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    overlayView: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        opacity: 1,
    }
})
