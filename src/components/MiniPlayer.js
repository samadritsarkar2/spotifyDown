import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Capability,
  Event,
  State,
  AppKilledPlaybackBehavior,
  useProgress
} from 'react-native-track-player';

import {useDispatch, useSelector} from 'react-redux';

import {windowHeight} from '../common';
import TextTicker from 'react-native-text-ticker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Player from './Player';
import Slider from '@react-native-community/slider';
import { setPlayerActive, setPlayerClosed } from '../redux/actions/playerActions';

const MiniPlayer = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackAlbum, setTrackAlbum] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackDuration, setTrackDuration] = useState(0);
  const [trackArtwork, setTrackArtwork] = useState('');
  const [positionString, setPositionString] = useState('');
  const [durationString, setDurationString] = useState('');

  // const [isPlayerActive, setIsPlayerActive] = useState(false);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const playbackState = usePlaybackState();
  const { position, buffered, duration } = useProgress(10);
 

  const store = useSelector(state => state).player;
  const { trackInfo : {title, artist, album, artwork}, isPlayerActive} = store;

  const trackPlayerInit = async () => {
  
  try {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      android : {
appKilledPlaybackBehavior : AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
      },
      alwaysPauseOnInterruption: false,
      capabilities: [
        Capability.Play,
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      
      ],
      notificationCapabilities : [
        Capability.Play,
        Capability.Stop,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Stop,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      icon: require('../assets/notification_icon.png')
    });

    // await TrackPlayer.add(queue);

    return true;
  } catch (error) {
    
  }
  
  };

  //initialize the TrackPlayer when the App component is mounted
  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);

    };

    startPlayer();

    return () => {
      try { TrackPlayer.reset(); 
          dispatch(setPlayerClosed());  
          dispatch({
            type : "CLEAR_TRACK_INFO",
          })
      } catch(_){};
    };
  }, []);




  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackState],
    async (event) => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title, artist, album, duration, artwork} = track || {};
        // {
        //   title: 'Play something 🎶',
        //   artist: 'Go to Library->',
        //   album: 'Downloads-> Play a track 🎵',
        // };
      

        dispatch({
          type : 'SET_TRACK_INFO',
          payload : {
            trackInfo : {
              ...track
            }
          }
        })

      }
      if (event.type === Event.PlaybackState && event.state === State.Stopped) {
        
        // setTrackTitle('');
        // setTrackArtist('');
        // setTrackAlbum('');
        // setTrackDuration(0);
        // setTrackArtwork('');
        // console.log(navigation.getState());

        // dispatch(setPlayerClosed());
        dispatch({
          type : "CLEAR_TRACK_INFO",
        })
        
      }
    },
  );

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

    const activatePlayer = () => {
      if(title && album)
      {

        dispatch(setPlayerActive());
  
        navigation.navigate({
          name : 'Player'
        });
      }

    }


  return (

    <>
        {!store.isPlayerActive ?  
        <TouchableWithoutFeedback
      onPress={() => activatePlayer()}>
      <View style={[styles.box]}>
     
      
        <View style={styles.playerView}>
          
          <View style={styles.trackInfo}>
            {/* <Text style={{color: 'white'}}>
              {trackTitle} {'\u25CF'} {trackArtist}
            </Text> */}

{/* <TextTicker
              style={{
                color: 'white',
                fontFamily: 'GothamMedium',
                fontWeight: 'bold'
              }}
          
              // duration={8000}
              // scroll={false}
              // // scrollSpeed={300}
              // repeatSpacer={150}
              // bounce={false}
      
              >
Play something 🎶{' '} {'\u25CF'} 
        <Text>Go to Library{'->'} {'\u25CF'} Downloads{'->'}{' '}
                    Select a Playlist 🔖{'->'} Play a track 🎵</Text>
                </TextTicker> */}

            <TextTicker
              style={{
                color: 'white',
                fontFamily: 'GothamMedium',
                fontWeight: 'bold'
              }}
          
              duration={8000}
              scroll={false}
              repeatSpacer={150}
              marqueeDelay={100}
      
              >
              {title === '' ? (
                <Text style={{...styles.trackInfoText, color : 'white'}} >
                  Tap here to open NEW Player 🎶{' '} 
                  <Text style={styles.trackInfoText}>
                    {'\u25CF'} Go to Library{'->'} {'\u25CF'} Downloads{'->'}{' '}
                    Select a Playlist 🔖{'->'} Play a track 🎵
                  </Text>
                </Text>
              ) : (
                <Text style={{...styles.trackInfoText, color : 'white'}}>
                  {title}{' '}
                  <Text style={styles.trackInfoText}>
                    {'\u25CF'} {artist} {'\u25CF'} {album}
                  </Text>
                </Text>
              )}
            </TextTicker>
          </View>

          <View style={styles.playerControls}>
            <TouchableOpacity onPress={skipToPrevious} style={styles.playerIconsTouchable}>
              <Image
                source={require('../assets/previous.png')}
                style={styles.playerIcons}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayback} style={styles.playerIconsTouchable}>
              <Image
                source={
                  playbackState === State.Playing
                    ? require('../assets/pause.png')
                    : require('../assets/play.png')
                }
                style={[styles.playerIcons]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext} style={styles.playerIconsTouchable} >
              <Image
                source={require('../assets/next.png')}
                style={styles.playerIcons}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback> : null}
    </>

  
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: '100%',
    height: windowHeight * 0.055,
    justifyContent: 'center',
    bottom: windowHeight * 0.06,
    paddingVertical: windowHeight * 0.01,
    backgroundColor: '#212326',
    borderTopColor: 'white',
    borderBottomColor: 'black',
    borderWidth: 1,
  },
  playerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  trackInfo: {
    flex: 1,
    marginStart: 10,
    alignSelf: 'center',
  },
  trackInfoText : {color: 'gray', fontSize: 13},
  playerControls: {

    flex: 0.5,
    flexDirection: 'row',
    marginEnd: 5,
    alignItems : 'flex-end',
    alignSelf: 'center',
  },
  playerIconsTouchable : {
    flex : 1,
    marginHorizontal : 2,
    marginVertical : 3,
    // backgroundColor : 'red'
  },
  playerIcons: {
    //TODO: Flex
    width : '100%',
    height : '100%',
    aspectRatio : 1/1
  },
});
