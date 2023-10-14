import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteLinkPostAPI, deactivateLinkPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { deleteLinkPosting } from '../../../store/EmployerJobListingReducer';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Colors, Button } from 'react-native-paper';
import { bumpLinkPostAPI } from '../../../apiService/firestoreApis/EmployerJobPostApi';
import { bumpJobPosting } from '../../../store/EmployerJobListingReducer';
import BeautyWebView from 'react-native-beauty-webview'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LinkPostDetailView({route}) {
    const linkPostData = route.params.data

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [bumpPostLoading, setBumpPostLoading] = useState(false);

    let full = linkPostData.isFulltime ? 1 : 0;
    let part = linkPostData.isParttime ? 1 : 0;
    let intern = linkPostData.isInternship ? 1 : 0;

    let jobType = '';
    if (full&&part&&intern) {
        jobType = 'Full-time / Part-time / Internship'
    } else if (full&&part) {
        jobType = 'Full-time / Part-time'
    } else if (full&&intern) {
        jobType = 'Full-time / Internship'
    } else if (part&&intern) {
        jobType = 'Part-time / Internship'
    } else if (full) {
        jobType = 'Full-time'
    } else if (part) {
        jobType = 'Part-time'
    } else if (intern) {
        jobType = 'Internship'
    }

    const goBackToPrevScreen = () => {
        navigation.goBack()
    }

    const deactivatePost = () => {
        linkPostData.status = "DEACTIVATED"
        deactivateLinkPostAPI(linkPostData, (err: string) => {
            if (err != null) {
                Alert.alert("Deactivate link post failed!")
            } else {
                Alert.alert("Deactivate link post successful!")
            }
        })
    }

    const deletePost = () => {
        linkPostData.status = "DELETED"
        deleteLinkPostAPI(linkPostData, (err: string) => {
            if (err != null) {
                Alert.alert("Delete link post failed!")
            } else {
                dispatch(deleteLinkPosting(linkPostData.id))
                Alert.alert("Delete link post successful!")
                navigation.navigate('Root');
            }
        })
    }

    const deactivatePostTapped = () => {
        Alert.alert(
            "Deactivate Post",
            "Are you sure? Currently deactivated posts cannot be activated again but post information can be still viewed for reference (Applicants can no longer find this after deactivating)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: deactivatePost,
                    style: 'default'
                }
            ]
        )
    }

    const deletePostButtonTapped = () => {
        Alert.alert(
            "Delete Job Post",
            "Are you sure? (Neither you nor applicants will be able to see this post after)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: deletePost,
                    style: 'destructive'
                }
            ]
        )
    }

    function bumpPostPressed() {
        setBumpPostLoading(true)
        const bumpedDate = Date()
        bumpLinkPostAPI(linkPostData.id, bumpedDate, (err) => {
            setBumpPostLoading(false)

            if (err != null) {
                Alert.alert("Bump job post failed :(")
                return
            }
            Alert.alert("Successfully bumped/updated job post! This post is now fresh for applicants 🎉")
            // dispatch(bumpJobPosting(linkPostData.id, bumpedDate))
        }) 
    }

    console.log('post data: ', linkPostData);
    let creationDate = linkPostData.datePosted.split(" ")[1] + " " + linkPostData.datePosted.split(" ")[2] +
            ", " + linkPostData.datePosted.split(" ")[3]
    let latestDateBumped = linkPostData.latestDateBumped.split(" ")[1] + " " + linkPostData.latestDateBumped.split(" ")[2] +
    ", " + linkPostData.latestDateBumped.split(" ")[3]

    const [visible, setVisible] = useState(false);
    const applyExternalJobTapped = () => {
        setVisible(true);
    }

    let address = '';
    if (linkPostData) {
        address = linkPostData.address.streetAddr + ', ' + linkPostData.address.city + ", " + linkPostData.address.state.toUpperCase()
    }

    return(
        <ScrollView style={{marginTop: 60, marginBottom: 50,}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20}}>
                <TouchableOpacity
                    onPress={goBackToPrevScreen}
                    style={{paddingLeft: 15, marginBottom: 10}}
                >
                    <Ionicons name="chevron-back" size={22} color="black" />
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    {(linkPostData.status == "ACTIVE") &&
                        <TouchableOpacity onPress={deactivatePostTapped}>
                            <Text style={{fontSize: 20, color: 'orange', paddingRight: 40}}>Deactivate</Text>
                        </TouchableOpacity>}
                    <TouchableOpacity onPress={deletePostButtonTapped}>
                        <Text style={{fontSize: 20, color: 'red'}}>Delete</Text>
                    </TouchableOpacity>
                </View>

            </View>


            <View style={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '65%', paddingRight: 5}}>
                    <Text style={styles.title}>{linkPostData.roleName}</Text>
                    <Text style={styles.content}>Posted On: {creationDate}</Text>
                    <Text style={styles.content}>Latest Bump: {latestDateBumped}</Text>
                    <Text style={styles.content}>Post Status: <Text style={{fontWeight: 'bold'}}>{linkPostData.status == "ACTIVE" ? "Active" : "Deactived"}</Text></Text>
                </View>
                <Button color={Colors.green500} labelStyle={{fontSize: 18, color: 'white'}} onPress={bumpPostPressed} mode='contained' loading={bumpPostLoading} style={{borderRadius:25, height: 40, width: '35%', justifyContent: 'center'}} >
                    Bump
                </Button>
            </View>
            <View style={{height: '90%'}}>
                <View style={styles.locationView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Location
                    </Text>
                    <Text style={styles.detailText}>{linkPostData.businessName}</Text>
                    <Text style={styles.detailText}>{address}</Text>
                </View>
                <View style={styles.salaryView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Job Type
                    </Text>
                    <Text style={styles.detailText}> {jobType} </Text>
                </View>
                <View style={styles.salaryView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Salary Range
                    </Text>
                    {linkPostData.salaryRangeLow != 0 && linkPostData.salaryRangeHigh != 0 ? <Text style={styles.detailText}>$ {linkPostData.salaryRangeLow} - $ {linkPostData.salaryRangeHigh} Hourly</Text> :
                    <Text style={styles.detailText}> To be determined </Text>}
                </View>
                <View style={styles.salaryView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Work Hours / Week
                    </Text>
                    {linkPostData.workHourLow != 0 && linkPostData.workHourHigh != 0 ? <Text style={styles.detailText}>{linkPostData.workHourLow} - {linkPostData.workHourHigh}  Hours</Text> :
                    <Text style={styles.detailText}> To be determined </Text>}
                </View>
                <ScrollView style={styles.detailView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        Job Description
                    </Text>
                    <Text style={styles.detailText}>
                        {linkPostData.roleDescription}
                    </Text>
                </ScrollView>

                <View style={styles.linkView}>
                    <Text style={{fontSize: 22, marginVertical: 10, marginLeft: 15, fontWeight: 'bold'}}>
                        External Link
                    </Text>
                    <TouchableOpacity
                    onPress={applyExternalJobTapped}>
                        <Text style={[styles.detailText, {color: 'blue'}]}>
                            {linkPostData.externalLink}
                        </Text>
                    </TouchableOpacity>

                    <BeautyWebView
                        visible={visible} // Required for open and close
                        onPressClose={() => setVisible(false)} // Required for closing the modal
                        url={linkPostData.externalLink}
                    />
                </View>
                
            </View>
        </ScrollView>
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
        fontSize: 26,
        marginBottom: 8,
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    content: {
        fontSize: 16,
        marginBottom: 5
    },
    image: {
        flex: 1,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    employmentType: {
        fontSize: 22,
        borderLeftColor: 'white',
        borderLeftWidth: 2,
    },
    salaryView: {
        width: '90%',
        height: 90,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
    detailView: {
        width: '90%',
        height: 200,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignSelf: 'flex-start'
    },
    detailText: {
        fontSize: 20, 
        marginBottom: 10, 
        marginLeft: 15,
    },
    linkView: {
        width: '90%',
        height: 200,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 100,
    },
    applicantScrollView: {
        width: '90%',
        marginLeft: '5%',
        borderRadius: 15,
        paddingLeft: 20, 
        paddingRight: 20, 
        backgroundColor: 'white'
    },
    deleteButton: {
        width: '80%',
        height: 80,
        marginTop: 40,
        marginBottom: 40,
        marginLeft: '10%',
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 32,
        color: 'red',
        fontFamily: 'AcherusGrotesque-Bold',
    },
    viewAppButton: {
        height: 50,
        width: 140,
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#52B9F9',
        borderRadius: 25,
    },
    viewAppText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '700',
    },
    locationView: {
        width: '90%',
        height: 120,
        marginTop: 15,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
})