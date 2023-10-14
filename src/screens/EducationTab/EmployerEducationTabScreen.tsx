import * as React from 'react';
import { useState, useCallback } from 'react';
import { View, StyleSheet, Button, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
// import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EmployerEducationTabScreen() {

    const video = React.useRef(null);
    const [videoURLs, setVideoURLs] = React.useState([
        {
            title: "Introduction to Wapply",
            link: require('../../../assets/educationTabVids/aloaf_intro_1.mp4')
        }
        
    ])

    const renderVideoSection = ({item, index}) => {
        return (
            <View style={{paddingBottom: 30}}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Video source={item.link}   // Can be a URL or a local file.
                    style={{width: '90%', height: 200, alignSelf: 'center'}}
                    useNativeControls
                 />
            </View>
        )
    }

    // carousel
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselItems = [
        {
            title: "Steph Curry Funny Moments",
            link: require('../../../assets/educationTabVids/aloaf_intro_1.mp4'),
            videoId: "w693AW-xjiQ"
        },
        {
            title: "FROM LOGOOOO",
            link: require('../../../assets/educationTabVids/aloaf_intro_1.mp4'),
            videoId: "tbdd4BkG4-E"
        },
        {
            title: "Deepest 3s from Steph",
            link: require('../../../assets/educationTabVids/aloaf_intro_1.mp4'),
            videoId: "UbPnZLqiiDw"
        },
        {
            title: "Steph Curry Lockdown D",
            link: require('../../../assets/educationTabVids/aloaf_intro_1.mp4'),
            videoId: "WFlG3t80zsc"
        },
        {
            title: "He changed the game!",
            link: require('../../../assets/educationTabVids/aloaf_intro_1.mp4'),
            videoId: "sKUC-LPTo50"
        },
      ]

    const renderItem = ({ item , index }) => {
        return (
          <View style={{
                borderRadius: 5,
                height: windowHeight * .32,
                }}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            {/* <Video source={item.link}   // Can be a URL or a local file.
                style={{width: '90%', height: 200, alignSelf: 'center'}}
                useNativeControls
                /> */}
            <YoutubePlayer
                height={300}
                play={playing}
                videoId={item.videoId}
                onChangeState={onStateChange}
            />
          </View>
        )
    }

    // youtube 
    const [playing, setPlaying] = useState(false);
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
          setPlaying(false);
        //   Alert.alert("video has finished playing!");
        }
    }, []);

    const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
    }, []);

    return (
        <ScrollView style={{marginTop: 80}}>
            <View style={styles.content}>
                <Text style={styles.pageTitle}>Help / Resources</Text>
                <FontAwesome name='youtube-play' size={32} style={{paddingLeft: 10, paddingTop: 4}} color={'red'} />
            </View>

            <View style={{height: '10%'}} />

            <Carousel
                layout={"default"}
                data={carouselItems}
                sliderWidth={windowWidth}
                itemWidth={windowWidth * 0.8}
                renderItem={renderItem}
                onSnapToItem = { index => setActiveIndex(index) } />

            <View style={{height: '10%'}} />
        
            <Carousel
                layout={"default"}
                data={carouselItems}
                sliderWidth={windowWidth}
                itemWidth={windowWidth * 0.8}
                renderItem={renderItem}
                onSnapToItem = { index => setActiveIndex(index) } />
            {/* <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    pageTitle:{
        fontSize: 30,
        fontWeight: '600',
        paddingLeft: 20,
        paddingBottom: 20
    },
    videoTitle:{
        paddingLeft: 30,
        paddingBottom: 10,
        fontSize: 20,
        fontWeight: '500'
    }
})