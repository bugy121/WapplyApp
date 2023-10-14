import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging'
import { Text } from 'react-native';

import App from './App';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

// To avoid launching the app after receiving a notification
// messaging()
//   .getIsHeadless()
//   .then(isHeadless => {
//     // do sth with isHeadless
//   });

// Handle interaction when app is in background state:
// messaging().setOpenSettingsForNotificationsHandler(async () => {
//     // Set persistent value, using the MMKV package just as an example of how you might do it
//     MMKV.setBool(openSettingsForNotifications, true)
// })

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }
    return <App />;
}
  

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App, () => HeadlessCheck);
