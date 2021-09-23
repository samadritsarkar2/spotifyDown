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
      // const alreadyExist = queue.some((item) => item.id === track.id);
      const findIndex = queue.findIndex((item) => item.id === track.id);
      // console.log(findIndex);
      if (findIndex !== -1) {
        await TrackPlayer.skip(findIndex);
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

export const shufflePlay = (currentPlaylist) => {
  return async (dispatch, getState) => {
    function shuffle(array) {
      // console.log('Shuffle Arr');

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
    const prevShuffle = getState().downloadsReducer.shufflePlaylist;
    dispatch({type: 'SET_SHUFFLE_PLAYLIST', payload: currentPlaylist});

    const tracks = getState().downloadsReducer.data[currentPlaylist].tracks;
    const shuffledTracks = shuffle(tracks);

    if (prevShuffle === null) {
      console.log('Null case');

      try {
        await TrackPlayer.add(shuffledTracks);
        await TrackPlayer.play();
      } catch (error) {
        console.log(err);
      }
    } else if (
      prevShuffle !== currentPlaylist ||
      prevShuffle === currentPlaylist
    ) {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add(shuffledTracks);
        await TrackPlayer.play();
        // console.log(await TrackPlayer.getQueue());
      } catch (error) {}
    }
    // else if () {
    //   try {
    //     await TrackPlayer.reset();
    //     await TrackPlayer.add(shuffledTracks);
    //     await TrackPlayer.play();
    //     // console.log(await TrackPlayer.getQueue());
    //   } catch (error) {}
    // }
  };
};
