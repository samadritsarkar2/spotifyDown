import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,Event
} from 'react-native-track-player';
import Slider from "@react-native-community/slider";
import { windowHeight, windowWidth } from '../common';
import TextTicker from 'react-native-text-ticker';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { setPlayerClosed } from '../redux/actions/playerActions';

const Player = ({route, navigation}) => {

  const [positionString, setPositionString] = useState('');
  const [durationString, setDurationString] = useState('');
  
  const dispatch = useDispatch();

  
  const playbackState = usePlaybackState();
  const { position, buffered, duration } = useProgress(10);
  
  const store = useSelector(state => state).player;
  const { trackInfo : {title, artist, album, artwork}, isPlayerActive} = store;
  
  const isPlaying = playbackState === State.Playing;


  const onBackPress = () => {
    if (isPlayerActive) {
        
        navigation.goBack();
        setTimeout(()=>{
          dispatch(setPlayerClosed());

        }, 100)
        return true;
    } else {
      return false;
    }
  };



  useFocusEffect(
    useCallback(() => {
      


      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [isPlayerActive])
  );

    useFocusEffect(useCallback(() => {

      if(!title || !artwork )
      {
        onBackPress();
      }

    }, [artwork, title]))

 
  const togglePlayback = async () => {
   
   try {

    const currentTrack = await TrackPlayer.getCurrentTrack();

    // console.log(await TrackPlayer.getQueue());
    if (currentTrack == null) {
      // await TrackPlayer.reset();
      // await TrackPlayer.play();
    } else {
      if (playbackState === State.Paused || playbackState === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
    
   } catch (_) {
    
   }
   
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (_) {}
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (_) {}
  };

  const seekTo = async (pos) => {
    try {
        await TrackPlayer.seekTo(pos);
     
    } catch (_) {
      
    }
  }
  const calculateDurationString = (time) => {

    let minutes = Math.floor(time / 60);
    
    let seconds = Math.floor(time - minutes * 60);

   if(minutes < 10)
        minutes = '0' + minutes;
    
    if(seconds < 10)
        seconds = '0' + seconds;
    let s = new String(minutes);
    s += ":";
    s += seconds.toString();
    return s;
    // return [time / 60, time % 60].map(Math.floor).join(':');

    
    // setPositionString(finalTime);
  }

useMemo(() => {
    // console.log(trackState);
 
    setPositionString(calculateDurationString(position));
    // dispatch({
    //   type : 'SET_POSITION_STRING',
    //   payload : {positionString : calculateDurationString(position)}
    // })
}, [position])

useEffect(() => {
  setDurationString(calculateDurationString(duration));

}, [duration]);


  return (
    <View style={{
      height : windowHeight * 1,
        backgroundColor : '#212326'
      }}>
        <ImageBackground
          source={ artwork ? {uri : artwork} : null}
          style={{flex: 1}}
          blurRadius={35}
          >
            <View 
            style={styles.tintContainer}
            >  
        <View style={{
          flex : 1,
          flexDirection : 'column',
          marginHorizontal : windowWidth  * 0.025,
          justifyContent : 'center',
         
        }}>
              <View style={{
                flex : 1,
                    // height : windowHeight * 0.1,
                   justifyContent : 'space-between',
                   flexDirection : 'row',
                   
            
                 }}>
                  <TouchableOpacity
                  onPress={() => onBackPress() }
                  >
                  <Image
                    source={require("../assets/downArrow.png")}
                    style={{
                      width : 25,
                      height : 25,
                      marginTop : 20,
                      marginLeft : 8
                    }}
                    />
                    </TouchableOpacity>
                    <Image
                    source={require("../assets/notification_icon.png")}
                    style={{
                      width : 25,
                      height : 25,
                      marginTop : 20,
                      marginRight : 8
                    }}
                    />
            </View>

            <View style={{
                    flex : 3,
                    
                 }}>
                 <Image 
                         source={ artwork ? {uri : artwork} : null}

                  style={{
                    flex: 1,
                    width: undefined,
                    height: undefined,          
                    resizeMode:'contain'
                  }}
                 />
                 
            </View>

            <View
                style={{
                  flex : 1, 
                  justifyContent : 'center',
                  alignItems : 'center',
                }}
            >
                   <Text style={styles.songTitleText}>{title}</Text>
                   <TextTicker 
                   style={styles.songAlbumText} 
                  
                   >{album}</TextTicker>

            </View>

            <View
            style={{
              flex : 1,
              width : '100%',
              flexDirection : 'column',
              justifyContent : "flex-end",
              paddingHorizontal : 12
            }}
            >
              <View style={{ marginLeft: -15, marginRight: -15 }}>

               <Slider

                        style={styles.seekBar}
                        minimumValue={0}
                        value={position}
                        maximumValue={duration}
                        minimumTrackTintColor="white"
                        maximumTrackTintColor="gray"
                        thumbTintColor="white"
                        onSlidingComplete={ e => seekTo(e) }
                      />
                      
              </View>
              <View
              style={{
                flexDirection : 'row',
                justifyContent : 'space-between'
                
              }}
              >
                    <Text style={styles.durationText}>{positionString}</Text>
                   

                     <Text style={styles.durationText}>{durationString}</Text>
                </View>
            </View>

            <View style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent : 'space-evenly',
                    alignItems : 'center',
                    // backgroundColor : 'red'
                    marginBottom : windowHeight * 0.05,

                 }}>
            <TouchableOpacity style={styles.controlButton} onPress={skipToPrevious} >
                  <Image
                    style={styles.controlIcon}
                    source={require('../assets/previous.png')}
                  />
            </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.playButton]} onPress={togglePlayback}>
              <Image
                style={{...styles.controlIcon, 
                  width : 65,
                  height : 65
                }}
                source={ 
                  isPlaying
                  ? require('../assets/pause-button.png')
                  : require('../assets/play-button.png')
                  }
              />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={skipToNext} >
          <Image
            style={styles.controlIcon}
            source={require('../assets/next.png')}
          />
        </TouchableOpacity>

        
            </View>
        </View>
    
        </View>
        </ImageBackground>

        

    </View>
  );
}


export default Player;

// const styles = StyleSheet.create({
//   basicText: {
//     color: 'black',
//     fontSize: 20,
//   },
//   playerIcons: {width: 27, height: 27, marginHorizontal: 7,},
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040404',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
 tintContainer : {
  flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.50)'
 },
  songDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  songTitleText: {
    color: '#FFFFFF',
    fontSize: 18,
   fontFamily : 'GothamRoundedMedium',
    textAlign: 'center',

    marginBottom: 5,
  },
  songAlbumText: {
    color: '#d3d3d3',
    fontSize: 16,
    fontFamily : 'GothamMedium',
    
   
  },
  durationText : {
    color: '#d3d3d3',
    fontSize : 14,
    fontFamily : 'GothamRoundedMedium',
    alignSelf : 'baseline'
  },
  seekBar: {
    
    width: '100%',
    height: 30,
    // marginTop: 10,
    // alignSelf : 'baseline',
    // backgroundColor : 'red'
  },
  controlsContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
 
 
  },
  playButton: {
   
  },
  controlIcon: {
    width : 30,
    height : 30,
   
    resizeMode : 'cover',
  
  },
});