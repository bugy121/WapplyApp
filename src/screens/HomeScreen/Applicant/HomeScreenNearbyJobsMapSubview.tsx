import * as React from 'react';
import { useState, Component, useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Button, Image } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import MapView, { Marker, Callout} from 'react-native-maps';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function HomeScreenNearbyJobsMapSubview() {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const postInfo = useSelector(state => state.applicantJobListingReducer);
    const userInfo = useSelector(state => state.applicantProfileReducer).profileData;
    const jobFilterData = useSelector(state => state.applicantJobListFilterReducer);

    var coords = [];
    postInfo.postings.map((post) => {
        // coords.push({location: {latitude: post.location.lat, longitude: post.location.lon}});
        if (!(post.status == "DELETED") && !(post.status == "DEACTIVATED")) {
            coords.push(post);
        }
    })

    var linkCoords = [];
    postInfo.linkPostings.map((post) => {
        if (!(post.status == "DELETED") && !(post.status == "DEACTIVATED")) {
            linkCoords.push(post);
        }
    })

    // useEffect(() => {
    //     postInfo.postings.map((post) => {
    //         coords.push({location: {latitude: post.location.lat, longitude: post.location.lon}});
    //     })

    //     // coords.map((marker) => {
    //     //     console.log('coordinates: ', marker);
    //     // })
    // })

    let link = "no image";
    const [logo, setLogo] = useState(link != "no image" ? {uri: link} : require('../../../../assets/images/wapply-logo-gradient.png'));
    const [logoLoaded, setLogoLoaded] = useState(false);

    const goToPostingDetailView = (postData) => {
        navigation.navigate("ApplicantJobDetailView", {
            data: postData
        })
    }

    const [followUser, setFollowUser] = useState(true);
    const [marginBottom, setMarginBottom] = useState(1);
    
    React.useEffect(() => {
        setTimeout(
            function() {
                setMarginBottom(0);
                setFollowUser(false);
            },
            3000
          );

    }, []);


    return (
        <View style={styles.container}>
            <MapView
                initialRegion={{
                    latitude: userInfo.latitude,
                    longitude: userInfo.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
                style={[styles.map, {marginBottom: marginBottom}]}
                showsMyLocationButton={true}
                showsUserLocation={true} // this
                followsUserLocation={followUser}
                showsCompass={true}
            >
                <Marker
                    coordinate={{latitude: userInfo.latitude, longitude: userInfo.longitude}}
                    title={'Your Home'}
                    description={''}
                    tracksViewChanges={false}
                    style={{backgroundColor: 'white', borderRadius: 15, padding: 1}}
                    >
                        <MaterialCommunityIcons name={'home-circle'} size={30} style={{}} />
                </Marker>

                {coords.map((marker, index) => (
                        <Marker
                        key={index}
                        coordinate={{latitude: marker.location.lat, longitude: marker.location.lon}}
                        title={''}
                        description={''}
                        tracksViewChanges={false}
                        style={{backgroundColor: "#1fe073", borderRadius: 13, borderWidth: 3, borderColor: 'white'}}
                        >
                            {/* <Image
                            style={{borderRadius: 45, height: 30, width: 30}}
                            source={logo}
                            /> */}
                            <FontAwesome5 name="circle" size={20} color="#1fe073"/>
                            <Callout style={{height: windowHeight * 0.15, width: windowWidth * 0.6}} onPress={() => goToPostingDetailView(marker)}>
                                <View style={{height: '100%', width: '100%'}}>
                                    <View style={{flex: 1, flexDirection: 'row', height: '80%'}}> 
                                        <View style={styles.logoView}>
                                            <FastImage
                                                style={styles.logoImg}
                                                source={logo}
                                            />
                                        </View>
                                        <View style={styles.titleView}>
                                            <Text
                                                style={ styles.roleNameTextBig }>
                                                {marker.roleName}
                                            </Text>
                                            <Text
                                                style={ styles.businessInfoTextBig }>
                                                {marker.businessName}
                                            </Text>
                                            {marker.salaryRangeLow !== marker.salaryRangeHigh &&
                                            <Text style={styles.salaryText}>
                                                ${marker.salaryRangeLow} - {marker.salaryRangeHigh} per hour
                                            </Text>}
                                            {marker.salaryRangeLow === marker.salaryRangeHigh &&
                                            <Text style={styles.salaryText}>
                                                ${marker.salaryRangeLow} per hour
                                            </Text>}
                                        </View>
                                    </View>
                                    <View style={styles.viewButton}>
                                        <Text style={styles.viewText}> View in App </Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                )}

                {linkCoords.map((marker, index) => (
                        <Marker
                        key={index}
                        coordinate={{latitude: marker.location.lat, longitude: marker.location.lon}}
                        title={''}
                        description={''}
                        tracksViewChanges={false}
                        style={{backgroundColor: "#5CE1E6", borderRadius: 13, borderWidth: 3, borderColor: 'white'}}
                        >
                            {/* <Image
                            style={{borderRadius: 45, height: 30, width: 30}}
                            source={logo}
                            /> */}
                            <FontAwesome5 name="circle" size={20} color="#5CE1E6"/>
                            <Callout style={{height: windowHeight * 0.15, width: windowWidth * 0.6}} onPress={() => goToPostingDetailView(marker)}>
                                <View style={{height: '100%', width: '100%'}}>
                                    <View style={{flex: 1, flexDirection: 'row', height: '80%'}}> 
                                        <View style={styles.logoView}>
                                            <FastImage
                                                style={styles.logoImg}
                                                source={logo}
                                            />
                                        </View>
                                        <View style={styles.titleView}>
                                            <Text
                                                style={ styles.roleNameTextBig }>
                                                {marker.roleName}
                                            </Text>
                                            <Text
                                                style={ styles.businessInfoTextBig }>
                                                {marker.businessName}
                                            </Text>
                                            {marker.salaryRangeLow !== marker.salaryRangeHigh &&
                                            <Text style={styles.salaryText}>
                                                ${marker.salaryRangeLow} - {marker.salaryRangeHigh} per hour
                                            </Text>}
                                            {marker.salaryRangeLow === marker.salaryRangeHigh && marker.salaryRangeHigh != 0 &&
                                            <Text style={styles.salaryText}>
                                                ${marker.salaryRangeLow} per hour
                                            </Text>}
                                            {marker.salaryRangeHigh == 0 && marker.salaryRangeLow == 0 && 
                                            <Text style={styles.salaryText}>
                                                Click for more details
                                            </Text>}
                                        </View>
                                    </View>
                                    <View style={styles.viewButton}>
                                        <Text style={styles.viewText}> View on Career Site</Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    )
                )}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    map: {
        flex: 1,
        marginTop: '2%',
        marginBottom: 0,
    },
    logoView: {
        height: '100%',
        padding: 10,
        marginTop: '3%'
    },
    logoImg: {
        width: 50,
        height: 50,
        borderRadius: 15,
    },
    titleView: {
        padding: 10,
        height: '100%',
    },
    roleNameText: {
        fontSize: 21,
        fontWeight: '700',
        marginBottom: 3,
    },
    roleNameTextBig: {
        fontSize: 17,
        fontWeight: '700',
    },
    businessInfoText: {
        fontSize: 17,
    },
    businessInfoTextBig: {
        fontSize: 16,
    },
    salaryView: {
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 10,
    },
    salaryText: {
        fontSize: 16,
        marginTop: 5,
    },
    viewButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4287f5',
        borderRadius: 5,
        height: '20%',
        width: '80%',
        marginLeft: '10%',
        marginBottom: '1%'
    },
    viewText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    }
})

const HomeScreenNearBy = React.memo(HomeScreenNearbyJobsMapSubview);
export default HomeScreenNearBy