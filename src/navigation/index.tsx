/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useState } from 'react'
import { ColorSchemeName, View, Text, Animated, Linking } from 'react-native';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';

import {
  AnimatedTabBarNavigator,
  DotSize, // optional
  TabElementDisplayOptions, // optional
  TabButtonLayout, // optional
  IAppearanceOptions // optional
} from 'react-native-animated-nav-tab-bar'

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import EmployerHomeScreen from '../screens/HomeScreen/Employer/EmployerHomeScreen';
import RootNewJobPostingScreen from '../screens/AddPostScreen/RootNewJobPostingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpUserTypeScreen from '../screens/Auth/SignUpUserTypeScreen';
import SignUpRootScreen from '../screens/Auth/SignUpRootScreen';
import SignUpEmployerRootScreen from '../screens/Auth/SignUpEmployerRootScreen';
import AppliedJobListScreen from '../screens/PostedScreen/AppliedJobListScreen';
import ApplicantHomeScreen from '../screens/HomeScreen/Applicant/ApplicantHomeScreen';
import InternshipPostScreen from '../screens/HomeScreen/Applicant/InternshipPostScreen';
import RoleApplicationsDetailView from '../screens/HomeScreen/Employer/RoleApplicationsDetailView';
import AppliedJobDetailView from '../screens/PostedScreen/AppliedJobDetailView';
import ApplicantJobDetailView from '../screens/HomeScreen/Applicant/ApplicantJobDetailView';
import SignUpEmployerLocationScreen from '../screens/Auth/SignUpEmployerLocationScreen';
import SignUpEmployerAdditionalInfoScreen from '../screens/Auth/SignUpEmployerAdditionalInfoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../../types';
import LinkingConfiguration from './LinkingConfiguration';

import { useSelector } from 'react-redux';
import ApplicantProfileScreen from '../screens/ProfileScreen/ApplicantProfileScreen';
import SettingsScreen from '../screens/ProfileScreen/SettingsScreen';
import BlankProfileScreen from '../screens/ProfileScreen/BlankProfileScreen';

import SignUpApplicantRootScreen from '../screens/Auth/SignUpApplicantRootScreen';
import SignUpApplicantContactInfo from '../screens/Auth/SignUpApplicantContactInfo';
import SignUpApplicantAdditionalInfoScreen from '../screens/Auth/SignUpApplicantAdditionalInfoScreen';
import SignUpApplicantLocationScreen from '../screens/Auth/SignUpApplicantLocationScreen';
import SignUpApplicantEducationScreen from '../screens/Auth/SignUpApplicantEducationScreen';

