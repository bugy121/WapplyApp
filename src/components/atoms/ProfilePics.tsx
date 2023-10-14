import * as React from 'react';
import { Alert, Button, StyleSheet } from 'react-native';
import { Text, View } from '../Themed';

export default function ProfilePics() {
    return (
        <View style={styles.container}> 
            <Button
                title="P"
                onPress={() => Alert.alert('Simple Button pressed')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      borderRadius: 30,
      height: 40,
      width: 40,
      marginLeft: 10,
    },
  });