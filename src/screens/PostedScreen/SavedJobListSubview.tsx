import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useSelector } from 'react-redux';

export default function SavedJobListSubview() {

    const postInfo = useSelector(state => state.applicantAppliedJobReducer).postings;

    return (
        //TODO NEEDS TO BE IMPLEMENTEED
        <View>
            <Text>Saved jobs list</Text>
        </View>
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