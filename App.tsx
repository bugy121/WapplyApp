import { StatusBar } from 'expo-status-bar';
import React from 'react';
import './src/constants/firebase';
import { LogBox } from 'react-native';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import { createStore, combineReducers} from 'redux';
import { Provider } from 'react-redux'

// import all reducers
import { ApplicantAppliedJobPostingReducer } from './src/store/ApplicantAppliedJobPostingReducer';
import { ApplicantJobListingReducer } from './src/store/ApplicantJobListingReducer';
import { ApplicantProfileDataReducer } from './src/store/ApplicantProfileReducer';
import { EmployerJobListingReducer } from './src/store/EmployerJobListingReducer';
import { EmployerPostingCreationReducer } from './src/store/EmployerPostingCreationReducer'; 
import { EmployerProfileDataReducer } from './src/store/EmployerProfileReducer';
import { ApplicantJobListFilterReducer } from './src/store/ApplicantJobListFilterReducer';
import { ChatMessageReducer } from './src/store/ChatMessageReducer';
import { EmployerLinkPostCreationReducer } from './src/store/EmployerLinkPostCreationReducer';
import { Settings } from 'react-native-fbsdk-next';
// import Amplify from 'aws-amplify'
// import config from './src/aws-exports'
// import auth from '@react-native-firebase/auth';

// Amplify.configure({
//   ...config,
//   Analytics: {
//     disabled: true,
//   },
// })

const rootReducer = combineReducers({
  applicantAppliedJobReducer: ApplicantAppliedJobPostingReducer,
  applicantJobListingReducer: ApplicantJobListingReducer,
  applicantProfileReducer: ApplicantProfileDataReducer,
  employerJobListingReducer: EmployerJobListingReducer,
  employerPostingCreationReducer: EmployerPostingCreationReducer,
  employerProfileReducer: EmployerProfileDataReducer,
  applicantJobListFilterReducer: ApplicantJobListFilterReducer,
  chatMessageReducer: ChatMessageReducer,
  EmployerLinkPostCreationReducer: EmployerLinkPostCreationReducer,
})

export type RootState = ReturnType<typeof rootReducer>

Settings.setAppID('653208095980834');
Settings.initializeSDK();
const store = createStore(rootReducer);


LogBox.ignoreLogs(['VirtualizedList', 'Invalid child', 'useNativeDriver', 'RFC2822/ISO', 
'should have a unique', 'perform a React state update', 'update a component from inside']);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        
        <Navigation colorScheme={colorScheme} />
        <StatusBar />

      </Provider>
    );
  }
}
