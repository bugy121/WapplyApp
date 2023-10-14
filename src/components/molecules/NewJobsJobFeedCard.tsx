import * as React from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../Themed';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { Ionicons, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'
import { AppEventsLogger } from 'react-native-fbsdk-next';

// A reusable job post card component that shows on applicant homescreen
export default function NewJobsJobFeedCard({data}) {
    const navigation = useNavigation();

    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const posterData = postInfo.postingsToEmployer[data.id];

    const [shadowOffsetWidth, setShadowOffsetWidth] = useState(3);
    const [shadowOffsetHeight, setShadowOffsetHeight] = useState(3);
    const [shadowRadius, setShadowRadius] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.2);

    const goToApplicationsDetailView = () => {
        // const newViews = data.views + 1;
        // updateJobPostViews(data.id, newViews, (err) => {
        //   if (err != null) {
        //     console.log(err)
        //     Alert.alert("updating view count of job post failed, please try again")
        //     return
        //   } else {
        //     data.views = newViews;
        //     navigation.navigate("ApplicantJobDetailView", {
        //         data: data
        //     })
        //   }
        // });
        navigation.navigate("ApplicantJobDetailView", {
            data: data
        })
    }

    // let distance = 0;
    // if (data.data.location) {
    //     const lat = data.data.location.lat;
    //     const lng = data.data.location.lon;

    //     // console.log('lat and long:', lat, lng );
    //     // console.log('user lat and long: ', userLoc);
    //     distance = getDistance({lat, lng}, {latitude: userLoc[0], longitude: userLoc[1]}) / 1609;
    //     distance = Number(distance.toFixed(2));
    //     // console.log('distance: ', distance);
    // }

    // const fontsize = data.data.roleName.length > 20 ? 15 : 20;

    let address = '';
    if (posterData && !data.externalLink) {
        address = posterData.address.city + ", " + posterData.address.state.toUpperCase()
    } else {
        address = data.address.city + ", " + data.address.state;
    }

    const dateDiff = computeDateDiff(data.latestDateBumped);

    let postedDate = "";
    if (dateDiff == 0) {
        postedDate = "Today";
    } else if (dateDiff == 1) {
        postedDate = "1 day ago";
    } else {
        postedDate = Math.floor(dateDiff) + " days ago";
    }

    let link = "no image";
    const [logo, setLogo] = useState(link != "no image" ? {uri: link} : require('../../../assets/images/wapply-logo-gradient.png'));
    const [logoLoaded, setLogoLoaded] = useState(false);

    if (posterData) {
        link = posterData.profilePicUrl;
        if (link != 'no image' && !logoLoaded) {
            setLogoLoaded(true);
            setLogo({uri: link})
        } else if (!logoLoaded) {
            setLogoLoaded(true);
        }
    }

    let isRemote = false;
    if (data.isRemote) {
        isRemote = data.isRemote;
    }

    const longName = data.roleName.length > 10;
    const longBusiness = data.businessName.length > 15;

    return(
        <TouchableOpacity onPress={goToApplicationsDetailView}>
            { logoLoaded && <View style={[ longName ? styles.containerBig : styles.container, {
                shadowOffset: {
                width: shadowOffsetWidth,
                height: shadowOffsetHeight
                },
                shadowOpacity,
                shadowRadius
            }]}>
                <View style={ longName ? styles.headerBig : styles.header }>
                    <View style={styles.logoView}>
                        <FastImage
                            style={styles.logoImg}
                            source={logo}
                        />
                    </View>
                    <View style={styles.titleView}>
                        <Text
                          numberOfLines={2}
                          style={ longName ? styles.roleNameTextBig : styles.roleNameText }>
                            {data.roleName}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={ longBusiness ? styles.businessInfoTextBig : styles.businessInfoText }>
                            {data.businessName}
                        </Text>
                    </View>
                    {/* <View style={{backgroundColor: 'transparent'}}>
                        <TouchableOpacity style={styles.applyButton} onPress={goToApplicationsDetailView}>
                            <Text style={styles.applyButtonText}>
                                Apply
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                    {data.externalLink ? <TouchableOpacity style={styles.externalButton} onPress={goToApplicationsDetailView}>
                        <Text style={styles.externalButtonText}>
                            Apply
                        </Text>
                        <SimpleLineIcons name={'share-alt'} color={'white'} size={20} style={{marginLeft: 8}}/>
                    </TouchableOpacity> : 
                    <TouchableOpacity style={[styles.externalButton, {width: '22%'}]} onPress={goToApplicationsDetailView}>
                    <Text style={[styles.externalButtonText, {fontSize: 18}]}>
                        Apply
                    </Text>
                </TouchableOpacity> }
                </View>

                <View style={styles.locationView}>
                    <Ionicons name="location-sharp" size={22} color="#00c5cc" />
                    {!isRemote ? <Text style={styles.locationText}> 
                        {address}
                    </Text> : 
                    <Text style={styles.locationText}> 
                        Remote
                    </Text>}
                </View>

                <View style={styles.salaryView}>
                    <FontAwesome5 name="money-bill" size={18} color="#78a672" />
                    {data.salaryRangeLow !== data.salaryRangeHigh &&
                      <Text style={styles.salaryText}>
                        ${data.salaryRangeLow} - {data.salaryRangeHigh} per hour
                      </Text>}
                    {data.salaryRangeLow === data.salaryRangeHigh ? data.salaryRangeLow != 0 ?
                      <Text style={styles.salaryText}>
                        ${data.salaryRangeLow} per hour
                      </Text> : 
                      <Text style={styles.salaryText}>
                        Check for more details
                      </Text> : null}
                </View>

                <View style={styles.distanceView}>
                    <FontAwesome5 name="ruler-horizontal" size={18} color="#d1c021" />
                    {!isRemote ? <Text style={styles.distanceText}>
                        {data.distanceToApplicant} miles away
                    </Text> : <Text style={styles.distanceText}>
                        Remote
                    </Text>}
                </View>

                <View style={styles.jobTypeView}>
                    {data.isFulltime && <View style={styles.jobTypeTag}>
                        <Text style={styles.jobTypeText}>
                            Full time
                        </Text>
                    </View>}
                    {data.isParttime && <View style={styles.jobTypeTag}>
                        <Text style={styles.jobTypeText}>
                            Part time
                        </Text>
                    </View>}
                    {data.isInternship && <View style={styles.jobTypeTag}>
                        <Text style={styles.jobTypeText}>
                            Internship
                        </Text>
                    </View>}
                </View>

                <View style={styles.postedTimeView}>
                    <Text style={styles.postedTimeText}>
                        {postedDate} • From {address}
                    </Text>
                </View>
            </View>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 270,
        borderRadius: 15,
        marginVertical: '2%',
        marginLeft: '5%',
    },
    containerBig: {
        width: '90%',
        height: 300,
        borderRadius: 15,
        marginVertical: '2%',
        marginLeft: '5%',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        height: 100,
    },
    headerBig: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        height: 120,
    },
    logoView: {
        width: 100,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    logoImg: {
        width: 50,
        height: 50,
        borderRadius: 15,
    },
    titleView: {
        width: '46%',
        backgroundColor: 'transparent',
    },
    roleNameText: {
        fontSize: 21,
        fontWeight: '700',
        marginBottom: 3,
    },
    roleNameTextBig: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 3,
    },
    businessInfoText: {
        fontSize: 17,
    },
    businessInfoTextBig: {
        fontSize: 14,
    },
    applyButton: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        height: '40%',
        backgroundColor: '#52B9F9',
        borderRadius: 25,
        marginLeft: '2%'
    },
    applyButtonText: {
        color: 'white',
        fontWeight: "700",
        fontSize: 18,
    },
    externalButton: {
        width: '24%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40%',
        backgroundColor: '#52B9F9',
        flexDirection: 'row',
        borderRadius: 15,
    },
    externalButtonText: {
        color: 'white',
        fontWeight: "700",
        fontSize: 16,
    },
    locationView: {
        width: '90%',
        flexDirection: 'row',
        marginLeft: 25,
        marginTop: -5,
    },
    locationText: {
        fontSize: 16,
        marginLeft: 12,
    },
    salaryView: {
        height: '13%',
        flexDirection: 'row',
        borderRadius: 10,
        marginTop: 2,
        marginLeft: 25,
        alignItems: 'center',
    },
    salaryText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#454545'
    },
    distanceView: {
        height: '13%',
        flexDirection: 'row',
        borderRadius: 10,
        marginLeft: 25,
        alignItems: 'center',
        marginTop: -3,
    },
    distanceText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#454545'
    },
    jobTypeView: {
        height: '10%',
        marginLeft: 25,
        marginTop: 5,
        flexDirection: 'row',
    },
    jobTypeTag: {
        justifyContent: 'center',
        backgroundColor: '#ededed',
        borderRadius: 15,
        marginRight: 10,
    },
    jobTypeText: {
        fontSize: 15,
        marginHorizontal: 8,
    },
    otherDetailView: {
        width: '90%',
        flexDirection: 'row',
        marginLeft: '5%',
        backgroundColor: 'transparent',
    },
    otherDetailText: {
        fontSize: 16,
        marginLeft: '3%',
        marginRight: '5%',
    },
    postedTimeView: {
        width: '90%',
        height: '10%',
        marginLeft: 25,
        marginTop: 13,
        backgroundColor: 'transparent',
    },
    postedTimeText: {
        fontSize: 16,
        color: 'grey',
    },
})

export const computeDateDiff = (date) => {
    let today = Moment(Date()).format('MM/DD/YYYY');
    let formattedDate = Moment(date).format('MM/DD/YYYY')

    return Moment(today,"MM/DD/YYYY").diff(Moment(formattedDate,"MM/DD/YYYY")) / 86400 / 1000;
}
