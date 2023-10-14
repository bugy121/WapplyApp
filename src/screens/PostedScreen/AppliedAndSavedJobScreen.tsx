import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import AppliedJobListScreen from './AppliedJobListScreen';
import SavedJobListSubview from './SavedJobListSubview';

export default function AppliedAndSavedJobScreen() {

    const postInfo = useSelector(state => state.applicantAppliedJobReducer).postings;

    const AppliedJobsRoute = () => (
      <AppliedJobListScreen/>
    );
      
    const SavedJobsRoute = () => (
      <SavedJobListSubview/>
    );

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'appliedJobs', title: 'Applied' },
        { key: 'savedJobs', title: 'Saved' },
      ]);

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            activeColor={'black'}
            inactiveColor={'gray'}
            style={{marginTop:25,backgroundColor:'transparent'}}
            indicatorStyle={{backgroundColor: 'gray'}}
            labelStyle={{fontWeight: 'bold', fontSize: 20}}
        />
    );
    
    const renderScene = SceneMap({
      appliedJobs: AppliedJobsRoute,
      savedJobs: SavedJobsRoute,
    });

    return (
      // TODO: Insert a cool icon/image/design on the top
        // <TabView
        // navigationState={{index, routes}}
        // renderScene={renderScene}
        // onIndexChange={setIndex}
        // initialLayout={{ width: layout.width }}
        // renderTabBar={renderTabBar}
        // style={{marginTop: 60}}
        // />
      <AppliedJobListScreen/>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
      fontSize: 30,
      marginTop: 30,
      marginBottom: 20,
      marginHorizontal: 30,
      fontWeight: '500',
      fontFamily: 'Verdana',
  },
  content: {
      backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flex:1,
    padding: 16
  }
})