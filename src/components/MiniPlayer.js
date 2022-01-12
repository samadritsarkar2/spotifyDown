import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Capability,
  Event,
  State,
} from 'react-native-track-player';

import {useDispatch} from 'react-redux';

import {windowHeight} from '../common';
import TextTicker from 'react-native-text-ticker';
import {useNavigation} from '@react-navigation/native';

const MiniPlayer = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackAlbum, setTrackAlbum] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  // const dispatch = useDispatch();
  const navigation = useNavigation();

  const playbackState = usePlaybackState();

  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
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
      compactCapabilities: [
        Capability.Play,
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      icon: require('../assets/notification_icon.png'),
    });

    // await TrackPlayer.add(queue);

    return true;
  };

  //initialize the TrackPlayer when the App component is mounted
  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
      //console.log(playbackState )
    };

    startPlayer();

    return async () => {
      TrackPlayer.destroy();
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
        const {title, artist, album} = track || {};
        // {
        //   title: 'Play something 🎶',
        //   artist: 'Go to Library->',
        //   album: 'Downloads-> Play a track 🎵',
        // };

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
    <TouchableWithoutFeedback
      onPress={() => {
        // navigation.navigate('Player');
      }}>
      <View style={[styles.box]}>
        <View style={styles.playerView}>
          <View style={styles.trackInfo}>
            {/* <Text style={{color: 'white'}}>
              {trackTitle} {'\u25CF'} {trackArtist}
            </Text> */}

            <TextTicker
              style={{
                color: 'white',
                fontFamily: 'GothamMedium',
                fontWeight: 'bold',
              }}
              duration={8000}
              scroll={false}
              repeatSpacer={150}
              marqueeDelay={100}>
              {trackTitle === '' ? (
                <Text>
                  Play something 🎶{' '}
                  <Text style={{color: 'gray', fontSize: 12}}>
                    {'\u25CF'} Go to Library{'->'} {'\u25CF'} Downloads{'->'}{' '}
                    Select a Playlist 🔖{'->'} Play a track 🎵
                  </Text>
                </Text>
              ) : (
                <Text>
                  {trackTitle}{' '}
                  <Text style={{color: 'gray', fontSize: 12}}>
                    {'\u25CF'} {trackArtist} {'\u25CF'} {trackAlbum}
                  </Text>
                </Text>
              )}
            </TextTicker>
          </View>

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
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: '100%',
    height: windowHeight * 0.065,
    justifyContent: 'center',
    bottom: windowHeight * 0.05,
    paddingVertical: windowHeight * 0.01,
    backgroundColor: '#212326',
    borderTopColor: 'white',
    borderBottomColor: 'black',
    borderWidth: 1,
  },
  playerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackInfo: {
    flex: 1,
    marginStart: 10,
    alignSelf: 'center',
  },
  playerControls: {
    flex: 0.45,
    flexDirection: 'row',
    marginEnd: 20,
    alignSelf: 'center',
  },
  playerIcons: {width: 27, height: 27, marginHorizontal: 7},
});
