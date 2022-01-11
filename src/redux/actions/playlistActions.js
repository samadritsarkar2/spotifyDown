import {checkData} from '../../utils';

export const addNew = (playlist) => {
  return {
    type: 'NEW_PLAYLIST',
    payload: playlist,
  };
};

export const addNewPlaylist = (playlistData) => {
  return async (dispatch) => {
    // console.log('addNewPlaylist');
    checkData(playlistData.tracks, playlistData.responseInfo.id).then(
      (tracks) => {
        // console.log(tracks);
        dispatch({
          type: 'ADD_NEW_PLAYLIST',
          payload: {tracks, responseInfo: playlistData.responseInfo},
        });
        dispatch({type: 'LOADING_FALSE'});
      },
    );
  };
};

export const addToDownloadQueue = (track) => {
  return async (dispatch, getState) => {
    try {
      // const alreadyThere = getState().playlist.downloadQueue.findIndex(
      //   (item) => item.id === track.id,
      // );

      dispatch({type: 'ADD_TO_DOWNLOAD_QUEUE', payload: track});
      dispatch({
        type: 'SET_CURRENT_DOWNLOADING',
        payload: track,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
