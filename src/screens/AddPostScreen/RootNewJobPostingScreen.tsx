import { StyleSheet, Alert, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View } from '../../components/Themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { JobPostingData } from '../../store/ReducerAllDataTypes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/core';
import {savePostingData} from '../../store/EmployerPostingCreationReducer'
import { Ionicons, FontAwesome, AntDesign, Octicons } from '@expo/vector-icons';
import { validateJobPostingFirstPage } from '../../util/FormValidation';
import RadioGroup from 'react-native-radio-buttons-group';

const QuestionButton = ({questionTypeColor, questionTypeTitle, questionTypeIcon, questionContentColor, onPress}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: questionTypeColor}]}>
    <Text style={[styles.title, {color: questionContentColor}]}>{questionTypeTitle}</Text>
    <FontAwesomeIcon
      name={questionTypeIcon}
      size={32}
      color={questionContentColor}
    />
  </TouchableOpacity>
);

const educationLevelGroup = [{
    id: '1', // acts as primary key, should be unique and non-empty string
    size: 26,
    label: 'Everyone',
    labelStyle: {
        fontSize: 16,
    },
    value: '1',
    selected: true
}, {
    id: '2', // acts as primary key, should be unique and non-empty string
    size: 26,
    label: 'Some High School Education and above',
    labelStyle: {
        fontSize: 16,
    },
    value: '2'
}, {
    id: '3',
    size: 26,
    label: 'Graduated from High School and above',
    labelStyle: {
        fontSize: 16,
    },
    value: '3'
}, {
    id: '4',
    size: 26,
    label: 'Some College Education and above',
    labelStyle: {
        fontSize: 16,
    },
    value: '4'
}, {
    id: '5',
    size: 26,
    label: 'Graduated from College and above',
    labelStyle: {
        fontSize: 16,
    },
    value: '5'
}]

const jobTypeGroup = [{
    id: '1',
    size: 24,
    label: 'In-person',
    labelStyle: {
        fontSize: 16,
    },
    value: '1',
    selected: true
}, {
    id: '2',
    size: 24,
    label: 'Remote',
    labelStyle: {
        fontSize: 16,
    },
    value: '2'
}]

