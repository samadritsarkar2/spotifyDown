import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

import {DOWNLOAD_PATH} from '../../common';

export const handleUnorganized = (arr) => {
  return async (dispatch, getState) => {
    const storedValue = await AsyncStorage.getItem(`@playlistView`);

    const prevList = await JSON.parse(storedValue);
    const playlists = getState().downloadsReducer.playlists;

    if (playlists.includes('Unorganized')) {
      // console.log('yes');
      dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'Unorganized'});
    } else {
      if (arr.length !== 0) {
        const updatedData = {
          ...prevList,
          ['Unorganized']: {
            info: {
              id: 'Unorganized',
              name: 'Unorganized',
            },
            tracks: arr,
          },
        };
        // console.log(updatedData.Unorganized);

        await AsyncStorage.setItem(
          `@playlistView`,
          JSON.stringify(updatedData),
        );
        await AsyncStorage.setItem('@unorganized', JSON.stringify(true));
        dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'Unorganized'});
      }
    }
  };
};

export const deleteTrack = (track) => {
  return async (dispatch) => {
    try {
      const filepath = `${DOWNLOAD_PATH}/${track.title}.mp3`;
      RNFS.unlink(filepath);
    } catch (error) {}
  };
};
