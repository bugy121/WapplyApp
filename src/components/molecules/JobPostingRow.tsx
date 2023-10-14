import * as React from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { useNavigation } from '@react-navigation/core';
import { geohashQueryBounds, geohashForLocation } from 'geofire-common'
import { getDistance } from 'geolib'
import { useSelector } from 'react-redux';
import { updateJobPostViews} from '../../apiService/firestoreApis/ApplicantJobPostApi';

const img = require('../../../assets/images/blankbg.png');

export default function JobPostingRow(data) {
    const navigation = useNavigation();

    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const userLoc = [userInfo.latitude, userInfo.longitude];

    const goToApplicationsDetailView = () => {
        // const newViews = data.data.views + 1;
        // updateJobPostViews(data.data.id, newViews, (err) => {
        //   if (err != null) {
        //     console.log(err)
        //     Alert.alert("updating view count of job post failed, please try again")
        //     return
        //   } else {
        //     data.data.views = newViews;
        //     navigation.navigate("ApplicantJobDetailView", {
        //         data: data.data
        //     })
        //   }
        // });
        navigation.navigate("ApplicantJobDetailView", {
            data: data.data
        })
    }

    let distance = 0;
    if (data.data.location) {
        const lat = data.data.location.lat;
        const lng = data.data.location.lon;

        distance = getDistance({lat, lng}, {latitude: userLoc[0], longitude: userLoc[1]}) / 1609;
        distance = Number(distance.toFixed(2));
    }

    const fontsize = data.data.roleName.length > 20 ? 15 : 20;

    return(
        <TouchableOpacity onPress={goToApplicationsDetailView}>
            <View style={[styles.container]}>
                <ImageBackground
                    source={img}
                    resizeMode="cover"
                    style={styles.image}
                    imageStyle={{ borderRadius: 15}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex: 2}}>
                            <Text style={[styles.title, {fontSize: fontsize, flexWrap: 'wrap'}]}>{data.data.roleName} </Text>
                            <Text style={styles.locationText}>{'at ' + data.data.businessName} </Text>
                        </View>
                        <View style={{justifyContent: 'space-between', flex: 1, alignItems: 'center'}}>
                            <TouchableOpacity style={styles.viewButton} onPress={goToApplicationsDetailView}>
                                <Text style={styles.viewButtonText}> View </Text>
                            </TouchableOpacity>
                            <Text style={styles.distanceText}>{distance + ' miles away'} </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    title: {
        marginBottom: 8,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        width: 150
    },
    locationText: {
        fontSize: 18,
    },
    distanceText: {
        marginTop: 5,
        fontSize: 14,
        color: 'grey',
    },
    viewButton: {
        height: 30,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#52B9F9',
        borderRadius: 25,
    },
    viewButtonText: {
        color: 'white',
        fontWeight: "700",
        fontSize: 18,
    },
    image: {
        flex: 1,
        borderRadius: 15,
        padding: 20,
    },
})
