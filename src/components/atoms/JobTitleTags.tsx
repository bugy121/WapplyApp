import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JobTitleTags(data) {
    return (
        <View style={[styles.content, {backgroundColor: data.backgroundColor}]}>
            <Ionicons style={{paddingTop: 1, paddingLeft: 1}} name={data.icon} size={data.fontSize} color={data.textColor} />
            <Text style={[styles.text, {color: data.textColor, fontSize: data.fontSize}]}> 
                {data.text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row', 
        padding: 5, 
        borderRadius: 5, 
        paddingRight: 0,
        marginRight: 10,
    },
    text: {
        marginLeft: '5%',
        marginRight: -1, 
        fontWeight: '600'
    }
})