import ApplicantJobApplicationView from '../screens/ApplicationScreen/ApplicantJobApplicationView';
import ApplicantJobApplicationVideoView from '../screens/ApplicationScreen/ApplicantJobApplicationVideoView';
import PhoneAuthScreen from '../screens/Auth/PhoneAuthScreen';
import CreationCustomQuestionScreen from '../screens/AddPostScreen/CreationCustomQuestionScreen';
import ApplicationStatusView from '../screens/HomeScreen/Applicant/ApplicationStatusView';
import SplashScreen from '../screens/SplashScreen';
import VersionScreen from '../screens/VersionScreen';
import AppliedAndSavedJobScreen from '../screens/PostedScreen/AppliedAndSavedJobScreen';
import RootApplicantReviewScreen from '../screens/HomeScreen/Employer/RootApplicantReviewScreen';
import EmployerEducationTabScreen from '../screens/EducationTab/EmployerEducationTabScreen';
import ApplicantEducationTabScreen from '../screens/EducationTab/ApplicantEducationTabScreen';
import CreationPostInformationScreen from '../screens/AddPostScreen/CreationPostInformationScreen';
import EmployerOnboardingScreen from '../screens/Onboarding/employer/EmployerOnboardingScreen';
import ApplicantOnboardingScreen from '../screens/Onboarding/applicant/ApplicantOnboardingScreen';
import RootInformationNewPostingScreen from '../screens/AddPostScreen/RootInformationNewPostingScreen';
import RootEmployerChatScreen from '../screens/HomeScreen/Employer/RootEmployerChatScreen';
import ApplicantChatMessageScreen from '../screens/PostedScreen/ApplicantChatMessageScreen';
import TimeAvailability from '../screens/ProfileScreen/TimeAvailability';
import LinkPostCreationScreen from '../screens/AddPostScreen/LinkPostCreationScreen';
import LinkPostDetailView from '../screens/HomeScreen/Employer/LinkPostDetailView';
import Icon from 'react-native-vector-icons/Feather';
import messaging from '@react-native-firebase/messaging'
import VersionCheck from 'react-native-version-check';
import EmployerEditJobPostScreen from '../screens/HomeScreen/Employer/EmployerEditJobPostScreen';
import { Badge } from 'react-native-paper';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

        <RootNavigator />

      </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {

  const navigation = useNavigation();

  // Detect whether the application was opened by pressing on a notification 
  // (so you could open a specific screen for example)
  // React.useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open
  //   // messaging().onNotificationOpenedApp(remoteMessage => {
  //   //   console.log(
  //   //     'Notification caused app to open from background state:',
  //   //     remoteMessage.notification,
  //   //   );
  //   //   // navigation.navigate('Root');
  //   // });

  //   // Check whether an initial notification is available
  //   // messaging()
  //   //   .getInitialNotification()
  //   //   .then(remoteMessage => {
  //   //     if (remoteMessage) {
  //   //       console.log(
  //   //         'Notification caused app to open from quit state:',
  //   //         remoteMessage.notification,
  //   //       );
  //   //       // setInitialRoute('Login'); // e.g. "Settings"
  //   //     }
  //   //   });
  // }, []);

  let initialRoute = "";
  VersionCheck.getLatestVersion({
    provider: 'appStore'
  })
  .then(latestVersion => {
    console.log("latest version: ", latestVersion);
    console.log("current version: ", VersionCheck.getCurrentVersion()); 
  });

  return (
    <Stack.Navigator
      initialRouteName="Splash">
      <Stack.Screen name="Version" component={VersionScreen} options={{ animationEnabled: false, headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animationEnabled: false, headerShown: false, gestureEnabled: false, }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animationEnabled: false, headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ animationEnabled: false, headerShown: false, gestureEnabled: false}} />
      <Stack.Screen name="SignUpRoot" component={SignUpRootScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpUserType" component={SignUpUserTypeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpEmployerRoot" component={SignUpEmployerRootScreen} options={{ headerShown: false, }} />
      <Stack.Screen name="SignUpEmployerLocation" component={SignUpEmployerLocationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpEmployerAdditionalInfo" component={SignUpEmployerAdditionalInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpApplicantRoot" component={SignUpApplicantRootScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpApplicantContactInfo" component={SignUpApplicantContactInfo} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpApplicantAdditionalInfo" component={SignUpApplicantAdditionalInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpApplicantLocation" component={SignUpApplicantLocationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpApplicantEducation" component={SignUpApplicantEducationScreen} options={{ headerShown: false, gestureEnabled: true}} />
      <Stack.Screen name="CreationCustomQuestion" component={CreationCustomQuestionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RootNewJobPosting" component={RootNewJobPostingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RootApplicantReview" component={RootApplicantReviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreationPostInformation" component={CreationPostInformationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmployerOnboarding" component={EmployerOnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicantOnboarding" component={ApplicantOnboardingScreen} options={{ headerShown: false }} />
      {/* <Stack.Screen name="RootApplicantReview" component={RootApplicantReviewScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="RootInformationNewPosting" component={RootInformationNewPostingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicantHome" component={ApplicantHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RoleApplicationsDetailView" component={RoleApplicationsDetailView} options={{ headerShown: false }} />
      <Stack.Screen name="AppliedJobDetailView" component={AppliedJobDetailView} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicantJobDetailView" component={ApplicantJobDetailView} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicantJobApplicationView" component={ApplicantJobApplicationView} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneAuthScreen" component={PhoneAuthScreen} options={{ headerShown: false}} />
      <Stack.Screen name="ApplicationStatusView" component={ApplicationStatusView} options={{ headerShown: false}} />
      <Stack.Screen name="RootEmployerChat" component={RootEmployerChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicantChatMessage" component={ApplicantChatMessageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TimeAvailabilityView" component={TimeAvailability} options={{ headerShown: false, gestureEnabled: true}} />
      <Stack.Screen name="EmployerEditJobPost" component={EmployerEditJobPostScreen} options={{ headerShown: false, gestureEnabled: true}} />
      <Stack.Screen name="LinkPostCreationScreen" component={LinkPostCreationScreen} options={{ headerShown: false, gestureEnabled: true}} />
      <Stack.Screen name="LinkPostDetailView" component={LinkPostDetailView} options={{ headerShown: false, gestureEnabled: true}} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const Tabs = AnimatedTabBarNavigator();

function BottomTabNavigator({route}) {
  const colorScheme = useColorScheme();
  let isEmployer = useSelector(state => state.employerProfileReducer).profileData;
  let isApplicant = useSelector(state => state.applicantProfileReducer).profileData;

  const chatNotificationStatuses = useSelector(state => state.chatMessageReducer).chatStatuses;
  let showNotificationBadge = false
  Object.keys(chatNotificationStatuses).forEach((key) => {
    if (chatNotificationStatuses[key] > 0) {
      showNotificationBadge = true
    }
  })
  const [userType, setUserType] = useState(isEmployer.userType.toLowerCase() || isApplicant.userType.toLowerCase());

    if (isEmployer.userType.toLowerCase() == "employer") {
      return (
        <Tabs.Navigator
          // default configuration from React Navigation
          tabBarOptions={{
            activeTintColor: "white",
            inactiveTintColor: "#222222",
            activeBackgroundColor: 'black',
            labelStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            }
          }}
          appearance={{
            whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
            whenActiveShow: TabElementDisplayOptions.BOTH,
            dotSize: "small",
            horizontalPadding: 20,
            topPadding: 10,
          }}
        >
          <Tabs.Screen
            name="Posts"
            component={EmployerHomeScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="file-text"
                      size={24}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
            initialParams={route}
          />
          <Tabs.Screen
            name="New Post"
            component={RootInformationNewPostingScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="plus-square"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
          />
          <Tabs.Screen
            name="Profile"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="user"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
          />
        </Tabs.Navigator>
        // <BottomTab.Navigator
        //   initialRouteName="Home"
        //   screenOptions={{
        //     tabBarActiveTintColor: Colors[colorScheme].tint,
        //     tabBarStyle: { height: '10%' },
        //   }}>

        //   <BottomTab.Screen
        //     name="Home"
        //     component={EmployerHomeScreen}
        //     options={{
        //       title: '',
        //       headerShown: false,
        //       tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        //     }}
        //   />

        //   <BottomTab.Screen
        //     name="RootInformationNewPosting"
        //     component={RootInformationNewPostingScreen}
        //     options={{
        //       title: '',
        //       headerShown: false,
        //       tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        //     }}
        //   />

        //   {/* <BottomTab.Screen
        //     name="EmployerEducation"
        //     component={EmployerEducationTabScreen}
        //     options={{
        //       title: '',
        //       headerShown: false,
        //       tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        //     }}
        //   /> */}

        //   <BottomTab.Screen
        //     name="Profile"
        //     component={SettingsScreen}
        //     options={{
        //       title: '',
        //       headerShown: false,
        //       tabBarIcon: ({ color }) => <TabBarIcon name="user-o" color={color} />,
        //     }}
        //   />

        // </BottomTab.Navigator>
      );
    } else if (isApplicant.userType.toLowerCase() == "applicant") {
      return (
        <Tabs.Navigator
          // default configuration from React Navigation
          tabBarOptions={{
            activeTintColor: "white",
            inactiveTintColor: "#222222",
            activeBackgroundColor: 'black',
            labelStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            }
          }}
          appearance={{
            whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
            whenActiveShow: TabElementDisplayOptions.BOTH,
            dotSize: "small",
            horizontalPadding: 20,
            topPadding: 10,
          }}
        >
          <Tabs.Screen
            name="Jobs"
            component={ApplicantHomeScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="search"
                      size={24}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
          />
          <Tabs.Screen
            name="Interns"
            component={InternshipPostScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                      name="md-git-network-outline"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                  />
              )
            }}
          />
          <Tabs.Screen
            name="Applied"
            component={AppliedAndSavedJobScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <View>
                  <Icon
                      name="briefcase"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
                  {showNotificationBadge &&
                    <Badge visible={true} size={15} style={{position: 'absolute', top: -2, right: -6}}> </Badge>
                  }
                </View>
              )
            }}
          />
          <Tabs.Screen
            name="Profile"
            component={ApplicantProfileScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="user"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
          />
        </Tabs.Navigator>
    //     <BottomTab.Navigator
    //       initialRouteName="Home"
    //       screenOptions={{
    //         tabBarStyle: { height: '11%' },
    //         tabBarActiveTintColor: Colors[colorScheme].tint,
    //       }}
    //       >

    //       <BottomTab.Screen
    //         name="Featured"
    //         component={ApplicantHomeScreen}
    //         options={{
    //           title: '',
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
    //         }}
    //         initialParams={{showOnboarding: true}}
    //       />

    //       <BottomTab.Screen
    //         name="AppliedJob"
    //         component={AppliedAndSavedJobScreen}
    //         options={{
    //           title: '',
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
    //         }}
    //       />

    //       {/* <BottomTab.Screen 
    //         name="ApplicantEducation"
    //         component={ApplicantEducationTabScreen}
    //         options={{
    //           title: '',
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
    //         }}
    //       /> */}

    //       <BottomTab.Screen
    //         name="Profile"
    //         component={ApplicantProfileScreen}
    //         options={{
    //           title: '',
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => <TabBarIcon name="user-o" color={color} />,
    //         }}
    //       />

    //     </BottomTab.Navigator>
    //   )
    // } 
    // else {
    //   return (
    //     // Splash Screen
    //     <BottomTab.Navigator
    //     initialRouteName="Home"
    //     screenOptions={{
    //       tabBarActiveTintColor: Colors[colorScheme].tint,
    //     }}>

    //       <BottomTab.Screen
    //         name="SplashScreen"
    //         component={SplashScreen}
    //         options={{
    //           title: '',
    //           headerShown: false,
    //           tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
    //         }}
    //       />

    //   </BottomTab.Navigator>
      )
    } else {
      return (
        <Tabs.Navigator
          // default configuration from React Navigation
          tabBarOptions={{
            activeTintColor: "white",
            inactiveTintColor: "#222222",
            activeBackgroundColor: 'black',
            labelStyle: {
              fontSize: 18,
              fontWeight: 'bold'
            }
          }}
          appearance={{
            whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
            whenActiveShow: TabElementDisplayOptions.BOTH,
            dotSize: "small",
            horizontalPadding: 20,
            topPadding: 10,
          }}
        >
          <Tabs.Screen
            name="Jobs"
            component={ApplicantHomeScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="search"
                      size={24}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
          />
          <Tabs.Screen
            name="Interns"
            component={InternshipPostScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                      name="md-git-network-outline"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                  />
              )
            }}
          />
          <Tabs.Screen
            name="Profile"
            component={LoginScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                  <Icon
                      name="user"
                      size={28}
                      color={focused ? color : "#222222"}
                      focused={focused}
                      color={color}
                  />
              )
            }}
          />
        </Tabs.Navigator>
      )
    }
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={34} style={{ marginTop: '5%', marginBottom: '-5%' }} {...props} />;
}
