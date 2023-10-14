import * as React from 'react';
import {
  Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Dimensions, Image
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import BackgroundTimer from 'react-native-background-timer';
import { BarIndicator, MaterialIndicator } from 'react-native-indicators';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PhoneAuthScreen({route}) {

  const [codeSending, setCodeSending] = useState(false);

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  const [counter, setCounter] = useState(null);

  // countdown timer
  const [timer, setTimer] = useState(60);

  // timer state
  const [loginLoading, setLoginLoading] = useState(false);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    setCodeSending(true);

    // API call that send the verification code to the phone number
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);

    setCodeSending(false);

    let cd = 60;
    const interval = BackgroundTimer.setInterval(() => {
    //code that will be called every 3 seconds
      console.log('cd: ', cd);
      setTimer(cd--);

      //rest of code will be performing for iOS on background too
      if (cd == 0) {
        setTimer(60);
        setConfirm(null);
        BackgroundTimer.clearInterval(interval);
      }
    },
    1000);

    setCounter(interval);
  }

  async function confirmCode(code) {
    try {
      setLoginLoading(true);
      await confirm.confirm(code);
      goNextScreen();
      setLoginLoading(false);
    } catch (error) {
      console.log('Invalid code: ', code);
      alert('Invalid verification code');
      setLoginLoading(false);
    }
  }

  const navigation = useNavigation();

  const goBackToPrevScreen = () => {
    if (counter) {
      BackgroundTimer.clearInterval(counter);
    }
    navigation.goBack();
  }

  const goNextScreen = () => {
    if (route.params?.userType == 'employer') {
      navigation.navigate('SignUpEmployerAdditionalInfo', {
        password: route.params?.password
      })
    } else if (route.params?.userType == 'applicant') {
      navigation.navigate('SignUpApplicantLocation', {
        password: route.params?.password
      })
    }
  }

  const img = require('../../../assets/images/msgDesign.png')

  // code field
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const onChangeCode = (number) => {
    setValue(number);

    if (number.length == 6) {
      confirmCode(number);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.context}>

          <Image source={img} style={{width: windowWidth * .8, height: windowHeight * .25, marginTop: '25%', marginBottom: '10%'}} />

          <Text style={styles.headerText}> Verify your phone number </Text>

          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={onChangeCode}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                <Text style={[styles.cell, isFocused && styles.focusCell]}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />

          { !confirm ?
          <TouchableOpacity onPress={() => signInWithPhoneNumber('+1 ' + route.params?.phoneNumber)}>
            <Text style={styles.getCodeText}> Get verification code </Text>
          </TouchableOpacity> :
          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => signInWithPhoneNumber('+1 ' + route.params?.phoneNumber)}>
            <Text style={styles.waitText}> Re-send in {timer} seconds </Text>
          </TouchableOpacity> }

          <View style={{backgroundColor: 'transparent'}}>
              <TouchableOpacity
                  style={styles.backButton}
                  onPress = {goBackToPrevScreen}>
                  <Text style={{fontSize: 20, textAlign: 'center', color: '#00baff'}}>Back</Text>
              </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
              style={styles.backdoorButton}
              onPress = {goNextScreen}>
              <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontWeight:'bold'}}> Admin backdoor </Text>
          </TouchableOpacity> */}

          { codeSending && <View style={styles.overlayView}>
                <MaterialIndicator color='black' />
            </View> }

          { loginLoading && <View style={styles.overlayView}>
                <BarIndicator color='black' />
            </View> }
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  context: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'antipasto-demibold',
  },
  codeFieldRoot: {
    marginVertical: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  cell: {
    width: windowWidth*.15,
    height: windowWidth*.1,
    fontSize: 24,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  focusCell: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderColor: 'black',
    textAlign: 'center',
  },
  getCodeText: {
    fontSize: 20,
    fontWeight:'bold',
    color: '#00baff',
  },
  waitText: {
    fontSize: 20,
    color: '#9C9FB2',
  },
  backdoorButton: {
    //flex: 1,
    borderRadius: 15,
    backgroundColor: '#00baff',
    width: windowWidth / 1.4,
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backButton: {
    //flex: 1,
    borderRadius: 15,
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
    opacity: 0.5,
  }
})
