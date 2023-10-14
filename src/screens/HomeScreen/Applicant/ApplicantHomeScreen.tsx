import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions,Animated, Platform, Linking, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { useSelector } from 'react-redux';
import HomeScreenNewJobsSubview from './HomeScreenNewJobsSubview';
import HomeScreenNearbyJobsMapSubview from './HomeScreenNearbyJobsMapSubview';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Button, FAB } from 'react-native-paper';
import { Portal, Provider, Button as PaperButton, Modal as PaperModal } from 'react-native-paper';
import { Avatar, Card, Title, Paragraph, Colors } from 'react-native-paper';
import ConfettiCannon from 'react-native-confetti-cannon';
import MakeItRain from 'react-native-make-it-rain';
import { Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import messaging from '@react-native-firebase/messaging';

export default function ApplicantHomeScreen({route}) {
    const showAppliedJobsAnimation = useSelector(state => state.applicantProfileReducer).applyJobAnimation
    const showConfetti = useSelector(state => state.applicantProfileReducer).loginAnimation

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const iconNames = ['clock-fast', 'map-marker-distance']

    const [permissionAuth, setPermissionAuth] = useState(false);
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
    }
    
    async function checkApplicationPermission() {
        const authorizationStatus = await messaging().requestPermission({
            providesAppNotificationSettings: true, // set this to true provides a wapply notification button in settings
        });
      
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          console.log('User has notification permissions enabled.');
        } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
          console.log('User has provisional notification permissions.');
        } else {
          console.log('User has notification permissions disabled');
        }
    }

    React.useEffect(() => {
        if (!permissionAuth) {
            requestUserPermission();
            checkApplicationPermission();
            setPermissionAuth(true);
        }
    })

    const NewJobsRoute = () => (
        <HomeScreenNewJobsSubview/>
    );
        
    const NearbyJobsRoute = () => (
        // <HomeScreenNearbyJobsSubview/>
        <HomeScreenNearbyJobsMapSubview/>
    );
    
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [showSupportModal, setShowSupportModal] = React.useState(false)
    const [routes] = React.useState([
        { key: 'newJobs', title: 'New Jobs' },
        { key: 'nearbyJobs', title: 'Nearby Jobs' },
      ]);

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i)
        return (
            <View style={{flexDirection: 'row', height: 50, paddingHorizontal: 5}}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) =>
                        inputIndex === i ? 1 : 0.5
                        ),
                    });

                    return (
                        <TouchableOpacity
                            style={[{width: windowWidth / 2 - 5, height: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}, 
                                    (i == 0) ? {borderTopLeftRadius: 25, borderBottomLeftRadius: 25} : { borderTopRightRadius: 25, borderBottomRightRadius: 25},
                                    (i === index ? {backgroundColor: Colors.blueGrey400} : {backgroundColor: Colors.white})
                                    ]}
                            onPress={() => setIndex(i)}>
                            <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                                <MaterialCommunityIcons name={iconNames[i]} size={25} style={{paddingRight: 5}} color={(index === i) ? 'white': 'black'} />
                                <Animated.Text style={{ opacity, fontSize: 20, fontWeight: '600', color: (index === i) ? 'white': 'black' }}>{route.title}</Animated.Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )
    }

    async function emailSupportPressed() {
        const operator = Platform.OS === "ios" ? "&" : "?";
        const emailSubject = `[Wapply] Applicant support inquiry`;
        const emailUrl =`mailto:wapplyjobsearch@gmail.com${operator}subject=${emailSubject}`;
        await Linking.openURL(emailUrl);
    }
    
    const renderScene = SceneMap({
      newJobs: NewJobsRoute,
      nearbyJobs: NearbyJobsRoute,
    });
  

    return (
        <Provider>
        <View style={{flex: 1 }}>
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
                style={{marginTop: 60}}
            />
            <FAB
                style={styles.fab}
                icon="face-agent"
                onPress={() => setShowSupportModal(true)}
            />
            {/* <TouchableOpacity
                style={styles.fabMap}
                onPress={() => setShowSupportModal(true)}
            >
                <Text> Map </Text>
            </TouchableOpacity> */}
        <Portal>
            <PaperModal visible={showSupportModal} onDismiss={() => setShowSupportModal(false)} >
                <Card style={{width: '60%', alignSelf: 'center', borderRadius: 25}}>
                    <Card.Content>
                        <Title style={{fontWeight: '800'}}>Contact Support</Title>
                        <Paragraph style={{fontSize: 20, paddingVertical: 10, fontWeight: '600'}}>Email</Paragraph>
                        <Paragraph style={{fontSize: 14}}>
                        wapplyjobsearch@gmail.com
                        </Paragraph>
                        <Button icon='email' onPress={emailSupportPressed} mode='contained' color={Colors.greenA200} style={{marginTop: 20, borderRadius: 25}}>
                            Email Support
                        </Button>
                    </Card.Content>
                </Card>
            </PaperModal>
        </Portal>
        </View>
        {showConfetti && <ConfettiCannon count={100} origin={{x: -10, y: 0}} />}
        {showAppliedJobsAnimation && <MakeItRain
          itemDimensions={{width: 40, height: 20}}
          itemComponent={<Text>$ $</Text>}
          itemTintStrength={0.8}
          continuous={false}
        />}
        </Provider>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
    },
    fabMap: {
        position: 'absolute',
        margin: 20,
        right: '35%',
        bottom: 0,
        width: 90,
        height: 30,
        backgroundColor:'purple',
        borderRadius: 25,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
})
