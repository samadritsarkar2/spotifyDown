import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import TrackPlayer from "react-native-track-player";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../redux/actions/index";



const MiniPlayer = () => {
   
    const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
    const dispatch = useDispatch();
    const queue = useSelector(state => state.player);
 
    
    const trackPlayerInit = async (queue) => {

    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        stopWithApp : true,
        alwaysPauseOnInterruption : true,
        capabilities : [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE
        ],
        compactCapabilities : [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE
        ]
    })

   // await TrackPlayer.add(queue);
    
    return true;
   };
    
    //initialize the TrackPlayer when the App component is mounted
    useEffect(() => {
      const startPlayer = async () => {
         let isInit =  await trackPlayerInit(queue);
         setIsTrackPlayerInit(isInit);
      }
       startPlayer();
    }, []);

    const handlePlayPause = async () => {
        console.log(await TrackPlayer.getQueue())
        await TrackPlayer.play()
    }

    return (
        <>
            <View style={styles.box}>
               <View style={styles.playerView}>
                   <View style={styles.trackInfo} >
                   <Text style={{color : 'white'}} >Song Name</Text>
                   </View>

                   <View style={styles.playerControls} >
                        <TouchableOpacity
                         onPress={ async () => {
                            await TrackPlayer.skipToPrevious();
                           }}
                        >
                        <Image 
                            source={require("../assets/previous.png")} 
                                style={styles.playerIcons}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={handlePlayPause}
                        >
                            <Image 
                            source={require("../assets/play-button.png")} 
                                style={[styles.playerIcons]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={ async () => {
                         await TrackPlayer.skipToNext();
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