import TrackPlayer from 'react-native-track-player';

export const addToPlayer = (queue) => {
  return {
    type: 'ADD_TO_PLAYER',
    payload: queue,
  };
};

export const playOne = (track) => {
  return async (dispatch) => {
    let queue = await TrackPlayer.getQueue();
    if (queue.length === 0) {
      await TrackPlayer.add(track);
      await TrackPlayer.play();
    } else {
      const alreadyExist = queue.some((item) => item.id === track.id);
      if (alreadyExist) {
        await TrackPlayer.skip(track.id);
        await TrackPlayer.play();
      } else {
        await TrackPlayer.add(track);
        await TrackPlayer.skip(track.id);
      }
    }

    dispatch(addToPlayer(track));
  };
};

export const addToQueue = (track) => {
  return async (dispatch) => {
    await TrackPlayer.add(track);
  };
};

export const shufflePlay = (tracks) => {
  return async (dispatch) => {
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }
    const shuffledTracks = shuffle(tracks);
    await TrackPlayer.add(shuffledTracks);
  };
};
