import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  State,
  useProgress
} from 'react-native-track-player';
import Slider from "@react-native-community/slider";
import { windowHeight, windowWidth } from '../common';
import TextTicker from 'react-native-text-ticker';

const Player = ( {onBackPress, trackState, playbackState, togglePlayback, skipToNext, skipToPrevious, seekTo}) => {

  const isPlaying = playbackState === State.Playing;
  

  return (
    <View style={{
      height : windowHeight * 1,
        backgroundColor : '#212326'
      }}>
        <ImageBackground
          source={{uri : trackState.trackArtwork}}
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
                  source={{uri : trackState.trackArtwork}}
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
                   <Text style={styles.songTitleText}>{trackState.trackTitle}</Text>
                   <TextTicker 
                   style={styles.songAlbumText} 
                  
                   >{trackState.trackAlbum}</TextTicker>

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
                        value={trackState.position}
                        maximumValue={trackState.duration}
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
                    <Text style={styles.durationText}>{trackState.positionString}</Text>
                   

                     <Text style={styles.durationText}>{trackState.durationString}</Text>
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