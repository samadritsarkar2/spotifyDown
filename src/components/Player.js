import React, {useState} from 'react';
import {Image, ImageBackground, Slider, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Capability,
  Event,
  State,
} from 'react-native-track-player';
import { windowHeight, windowWidth } from '../common';

export default function Player() {
  const [trackTitle, setTrackTitle] = useState('');
  const [trackAlbum, setTrackAlbum] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackArt, setTrackArt] = useState('');
  const playbackState = usePlaybackState();

  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackState],
    async (event) => {
      // console.log(event);
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title, artist, album, artwork} = track || {};
        // {
        //   title: 'Play something 🎶',
        //   artist: 'Go to Library->',
        //   album: 'Downloads-> Play a track 🎵',
        // };
        // console.log(track);
        setTrackArt(artwork);
        setTrackTitle(title);
        setTrackArtist(artist);
        setTrackAlbum(album);
      }
      if (event.type === Event.PlaybackState && event.state === State.Stopped) {
        setTrackTitle('');
        setTrackArtist('');
        setTrackAlbum('');
      }
    },
  );

  const togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    // console.log(await TrackPlayer.getQueue());
    if (currentTrack == null) {
      // await TrackPlayer.reset();
      // await TrackPlayer.play();
    } else {
      if (playbackState === State.Paused) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
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

  return (
    <View style={{
      height : windowHeight * 1,
        backgroundColor : '#212326'
      }}>
        <View style={{
          flex : 1,
          flexDirection : 'column',
          marginHorizontal : windowWidth  * 0.025,
          justifyContent : 'center',
         
        }}>
              <View style={{
                flex : 0.33,
                    // height : windowHeight * 0.1,
                   
            
                 }}>
                   <Text style={{
                    color : 'white'
                   }} > Teri Jhuki Nazar</Text>
            </View>

            <View style={{
                    flex : 3,
                 }}>
                 <Image 
                  source={{uri : "https://i.scdn.co/image/ab67616d0000b2737e25e913e1df98dbec43e4a2"}}
                  style={{
                    flex: 1,
                    width: undefined,
                    height: undefined,
                    resizeMode:'cover'
                  }}
                 />
                 
            </View>

            <View
                style={{
                  flex : 1, 
                  alignItems : 'center',
             
                }}
            >
                   <Text style={styles.songTitleText} > Teri Jhuki Nazar</Text>
                   <Text style={styles.songAlbumText} > Murder 3</Text>

            </View>

            <View
            style={{
              flex : 1,
              width : '100%'
            }}
            >
 <Slider
        style={styles.seekBar}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="white"
        maximumTrackTintColor="gray"
        thumbTintColor="white"
        value={50}
      />
            </View>

            <View style={{
                    flex : 1,
                    flexDirection : 'row',
                    justifyContent : 'space-evenly',
                    alignItems : 'center',
                    
                    marginBottom : windowHeight * 0.05,

                 }}>
            <TouchableOpacity style={styles.controlButton}>
                  <Image
                    style={styles.controlIcon}
                    source={require('../assets/previous.png')}
                  />
            </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.playButton]}>
              <Image
                style={styles.controlIcon}
                source={require('../assets/play.png')}
              />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Image
            style={styles.controlIcon}
            source={require('../assets/next.png')}
          />
        </TouchableOpacity>
            </View>
        </View>
    



        
{/*       
      <ImageBackground
    style={{flex: 1}}
          source={{ uri: 'https://i.scdn.co/image/ab67616d0000b2737e25e913e1df98dbec43e4a2' }}
          blurRadius={1}
       >

      


      <View style={styles.songDetailsContainer}>
        <Text style={styles.songTitle}>Song Title</Text>
        <Text style={styles.songArtist}>Artist Name</Text>
      </View>


       <View style={styles.seekBarContainer}>
       <Slider
        style={styles.seekBar}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor="#1DB954"
        value={50}
      />
      </View>


  
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Image
            style={styles.controlIcon}
            source={require('../assets/previous.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.playButton]}>
          <Image
            style={styles.controlIcon}
            source={require('../assets/play.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Image
            style={styles.controlIcon}
            source={require('../assets/next.png')}
          />
        </TouchableOpacity>
      
    </View>
    </ImageBackground>
 */}


      {/* <Image old
        source={{uri: trackArt, height: 200, width: 200}}
        style={{height: 200, width: 200}}
      />
      <Text style={styles.basicText}>{trackTitle}</Text>
      <Text style={styles.basicText}>{trackAlbum}</Text>
      <TouchableOpacity
        style={{backgroundColor: 'red', height: 100, width: 100}}
        onPress={async () => {
          console.log(await TrackPlayer.getCurrentTrack());
        }}>
        <Text>Click me</Text>
      </TouchableOpacity>
      <View style={styles.playerControls}>
        <TouchableOpacity onPress={skipToPrevious}>
          <Image
            source={require('../assets/previous.png')}
            style={styles.playerIcons}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayback}>
          <Image
            source={
              playbackState === State.Playing
                ? require('../assets/pause.png')
                : require('../assets/play-button.png')
            }
            style={[styles.playerIcons]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <Image
            source={require('../assets/next.png')}
            style={styles.playerIcons}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

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
  albumCoverContainer: {
    flex: 6,
    justifyContent: 'center',
  },
  albumCover: {
    width: '100%',
    height: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    zIndex :-1
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
   fontFamily : 'GothamRoundedBook',
    textAlign: 'center',

    marginBottom: 5,
  },
  songAlbumText: {
    color: '#B3B3B3',
    fontSize: 18,
    textAlign: 'center',
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
    width : 48,
    height : 48,
   
    resizeMode : 'cover',
  
  },
});