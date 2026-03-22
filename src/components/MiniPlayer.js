import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
  Vibration,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Capability,
  Event,
  State,
  AppKilledPlaybackBehavior,
  useProgress,
} from 'react-native-track-player';

import {useDispatch, useSelector} from 'react-redux';
import { selectPlayerState, selectDownloadQueue, selectDownloadPercent } from '../redux/selectors';

import { windowHeight} from '../common';
import { colors, fonts, fontSize as themeFontSize, spacing, radii } from '../theme';
import TextTicker from 'react-native-text-ticker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Player from './Player';
import Slider from '@react-native-community/slider';
import {setPlayerActive, setPlayerClosed} from '../redux/actions/playerActions';
import Snackbar from 'react-native-snackbar';

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
  const {position, buffered, duration} = useProgress(10);

  const store = useSelector(selectPlayerState);
  const {
    trackInfo: {title, artist, album, artwork},
    isPlayerActive,
  } = store;

  const downloadQueue = useSelector(selectDownloadQueue);
  const downloadPercent = useSelector(selectDownloadPercent);
  const isDownloading = downloadQueue.length > 0;

  const trackPlayerInit = async () => {
    try {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
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
        notificationCapabilities: [
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
        icon: require('../assets/notification_icon.png'),
      });

      // await TrackPlayer.add(queue);

      return true;
    } catch (error) {}
  };

  //initialize the TrackPlayer when the App component is mounted
  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };

    startPlayer();

    return () => {
      try {
        TrackPlayer.reset();
        dispatch(setPlayerClosed());
        dispatch({
          type: 'CLEAR_TRACK_INFO',
        });
      } catch (_) {}
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
          type: 'SET_TRACK_INFO',
          payload: {
            trackInfo: {
              ...track,
            },
          },
        });
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
          type: 'CLEAR_TRACK_INFO',
        });
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
    } catch (_) {}
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
    } catch (_) {}
  };

  const activatePlayer = () => {
    if (title && album) {
      dispatch(setPlayerActive());

      navigation.navigate({
        name: 'Player',
      });
    } else {
      Vibration.vibrate(100);
      Snackbar.show({
        text: 'Play a track and tap here to reveal the Player',
        backgroundColor: colors.accent.primary,
        duration: Snackbar.LENGTH_SHORT,
        fontFamily: fonts.heading,
      });
    }
  };

  return (
    <>
      {!store.isPlayerActive ? (
        <View style={styles.box}>
          {isDownloading && (
            <View style={styles.downloadProgressBar}>
              <View style={[styles.downloadProgressFill, { width: `${Math.max(0, Math.min(downloadPercent, 100))}%` }]} />
            </View>
          )}
          <View style={styles.playerView}>
            {isDownloading && (
              <TouchableOpacity
                style={styles.downloadBadge}
                onPress={() => navigation.navigate('LibraryStack', { screen: 'DownloadQueue', initial: false })}>
                <Image source={require('../assets/down.png')} style={styles.downloadBadgeIcon} />
                <Text style={styles.downloadBadgeText}>{downloadQueue.length}</Text>
              </TouchableOpacity>
            )}
            <TouchableWithoutFeedback onPress={() => activatePlayer()}>
              <View style={styles.playerInner}>
                {artwork ? (
                  <Image source={{ uri: artwork }} style={styles.miniArtwork} />
                ) : null}
                <View style={styles.trackInfo}>
                  {title ? (
                    <TextTicker
                      style={styles.miniTitle}
                      duration={8000}
                      scroll={false}
                      repeatSpacer={150}
                      marqueeDelay={100}>
                      {title}
                      <Text style={styles.trackInfoText}>
                        {' \u25CF '}{artist}{' \u25CF '}{album}
                      </Text>
                    </TextTicker>
                  ) : (
                    <Text style={styles.miniTitleDimmed}>Not playing</Text>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.playerControls}>
              <TouchableOpacity onPress={skipToPrevious} style={styles.playerIconsTouchable}>
                <Image source={require('../assets/previous.png')} style={styles.playerIcons} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayback} style={styles.playerIconsTouchable}>
                <Image
                  source={playbackState === State.Playing ? require('../assets/pause.png') : require('../assets/play.png')}
                  style={styles.playerIcons}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext} style={styles.playerIconsTouchable}>
                <Image source={require('../assets/next.png')} style={styles.playerIcons} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: '100%',
    bottom: windowHeight * 0.06,
    backgroundColor: colors.bg.secondary,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  downloadProgressBar: {
    height: 3,
    width: '100%',
    backgroundColor: colors.bg.primary,
  },
  downloadProgressFill: {
    height: 3,
    backgroundColor: colors.accent.primary,
  },
  playerView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: windowHeight * 0.065,
    paddingHorizontal: 8,
  },
  playerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.primary,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 8,
  },
  downloadBadgeIcon: {
    width: 14,
    height: 14,
    tintColor: colors.text.primary,
  },
  downloadBadgeText: {
    color: colors.text.primary,
    fontSize: themeFontSize.xs,
    fontFamily: fonts.heading,
    marginLeft: 3,
  },
  miniArtwork: {
    width: 42,
    height: 42,
    borderRadius: 6,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  miniTitle: {
    color: colors.text.primary,
    fontFamily: 'GothamMedium',
    fontSize: themeFontSize.sm + 1,
  },
  miniTitleDimmed: {
    color: colors.text.hint,
    fontFamily: 'GothamMedium',
    fontSize: themeFontSize.sm + 1,
  },
  trackInfoText: { color: colors.text.tertiary, fontSize: themeFontSize.sm },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  playerIconsTouchable: {
    padding: 4,
    marginHorizontal: 2,
  },
  playerIcons: {
    width: 24,
    height: 24,
  },
});