export default function RootNewJobPostingScreen({route}) {

    const windowWidth = Dimensions.get('window').width;

    const newJobPostData = useSelector(state => state.employerPostingCreationReducer);
    const [roleName, setRoleName] = useState(String(newJobPostData.roleName));
    const [hourlySalaryLow, setHourlySalaryLow] = useState(String(newJobPostData.salaryRangeLow));
    const [hourlySalaryHigh, setHourlySalaryHigh] = useState(String(newJobPostData.salaryRangeHigh));
    const [hourlyWorkLow, setHourlyWorkLow] = useState(String(newJobPostData.workHourLow));
    const [hourlyWorkHigh, setHourlyWorkHigh] = useState(String(newJobPostData.workHourHigh));

    const [fulltimeSelected, setFulltime] = useState(newJobPostData.isFulltime);
    const [parttimeSelected, setParttime] = useState(newJobPostData.isParttime);
    const [internshipSelected, setInternship] = useState(newJobPostData.isInternship);
    const [benefits, setBenefits] = useState(newJobPostData.roleBenefits);

    const [radioButtons, setRadioButtons] = useState(educationLevelGroup);
    const [radioButtonSelected, setRadioButtonSelected] = useState('0');
    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);

        for (let button of radioButtonsArray) {
            if (button.selected) {
                setRadioButtonSelected(button.id);
            }
        }
    }

    const [remoteButtons, setRemoteButtons] = useState(jobTypeGroup);
    const [isRemote, setIsRemote] = useState('1');
    function changeRemoteRadioButton(radioButtonsArray) {
        setRemoteButtons(radioButtonsArray);

        for (let button of radioButtonsArray) {
            if (button.selected) {
                setIsRemote(button.id);
            }
        }
    }

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const scrollRef = useRef();

    const userInfo = useSelector(state => state.employerProfileReducer).profileData;

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    // Reset screen if navigated from finishing creating a job post
    const resetPostState = () => {
        if (route.params) {
            setRoleName("")
            setHourlySalaryLow("0")
            setHourlySalaryHigh("0")
            setHourlyWorkLow("0")
            setHourlyWorkHigh("0")
            setFulltime(false)
            setParttime(false)
            setInternship(false)
            setBenefits("");
            scrollToTop();
            route.params = undefined;
            navigation.navigate("Root")
        }
    }
    resetPostState();

    const goNextScreen = () => {
        // check if the employer has exceeded the job post limit
        // if (userInfo.jobPostIds.length > 8) {
        //     Alert.alert('You can only have 8 active job posts at most!');
        //     return
        // }

        const newJobPosting: JobPostingData = {
            id: newJobPostData.id,
            posterId: userInfo.id,
            datePosted: newJobPostData.datePosted,
            latestDateBumped: newJobPostData.latestDateBumped,
            address: newJobPostData.address,
            roleName: roleName,
            roleBenefits: benefits,
            roleDescription: newJobPostData.roleDescription,
            businessName: newJobPostData.businessName,
            businessDescription: newJobPostData.businessDescription,
            salaryRangeLow: parseInt(hourlySalaryLow),
            salaryRangeHigh: parseInt(hourlySalaryHigh),
            workHourLow: parseInt(hourlyWorkLow),
            workHourHigh: parseInt(hourlyWorkHigh),
            isInternship: internshipSelected,
            isParttime: parttimeSelected,
            isFulltime: fulltimeSelected,
            additionalQuestionTitles: newJobPostData.additionalQuestionTitles,
            views: newJobPostData.views,
            applicants: newJobPostData.applicants,
            status: newJobPostData.status,
            applicationIds: newJobPostData.applicationIds,
            location: newJobPostData.location,
            geoHash: newJobPostData.geoHash,
            logoImgUrl: newJobPostData.logoImgUrl,
            educationLevel: parseInt(radioButtonSelected),
            isRemote: isRemote == '2',
            distanceToApplicant: newJobPostData.distanceToApplicant
        }

        const err = validateJobPostingFirstPage(newJobPosting);

        if (err.length == 0) {
            dispatch(savePostingData(newJobPosting))
            console.log('newJobPosting remote: ', newJobPosting.isRemote)
            navigation.navigate("CreationCustomQuestion", {data: true})
        } else {
            Alert.alert(err);
        }
    }

    const renderRequiredInformationRow = ({item, index}) => {
        return (
            <View style={{flexDirection: 'row', marginVertical: 5, marginRight: 30, marginLeft: 15}}>
                <Octicons size={15} name='primitive-dot' style={{paddingTop: 5, paddingRight: 10}} />
                <Text style={{fontSize: 20}}>{item}</Text>
            </View>

        )
    }

    const goPrev = () => {
        navigation.goBack()
    }

  return (
    <View style={{flex: 1}}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView ref={scrollRef} style={{flex: 1, paddingHorizontal: 20, paddingTop:70, paddingBottom: 50, backgroundColor: 'white'}}>
        <TouchableOpacity
            onPress={goPrev}
            style={{paddingBottom: 15}}
            >
                <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
        <Text style={[styles.sectionTitle, {fontSize: 24, marginBottom: 15, textAlign: 'center'}]}>Create a New Job Post</Text>
        <Text style={styles.sectionTitle}>Job Title</Text>
        <TextInput value={roleName}
            onChangeText={setRoleName}
            style={styles.inputField}
            placeholder="Brief but specific title"
            />
        <View style={{flexDirection: 'row'}}>
            <Text style={[styles.sectionTitle, {paddingTop: 2}]}>
                Salary Range
            </Text>
            <FontAwesome name="money" size={30} color="green" style={{paddingLeft: 10}} />
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 30, justifyContent: 'space-between', padding: 10}}>
            <View style={styles.salaryBox}>
                <Text style={styles.dollarText}>$</Text>
                <TextInput value={hourlySalaryLow}
                    keyboardType='numeric'
                    onChangeText={setHourlySalaryLow}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>/hr</Text>
            </View>

            <Text style={{fontSize: 22, flex: 1, alignSelf: 'center', textAlign: 'center'}}>To</Text>
            <View style={styles.salaryBox}>
                <Text style={styles.dollarText}>$</Text>
                <TextInput value={hourlySalaryHigh}
                    keyboardType='numeric'
                    onChangeText={setHourlySalaryHigh}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>/hr</Text>
            </View>

        </View>

        <View style={{flexDirection: 'row'}}>
            <Text style={styles.sectionTitle}>Work Hours / Week</Text>
            <AntDesign name='clockcircle' size={22} color={'#26c7fc'} style={{paddingLeft: 8}} />
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 30, justifyContent: 'space-between', padding: 10}}>
            <View style={styles.salaryBox}>
                <TextInput value={hourlyWorkLow}
                    keyboardType='numeric'
                    onChangeText={setHourlyWorkLow}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>hours</Text>
            </View>

            <Text style={{fontSize: 22, flex: 1, alignSelf: 'center', textAlign: 'center'}}>To</Text>
            <View style={styles.salaryBox}>
                <TextInput value={hourlyWorkHigh}
                    keyboardType='numeric'
                    onChangeText={setHourlyWorkHigh}
                    style={styles.salaryInput}
                    maxLength={6}
                />
                <Text style={styles.hourText}>hours</Text>
            </View>

        </View>

        <Text style={styles.sectionTitle}>Employment Type</Text>
        <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 25, padding: 10}}>
            <TouchableOpacity style={{borderWidth: 1, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, padding: 10, backgroundColor: fulltimeSelected ? 'gray' : 'white'}}
                onPress={() => {
                    setFulltime(!fulltimeSelected)
                }}
            >
                <Text style={[styles.employmentType, {paddingRight: 10}]}>Full-time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, padding: 10, backgroundColor: parttimeSelected ? 'gray' : 'white', marginHorizontal: -25}}
                onPress={() => {
                    setParttime(!parttimeSelected)
                }}
            >
                <Text style={[styles.employmentType, {paddingRight: 10}]}>Part-time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderWidth: 1, borderTopRightRadius: 10, borderBottomRightRadius: 10, padding: 10, backgroundColor: internshipSelected ? 'gray' : 'white'}}
                onPress={() => {
                    setInternship(!internshipSelected)
                }}
            >
                <Text style={styles.employmentType}>Internship</Text>
            </TouchableOpacity>
        </View>

        <View style={{marginBottom: '10%'}}>
            <RadioGroup 
                layout='row'
                radioButtons={jobTypeGroup} 
                onPress={changeRemoteRadioButton}
                containerStyle={{justifyContent: 'space-around', alignItems: 'flex-start'}}
            />
        </View>

        <View>
            <Text style={styles.sectionTitle}>Job Benefits</Text>
            <Text style={{fontWeight: '300', fontSize: 12, paddingBottom: 5}}>Please enter each benefit on its own line</Text>
            <TextInput value={benefits}
                onChangeText={setBenefits}
                style={styles.multilineInput}
                multiline={true}
                placeholder="Benefits"
                />
            <Text style={{alignSelf: 'flex-end', marginRight: 5, fontWeight: '300', fontSize: 12}}>Character Count: {benefits.length}/500</Text>
        </View>
                
        <View>
            <Text style={styles.sectionTitle}>Education </Text>
            <Text style={{fontWeight: '300', fontSize: 14, paddingBottom: 5}}>Who can apply to this job?</Text>
            <RadioGroup 
                radioButtons={educationLevelGroup} 
                onPress={onPressRadioButton}
                containerStyle={{alignItems: 'flex-start'}}
            />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {/* <TouchableOpacity style={[styles.savePostingButtonStyle, {width: windowWidth / 3}]}
                onPress={goPrev}>
                <Text style={{fontSize: 22}}>Go Back</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.savePostingButtonStyle, {width: windowWidth / 2}]}
            onPress={goNextScreen}>
                <Text style={{fontSize: 22}}>Continue</Text>
            </TouchableOpacity>
        </View>

    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    inputField: {
        fontSize: 22,
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 30,
    },
    multilineInput: {
        fontSize: 22,
        marginBottom: 10,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        height: 150,
    },
    item: {
        fontSize: 22,
        marginBottom: 10,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 8,
        height: 150
    },
    salaryBox: {
        flex: 2,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        //padding: 8,
        //width: windowWidth / 3,
        height: 50,
        flexDirection: 'row',
        //margin: 10,
    },
    salaryInput: {
        flex: 2,
        fontSize: 22,
        //marginBottom: 30,
        borderRadius: 10,
        paddingRight: 10,
        paddingLeft: 5,
        //width: windowWidth / 3,
        textAlign: 'right'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    sectionTitleAsterisk: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
    },
    hourText: {
        fontSize: 20,
        alignSelf: 'center',
        includeFontPadding: false,
        paddingRight: 12,
    },
    employmentType: {
        fontSize: 20,
        borderLeftColor: 'white',
        borderLeftWidth: 2,
    },
    dollarText: {
        fontSize: 24,
        alignSelf: 'center',
        paddingLeft: 5,
        includeFontPadding: false,
    },
    container: {
        flex: 1,
        //somehow we found a secret way to add color to iOS keyboard
        backgroundColor: 'blue'
    },
    questionBox: {
      fontSize: 22,
      marginBottom: 10,
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderRadius: 10,
      padding: 8,
      height: 300
    },
    button: {
      alignItems: "center",
      padding: 10,
      width: 150
    },
    applicantScrollView: {
        height: 300,
        width: '90%',
        marginLeft: '5%',
        marginVertical: 20,
        borderRadius: 15,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'gray'
    },
    savePostingButtonStyle: {
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 125,
        marginHorizontal: 15,
        marginTop: 20,
    },
});
