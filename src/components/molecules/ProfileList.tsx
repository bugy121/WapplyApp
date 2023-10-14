import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '../Themed';

import ProfilePics from '../atoms/ProfilePics';

export default function ProfileList() {
    return (
        <ScrollView 
            horizontal={true}> 
            <View style={styles.container}> 
                <ProfilePics/>
                <ProfilePics/>
                <ProfilePics/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
    },
  });