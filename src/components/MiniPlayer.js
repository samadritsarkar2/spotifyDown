import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native";
import TrackPlayer from "react-native-track-player";


const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        stopWithApp : true,
        alwaysPauseOnInterruption : true,
        capabilities : [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE
        ]
    })
    await TrackPlayer.add([{
      id: '1',
      url:
        'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
      type: 'default',
      title: 'My Title',
      album: 'My Album',
      artist: 'Rohan Bhatia',
      artwork: 'https://picsum.photos/100',
    },
    {
        id: '1',
        url:
          'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
        type: 'default',
        title: 'My Title',
        album: 'My Album',
        artist: 'Rohan Bhatia',
        artwork: 'https://picsum.photos/100',
      }
]);
   
    return true;
   };
    

const MiniPlayer = () => {
   
    const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
 
    //initialize the TrackPlayer when the App component is mounted
    useEffect(() => {
      const startPlayer = async () => {
         let isInit =  await trackPlayerInit();
         setIsTrackPlayerInit(isInit);
      }
    //   startPlayer();
    }, []);



    return (
        <>
            <View style={styles.box}>
               <View style={styles.playerView}>
                   <View style={styles.trackInfo} >
                   <Text style={{color : 'white'}} >Song Name</Text>
                   </View>

                   <View style={styles.playerControls} >
                        <TouchableOpacity>
                        <Image 
                            source={require("../assets/previous.png")} 
                                style={styles.playerIcons}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={async () => await TrackPlayer.play()}
                        >
                            <Image 
                            source={require("../assets/play-button.png")} 
                                style={[styles.playerIcons]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={ async () => {
                        //   await TrackPlayer.destroy();
                        }}
                        >
                        <Image 
                            source={require("../assets/next.png")} 
                                style={styles.playerIcons}
                            />
                        </TouchableOpacity>
                   </View>
               </View>
            </View>
        </>
    )
}

export default MiniPlayer;

const styles = StyleSheet.create({
    box : {
        position: 'absolute',
        width: '100%',
        height: 47,
      
        justifyContent: 'center',
        bottom: 43,
        paddingVertical : 10,
        backgroundColor : '#212326',
         marginBottom : 1
    },
    playerView : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    trackInfo : {
        marginStart : 10,
        alignSelf : 'center'
    },
    playerControls : {
        flexDirection : 'row',
          marginEnd : 20,
          alignSelf : 'center'
      
    },
    playerIcons : {width : 25, 
        height : 25,
        marginHorizontal : 7
        },
    
})