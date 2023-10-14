import * as React from 'react';
import { useState, Component } from 'react';
import { StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector } from 'react-redux';

import JobPostingRow from '../components/molecules/JobPostingRow';
import { getDistance } from 'geolib'
import { fetchApplicantProfileDataAPI } from '../../../apiService/firestoreApis/ApplicantProfileDataApi';
import { getJobPostInRange, getAppliedJobPostAPI, getApplicationforAppliedJobPostAPI } from '../../../apiService/firestoreApis/ApplicantJobPostApi';
import { bulkAddNewJobPosting, changePostingsLoaded } from '../../../store/EmployerJobListingReducer';
import { addNewAppliedJobPosting, addAppliedJobApplication,  } from '../../../store/ApplicantAppliedJobPostingReducer';
import { RotationGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreenNearbyJobsSubview() {

    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(0);
    const [shadowRadius, setShadowRadius] = useState(8);
    const [shadowOpacity, setShadowOpacity] = useState(0.2);

    const dispatch = useDispatch();
    const postInfo = useSelector(state => state.employerJobListingReducer);
    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const jobList = postInfo.postings;

    const [jobListLoading, setJobListLoading] = useState(false);
    const [appliedJobsLoading, setAppliedJobsLoading] = useState(false);

    const getPostData = () => { fetchApplicantProfileDataAPI(userInfo.id, async (data) => {
        // console.log('applicant info: ', userInfo);
        const lat = await userInfo.latitude;
        const lng = await userInfo.longitude;

        // fetch all job posts
        let list = [];
        await getJobPostInRange([data.latitude, data.longitude], (post) => {
            setJobListLoading(true);
            for (let k of post) {
                let distance = getDistance({lat, lng}, {latitude: k.post.location.lat, longitude: k.post.location.lon}) / 1609;
                distance = Number(distance.toFixed(2));

                k.post.distanceToApplicant = distance;
                list.push(k.post);
            }

            // sort in asc order
            list.sort((a, b) => (a.distanceToApplicant > b.distanceToApplicant) ? 1 : -1);
            setJobListLoading(false);
        })

        dispatch(bulkAddNewJobPosting(list));
        dispatch(changePostingsLoaded(true));

    })};

    React.useEffect(() => {
        if (jobList.length == 0) {
            getPostData();
        }
    }, []);

    const renderItem = ({item}) => {
        if (item.status == "DELETED" || item.status == "DEACTIVATED") {
            return 
        }
        return (
            <JobPostingRow data={item}/>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                <Text style={styles.date}>
                    SATURDAY, NOVEMBER 16
                </Text>
                <Text style={styles.featuredText}>
                    Featured
                </Text>
            </SafeAreaView>

            <View style={[styles.content, {
                shadowOffset: {
                width: shadowOffsetWidth,
                height: shadowOffsetHeight
                },
                shadowOpacity,
                shadowRadius
            }]}>
                <View style={[styles.title, {backgroundColor: '#ff7575',}]}>
                    <TouchableOpacity>
                        <Text style={styles.titleText}>
                            NEW JOBS
                        </Text>
                    </TouchableOpacity>

                </View>
                <View>
                {jobListLoading && <ActivityIndicator size="large"/>}
                </View>
                { !jobListLoading && jobList ? <FlatList style={styles.listContainer}
                    data={jobList}
                    renderItem={renderItem}
                /> : <Text> You don't have any applied Jobs! </Text> }
            </View>

            <View style={[styles.content, {
                shadowOffset: {
                width: shadowOffsetWidth,
                height: shadowOffsetHeight
                },
                shadowOpacity,
                shadowRadius
            }]}>
                <View style={[styles.title, {backgroundColor: '#4ce074',}]}>
                    <Text style={styles.titleText}>
                        NEAR ME
                    </Text>
                </View>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        backgroundColor: 'white',
        marginBottom: 40,
        marginLeft: '5%',
        width: '90%',
        borderRadius: 15,
    },
    date: {
        fontSize: 14,
        marginTop: 30,
        marginBottom: 10,
        marginHorizontal: 32,
        fontWeight: '300',
        fontFamily: 'Verdana',
        color: 'gray',
    },
    featuredText: {
        fontSize: 30,
        marginBottom: 20,
        marginHorizontal: 30,
        fontWeight: '500',
        fontFamily: 'Verdana',
    },
    title: {
        height: 40,
        width: 110,
        marginTop: '6%',
        marginLeft: '8%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Verdana',
        color: 'white',

    },
    listContainer: {

    }
})
