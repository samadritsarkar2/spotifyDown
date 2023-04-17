import TrackPlayer, {} from 'react-native-track-player';

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
        // const playIndex = queue.findIndex((item) => item.id === track.id);

        await TrackPlayer.add(track);

        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
      }
    }

    // dispatch(addToPlayer(track));
  };
};

export const addToQueue = (track) => {
  return async (dispatch) => {
    await TrackPlayer.add(track);


    await TrackPlayer.play();
    

  };
};

export const shufflePlay = (currentPlaylist) => {
  return async (dispatch, getState) => {
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    const prevShuffle = getState().downloadsReducer.shufflePlaylist;
    dispatch({type: 'SET_SHUFFLE_PLAYLIST', payload: currentPlaylist});

    const tracks = getState().downloadsReducer.data[currentPlaylist].tracks;
    const shuffledTracks = shuffle(tracks);

    if (prevShuffle === null) {
      // console.log('Null case');

      try {
        await TrackPlayer.add(shuffledTracks);
        await TrackPlayer.play();
      } catch (error) {
        // console.log(err);
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
  };
};

export const setPlayerActive = () => {
  return {
    type : 'SET_PLAYER_ACTIVE'
  }
}

export const setPlayerClosed = () => {
  return {
    type : 'SET_PLAYER_CLOSED'
  }
}