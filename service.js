import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {Event, State} from 'react-native-track-player';

let wasPausedByDuck = false;

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemoteDuck, async (e) => {
    if (e.permanent === true) {
      TrackPlayer.pause();
    } else {
      if (e.paused === true) {
        const playerState = await TrackPlayer.getState();
        wasPausedByDuck = playerState !== State.Paused;
        TrackPlayer.pause();
      } else {
        if (wasPausedByDuck === true) {
          TrackPlayer.play();
          wasPausedByDuck = false;
        }
      }
    }
  });
  // TrackPlayer.addEventListener(Event.PlaybackState, async (state) => {
  //   //your other logic here
  //   console.log(state);
  //   // await AsyncStorage.setItem(CURRENT_STATE, JSON.stringify(state));
  // });

  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    try {
      await TrackPlayer.play();
    } catch (_) {}
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    try {
      await TrackPlayer.pause();
    } catch (_) {}
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (_) {}
  });
  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    try {
      // await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (_) {}
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (_) {}
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => {
    TrackPlayer.seekTo(e.position);
  });
};
