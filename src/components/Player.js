import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Capability,
  Event,
  State,
} from 'react-native-track-player';

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
    <View style={{flex: 1, backgroundColor: '#181818'}}>
      <Text style={styles.basicText}>Hello</Text>
      <Image
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  basicText: {
    color: 'white',
    fontSize: 20,
  },
  playerIcons: {width: 27, height: 27, marginHorizontal: 7},
});
