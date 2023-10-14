import * as React from 'react';
import { useState, Component } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector } from 'react-redux';

import JobFeedCard from '../../../components/molecules/NewJobsJobFeedCard';
import { Button, Chip, List, TextInput } from 'react-native-paper';
import { changeSalaryRangeLow, changeSalaryRangeHigh, resetAllFilters, setFulltimeToggle, setParttimeToggle, setInternshipToggle, filterJobs } from '../../../store/ApplicantJobListFilterReducer';
import { ConsoleLogger } from '@aws-amplify/core';

export default function HomeScreenNearbyJobsSubview() {

    const dispatch = useDispatch()
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const jobFilterData = useSelector(state => state.applicantJobListFilterReducer);
    
    const jobList = postInfo.postingsInDistanceOrder;
    const filteredJobList = filterJobs(jobList, jobFilterData)
    // sort distance in asc order
    // jobList.sort((a, b) => (a.distanceToApplicant > b.distanceToApplicant) ? 1 : -1);
    const [salaryRangeLow, setSalaryRangeLow] = useState(jobFilterData.salaryRangeLow.toString())
    const [salaryRangeHigh, setSalaryRangeHigh] = useState(jobFilterData.salaryRangeHigh.toString())
    const [partTimeFiltered, setPartTimeFiltered] = useState(jobFilterData.partTimeToggled)
    const [fullTimeFiltered, setFullTimeFiltered] = useState(jobFilterData.fullTimeToggled)
    const [internshipFiltered, setInternshipFiltered] = useState(jobFilterData.internshipToggled)
    const [filterExpended, setFilterExpended] = useState(false)
    async function applyFilter() {
        await dispatch(changeSalaryRangeLow(salaryRangeLow.length == 0 ? "0" : salaryRangeLow))
        await dispatch(changeSalaryRangeHigh(salaryRangeHigh.length == 0 ? "999" : salaryRangeHigh))
        await dispatch(setFulltimeToggle(fullTimeFiltered))
        await dispatch(setParttimeToggle(partTimeFiltered))
        await dispatch(setInternshipToggle(internshipFiltered))
        setFilterExpended(false)
    }

    async function resetFilter() {
        await setFullTimeFiltered(true);
        await setPartTimeFiltered(true);
        await setInternshipFiltered(true);
        await dispatch(resetAllFilters()); 
    }

    const renderItem = ({item}) => {
        if (item.status == "DELETED" || item.status == "DEACTIVATED") {
            return 
        }
        return (
            <JobFeedCard data={item}/>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <List.Accordion 
                expanded={filterExpended}
                onPress={() => setFilterExpended(!filterExpended)}
                title="Job Filters" 
                style={{alignItems: 'center', justifyContent: 'center', alignContent:'center'}}
                titleStyle={{paddingLeft: 20, color: "gray"}}
            >
                <View style={{flexDirection: 'row', marginTop: 20, backgroundColor: 'transparent', justifyContent: 'space-evenly'}}>
                    <Chip selected={fullTimeFiltered} style={styles.chip} onPress={() => setFullTimeFiltered(!fullTimeFiltered)}>Full-time</Chip>
                    <Chip selected={partTimeFiltered} style={styles.chip} onPress={() => setPartTimeFiltered(!partTimeFiltered)} >Part-time</Chip>
                    <Chip selected={internshipFiltered} style={styles.chip} onPress={() => setInternshipFiltered(!internshipFiltered)} >Internship</Chip>
                </View>
                <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 20, marginBottom: 25, backgroundColor: 'transparent', justifyContent: 'space-evenly', alignItems: 'center', alignContent: 'center'}}>
                    <Text>Salary Range: </Text>
                    <TextInput label="Low" 
                        keyboardType='numeric' 
                        value={salaryRangeLow} 
                        onChangeText={setSalaryRangeLow} 
                        style={{width: '25%', height: 50}} />
                    <Text>to</Text>
                    <TextInput label="High" 
                        keyboardType='numeric' 
                        value={salaryRangeHigh} 
                        onChangeText={setSalaryRangeHigh} 
                        style={{width: '25%', height: 50}} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10}}>
                    <Button onPress={resetFilter} icon='close' labelStyle={{fontWeight: 'bold'}} mode="contained" color='red' style={{height: 55, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', borderRadius: 25}}>
                        Reset Filter
                    </Button>
                    <Button onPress={applyFilter} icon='check' labelStyle={{fontWeight: '600'}} mode="contained" color='blue' style={{height: 55, alignSelf: 'center', paddingHorizontal: 15, alignContent: 'center', justifyContent: 'center', borderRadius: 25}}>
                        Apply
                    </Button>
                </View>
                
            </List.Accordion>

            
            <ScrollView style={styles.container}>
                { filteredJobList && <FlatList style={styles.listContainer}
                        data={filteredJobList}
                        renderItem={renderItem}
                    /> }

                { !filteredJobList && 
                    <Text> There are no new jobs available! </Text>
                    }
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
    },
    overlayView: {
        width: '100%',
        height: '100%',
        marginTop: '50%',
        // justifyContent: 'center',
        // alignItems: 'center',
        position: 'absolute',
        opacity: 0.7,
        backgroundColor: 'transparent',
    },
    chip: {
        height: 40
    }
})
