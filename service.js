import TrackPlayer from 'react-native-track-player';
module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', async () => {
    try {
      await TrackPlayer.play();
    } catch (_) {}
  });

  TrackPlayer.addEventListener('remote-pause', async () => {
    try {
      await TrackPlayer.pause();
    } catch (_) {}
  });

  TrackPlayer.addEventListener('remote-next', async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (_) {}
  });

  TrackPlayer.addEventListener('remote-previous', async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (_) {}
  });

  TrackPlayer.addEventListener('remote-duck', (e) => {
    console.log(e);
    // if (e.permanent === true) {
    //   TrackPlayer.pause();
    // } else {
    //   if (e.paused === true) TrackPlayer.pause();
    //   else TrackPlayer.play();
    // }
  });

  TrackPlayer.addEventListener('remote-seek', (e) => {
    TrackPlayer.seekTo(e.position);
  });
};
