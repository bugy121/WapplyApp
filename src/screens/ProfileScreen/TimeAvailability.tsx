import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { List } from 'react-native-paper';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/core';
import { FAB } from 'react-native-paper';
import { updateApplicantAvailabilityAPI } from '../../apiService/firestoreApis/ApplicantProfileDataApi';
import { useSelector, useDispatch } from 'react-redux';
import { updateApplicantProfileData } from '../../store/ApplicantProfileReducer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const img = require("../../../assets/images/calendar.png");

export default function TimeAvailability () {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    var applicantProfileData = useSelector(state => state.applicantProfileReducer).profileData;
    console.log('applicant availability: ', applicantProfileData.availability)

    var mondayRange = [['00','1','1','00','1','1']];
    var tuesdayRange = [['00','1','1','00','1','1']];
    var wednesdayRange = [['00','1','1','00','1','1']];
    var thursdayRange = [['00','1','1','00','1','1']];
    var fridayRange = [['00','1','1','00','1','1']];
    var saturdayRange = [['00','1','1','00','1','1']];
    var sundayRange = [['00','1','1','00','1','1']];

    const appendRange = ['00','1','1','00','1','1']

    // var mondayRange = [[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]];
    // var tuesdayRange = [[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]];
    // var wednesdayRange = [[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]];
    // var thursdayRange = [[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]];
    // var fridayRange = [[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]];
    // var saturdayRange = [[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]];

    // const mondayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    // const tuesdayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    // const wednesdayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    // const thursdayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    // const fridayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    // const saturdayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    // const sundayRange = useState([[useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]])[0]
    
    // const appendRange = [useState("00"), useState("1"), useState("1"), useState("00"), useState("1"), useState("1")]

    const days = [
        {
            name: 'monday',
            range: mondayRange,
            enable: false,
        },
        {
            name: 'tuesday',
            range: tuesdayRange,
            enable: false,
        },
        {
            name: 'wednesday',
            range: wednesdayRange,
            enable: false,
        },
        {
            name: 'thursday',
            range: thursdayRange,
            enable: false,
        },
        {
            name: 'friday',
            range: fridayRange,
            enable: false,
        },
        {
            name: 'saturday',
            range: saturdayRange,
            enable: false,
        },
        {
            name: 'sunday',
            range: sundayRange,
            enable: false,
        },
        
    ]

    const availabilityToRange = () => {
        for (let item of days) {
            if (applicantProfileData.availability[item.name].length != 0) {
                item.range = [];
                item.enable = true;
                for (let range of applicantProfileData.availability[item.name]) {
                    const rangeList = range.split(' - ');
                    const fromTime = rangeList[0].split(':');
                    const toTime = rangeList[1].split(':');
                    // console.log('from time: ', fromTime, 'to time: ', toTime);
    
                    // item.range.push([useState(fromTime[0]), useState(fromTime[1].substring(0, 2) == '00' ? '1' : '2'), useState(fromTime[1].substring(2) == 'AM' ? '1' : '2'), 
                    // useState(toTime[0]), useState(toTime[1].substring(0, 2) == '00' ? '1' : '2'), useState(toTime[1].substring(2) == 'AM' ? '1' : '2')])

                    item.range.push([fromTime[0], fromTime[1].substring(0, 2) == '00' ? '1' : '2', fromTime[1].substring(2) == 'AM' ? '1' : '2', 
                    toTime[0], toTime[1].substring(0, 2) == '00' ? '1' : '2', toTime[1].substring(2) == 'AM' ? '1' : '2'])
                }
            } 
            // else {
            //     // item.range = ;
            //     console.log('item.range: ', item.range[0][0])
            // }
        }
    }

    if (applicantProfileData.availability) {
        availabilityToRange();
    }

    const [mondayRanges, setMondayRanges] = useState(days[0].range);
    const [tuesdayRanges, setTuesdayRanges] = useState(days[1].range);
    const [wednesdayRanges, setWednesdayRanges] = useState(days[2].range);
    const [thursdayRanges, setThursdayRanges] = useState(days[3].range);
    const [fridayRanges, setFridayRanges] = useState(days[4].range);
    const [saturdayRanges, setSaturdayRanges] = useState(days[5].range);
    const [sundayRanges, setSundayRanges] = useState(days[6].range);

    // var mondayRanges = days[0].range;
    // var tuesdayRanges = days[1].range;
    // var wednesdayRanges = days[2].range;
    // var thursdayRanges = days[3].range;
    // var fridayRanges = days[4].range;
    // var saturdayRanges = days[5].range;
    // var sundayRanges = days[6].range;

    const mondayEnabled = useState(days[0].enable);
    const tuesdayEnabled = useState(days[1].enable);
    const wednesdayEnabled = useState(days[2].enable);
    const thursdayEnabled = useState(days[3].enable); 
    const fridayEnabled = useState(days[4].enable);
    const saturdayEnabled = useState(days[5].enable);
    const sundayEnabled = useState(days[6].enable);

    const computeHours = (range) => {
        let workTime = 0;
        for (let r of range) {
            let fromHour;
            if (parseInt(r[0])) {
                if (parseInt(r[0]) == 12 && parseInt(r[2]) == 2) {
                    fromHour = 0;
                } else {
                    fromHour = parseInt(r[0]);
                }
            } else {
                fromHour = 0;
            }

            let toHour;
            if (parseInt(r[3])) {
                if (parseInt(r[3]) == 12 && parseInt(r[5]) == 2) {
                    toHour = 0;
                } else {
                    toHour = parseInt(r[3]);
                }
            } else {
                toHour = 0;
            }

            let from = fromHour + 0.5 * (parseInt(r[1]) - 1) + 12 * (parseInt(r[2]) - 1);
            let to = toHour + 0.5 * (parseInt(r[4]) - 1) + 12 * (parseInt(r[5]) - 1);
            let total = to - from;

            if (total < 0) {
                total = 24 + total;
            }

            workTime += total;
        }

        return workTime;
    }

    const weeklyHours = (mondayEnabled[0] ? computeHours(mondayRanges) : 0) + (tuesdayEnabled[0] ? computeHours(tuesdayRanges) : 0) + 
    (wednesdayEnabled[0] ? computeHours(wednesdayRanges) : 0) + (thursdayEnabled[0] ? computeHours(thursdayRanges) : 0) +
    (fridayEnabled[0] ? computeHours(fridayRanges) : 0) + (saturdayEnabled[0] ? computeHours(saturdayRanges) : 0 ) + 
    (sundayEnabled[0] ? computeHours(sundayRanges) : 0)

    const timeRanges = [
        { name: "Monday", ranges: mondayRanges, enabled: mondayEnabled },
        { name: "Tuesday", ranges: tuesdayRanges, enabled: tuesdayEnabled },
        { name: "Wednesday", ranges: wednesdayRanges, enabled: wednesdayEnabled },
        { name: "Thursday", ranges: thursdayRanges, enabled: thursdayEnabled },
        { name: "Friday", ranges: fridayRanges, enabled: fridayEnabled },
        { name: "Saturday", ranges: saturdayRanges, enabled: saturdayEnabled },
        { name: "Sunday", ranges: sundayRanges, enabled: sundayEnabled },
    ]

    const data = [
        { label: 'AM', value: '1' },
        { label: 'PM', value: '2' },
    ];

    const timeData = [
        { label: '00', value: '1' },
        { label: '30', value: '2' },
    ];

    const [dataChange, setDataChange] = useState(false);
    const createNewTimeSlot = (day) => {
        timeRanges[day].ranges.push(appendRange);
        setDataChange(!dataChange);
    }

    const removeTimeSlot = (index) => {
        timeRanges[index].ranges.pop();
        setDataChange(!dataChange);
    }

    const renderMultipleTimeSlot = ({item, index}) => {

        const range = item;
        const timeIndex = item[1];
        console.log('range: ', range);
        console.log('range[0]: ', range[0]);

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}> 
            <View style={{marginBottom: 20}}>
            <View style={styles.timeRangeView}> 
                <TextInput
                    style={[{fontSize: 20, height: 50, borderWidth: 1, width: 60, borderRadius: 10, textAlign: 'center', }]}
                    value={range[0]}
                    onChangeText={(val) => {
                        if (parseInt(val) > 12) {
                            range[0] = '12';
                        } else {
                            range[0] = val; 
                        }
                        setDataChange(!dataChange);
                    }}
                    maxLength={2}
                    placeholder="00"
                    keyboardType="numeric"
                />
                <Text style={{fontSize: 16}}>  :  </Text>
                <Dropdown
                    style={[styles.dropdown, {marginLeft: 0}]}
                    placeholderStyle={{fontSize: 20}}
                    selectedTextStyle={[{fontSize: 20}]}
                    data={timeData}
                    maxHeight={120}
                    value={range[1]}
                    labelField="label"
                    valueField="value"
                    placeholder='00'
                    onChange={val => {
                        range[1] = val.value;
                    }}
                />
                <Dropdown
                    style={[styles.dropdown]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={[styles.selectedTextStyle]}
                    data={data}
                    maxHeight={120}
                    value={range[2]}
                    labelField="label"
                    valueField="value"
                    placeholder='AM'
                    onChange={val => {
                        range[2] = val.value;
                    }}
                />
            </View>
            <View style={styles.timeRangeView}> 
                <TextInput
                    style={[{fontSize: 20, height: 50, borderWidth: 1, width: 60, borderRadius: 10, textAlign: 'center', }]}
                    value={range[3]}
                    onChangeText={(val) => {
                        if (parseInt(val) > 12) {
                            range[3] = '12';
                        } else {
                            range[3] = val; 
                        }
                        setDataChange(!dataChange);
                    }}
                    maxLength={2}
                    placeholder="00"
                    keyboardType="numeric"
                />
                <Text style={{fontSize: 16}}>  :  </Text>
                <Dropdown
                    style={[styles.dropdown, {marginLeft: 0}]}
                    placeholderStyle={{fontSize: 20}}
                    selectedTextStyle={[{fontSize: 20}]}
                    data={timeData}
                    maxHeight={120}
                    value={range[4]}
                    labelField="label"
                    valueField="value"
                    placeholder='00'
                    onChange={val => {
                        range[4] = val.value;
                    }}
                />
                <Dropdown
                    style={[styles.dropdown]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={[styles.selectedTextStyle]}
                    data={data}
                    maxHeight={120}
                    value={range[5]}
                    labelField="label"
                    valueField="value"
                    placeholder='AM'
                    onChange={val => {
                        range[5] = val.value;
                    }}
                />
            </View>
            </View>
            {/* {index > 0 ? 
            <TouchableOpacity onPress={() => removeTimeSlot(timeIndex, index)}> 
                <Text style={styles.addTimeSlotButton}> delete </Text> 
            </TouchableOpacity>
            : null} */}
            </View>
        )
    }

    const renderItem = ({item, index}) => {

        const workTime = computeHours(item.ranges);
        console.log('item ranges: ', item.ranges);

        return (
            <View style={styles.checkboxView}> 
                <CheckBox
                    disabled={false}
                    value={item.enabled[0]}
                    onValueChange={item.enabled[1]}
                    style={{marginHorizontal: 5, width: 40, height: 40, marginTop: 15,}}
                />
                <View style={styles.timeRangeView}> 
                    <List.Accordion
                        title={item.name}
                        style={{width: windowWidth* 0.7}}
                        titleStyle={{borderRadius: 25, fontSize: 18, color: 'black'}}>
                        <View style={styles.timeRangeView}> 
                            <Text style={{fontSize: 16}}>
                                Total hours: {workTime}
                            </Text> 
                        </View>

                        <FlatList
                            data={item.ranges}
                            renderItem={renderMultipleTimeSlot}
                        />

                        {item.ranges.length > 1 && <TouchableOpacity onPress={() => removeTimeSlot(index)}> 
                            <Text style={styles.removeTimeSlotButton}> - Delete Time Slot </Text> 
                        </TouchableOpacity>}

                        <TouchableOpacity onPress={() => createNewTimeSlot(index)}> 
                            <Text style={styles.addTimeSlotButton}> + Add Time Slot </Text>
                        </TouchableOpacity>
                    </List.Accordion>
                </View>
            </View>
            
        )
    }

    const rangeToAvailability = () => {
        let mondayTime:string[] = [];
        if (mondayEnabled[0] && computeHours(mondayRanges) != 0) {
            for (let range of mondayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                mondayTime.push(timePeriod);
            }
        }
        
        let tuesdayTime:string[] = [];
        if (tuesdayEnabled[0] && computeHours(tuesdayRanges) != 0) {
            for (let range of tuesdayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                tuesdayTime.push(timePeriod);
            }
        }
        
        let wednesdayTime:string[] = [];
        if (wednesdayEnabled[0] && computeHours(wednesdayRanges) != 0) {
            for (let range of wednesdayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                wednesdayTime.push(timePeriod);
            }
            
        }

        let thursdayTime:string[] = [];
        if (thursdayEnabled[0] && computeHours(thursdayRanges) != 0) {
            for (let range of thursdayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                thursdayTime.push(timePeriod);
            }
        }

        let fridayTime:string[] = [];
        if (fridayEnabled[0] && computeHours(fridayRanges) != 0) {
            for (let range of fridayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                fridayTime.push(timePeriod);
            }
        }
        
        let saturdayTime:string[] = [];
        if (saturdayEnabled[0] && computeHours(saturdayRanges) != 0) {
            for (let range of saturdayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                saturdayTime.push(timePeriod);
            }
        }
        
        let sundayTime:string[] = [];
        if (sundayEnabled[0] && computeHours(sundayRanges) != 0) {
            for (let range of sundayRanges) {
                let timePeriod = range[0] + ":" + (range[1] == "1" ? "00" : "30") + (range[2] == "1" ? "AM" : "PM")
                + " - " + range[3] + ":" + (range[4] == "1" ? "00" : "30") + (range[5] == "1" ? "AM" : "PM")
                sundayTime.push(timePeriod);
            }
        }
        
        let availaObject = {
            monday: mondayTime,
            tuesday: tuesdayTime,
            wednesday: wednesdayTime,
            thursday: thursdayTime,
            friday: fridayTime,
            saturday: saturdayTime,
            sunday: sundayTime,
        }
        console.log('availbobject: ', availaObject);
        return availaObject;
    }

    const [saving, setSaving] = useState(false);
    const [saveAvailabilityLoading, setSaveAvailabilityLoading] = useState(false);

    const saveTimeAvailability = async () => {
        setSaving(true);
        const availabilityObj = await rangeToAvailability();
        await updateApplicantAvailabilityAPI(applicantProfileData.id, availabilityObj);

        // update reducer
        applicantProfileData.availability = availabilityObj;
        await dispatch(updateApplicantProfileData(applicantProfileData))
        
        setSaving(false);
        Alert.alert("Update time availability succesfully!");
        navigation.navigate('Profile');
    }

    return (
        <SafeAreaView style={{backgroundColor: 'white'}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="black" style={{padding: 5, marginLeft: 10}} />
                    </TouchableOpacity>

                    
                </View>
                
                {/* <View style={styles.modeView}>
                    <TouchableOpacity style={styles.modeButton}>
                        <Text style={styles.modeText}>
                            Everyday
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modeButton}>
                        <Text style={styles.modeText}>
                            Weekdays/Weekend
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modeButton}>
                        <Text style={styles.modeText}>
                            Custom
                        </Text>
                    </TouchableOpacity>
                </View> */}

                <ScrollView> 
                <View style={styles.calendarView}>
                    <Image style={{height: windowWidth* 0.6, width: windowWidth* 0.8}} source={img}/>

                    <Text style={{fontSize: 20, marginBottom: 10,}}> 
                        Weekly hours: {weeklyHours}
                    </Text>

                    <FlatList
                    data={timeRanges}
                    renderItem={renderItem}/>
                </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
        <FAB 
            style={styles.editFab}
            color={'black'}
            icon={saving ? "check" : "check"}
            label={saving ? "Save" : "Save"}
            onPress={saveTimeAvailability}
            loading={saveAvailabilityLoading}
        />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
        height: '100%',
        backgroundColor: 'white'
    },
    calendarView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeView: {
        height: '7%',
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modeButton: {
        borderWidth: 1,
        borderRadius: 25,
        padding: 10,
    },
    modeButtonSelected: {
        borderWidth: 1,
        borderRadius: 25,
        padding: 10,
    },
    modeText: {
        fontSize: 16,
    },
    modeTextSelected: {
        fontSize: 16,
    },
    accordionView: {
        height: '7%',
        backgroundColor: 'white',
        zIndex: 2,
    },
    availabilityView: {
        height: 1000,
        marginTop: '10%',
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'black'
    },
    checkboxView: {
        flexDirection: 'row', 
        justifyContent: 'center', 
    },
    timeRangeView: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '3%',
    },
    timeBox: {
        width: windowWidth * 0.45,
        height: windowWidth * 0.3,
        backgroundColor: 'blue',
        marginVertical: 5,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        marginLeft: 10,
        width: 65,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        height: 50,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    editFab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 40,
        backgroundColor: 'white'
    },
    addTimeSlotButton: { 
        fontSize: 18,
        marginVertical: 15,
        fontWeight: 'bold',
    },
    removeTimeSlotButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red'
    },
})