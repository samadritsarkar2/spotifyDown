import { updateStorage, setStorage } from '../../utils/storage';
import RNFS from 'react-native-fs';

import {DOWNLOAD_PATH} from '../../common';

export const handleUnorganized = (arr) => {
  return async (dispatch, getState) => {
    await updateStorage(`@playlistView`, (prevList) => {
      const playlists = getState().downloadsReducer.playlists;

      if (playlists.includes('Unorganized')) {
        dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'Unorganized'});
        return prevList;
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

          setStorage('@unorganized', true);
          dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'Unorganized'});
          return updatedData;
        }
        return prevList;
      }
    });
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
