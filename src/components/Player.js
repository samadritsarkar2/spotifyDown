import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  State,
  useProgress
} from 'react-native-track-player';
import Slider from "@react-native-community/slider";
import { windowHeight, windowWidth } from '../common';

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
          blurRadius={30}
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
                   justifyContent : 'flex-start',
                   
            
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
                   <Text style={styles.songTitleText} >{trackState.trackTitle}</Text>
                   <Text style={styles.songAlbumText} >{trackState.trackAlbum}</Text>

            </View>

            <View
            style={{
              flex : 1,
              width : '100%',
              flexDirection : 'row'
            }}
            >
              <Text style={styles.songAlbumText}>{trackState.positionString}</Text>
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

          <Text
            style={styles.songAlbumText}
          >{trackState.durationString}</Text>

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
                style={styles.controlIcon}
                source={ 
                  isPlaying
                  ? require('../assets/pause.png')
                  : require('../assets/play.png')
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
        backgroundColor: 'rgba(0,0,0, 0.40)'
 },
  songDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  songTitleText: {
    color: '#FFFFFF',
    fontSize: 20,
   fontFamily : 'GothamRoundedMedium',
    textAlign: 'center',

    marginBottom: 5,
  },
  songAlbumText: {
    color: '#d3d3d3',
    fontSize: 18,
    fontFamily : 'GothamMedium',
   
  },
  seekBar: {
    flex : 1,
    width: '100%',
    height: 30,
    marginTop: 10,
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
    width : 35,
    height : 35,
   
    resizeMode : 'cover',
  
  },
});