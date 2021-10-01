const initialState = {
  id: '',
  currentPlaylist: {},
  downloadQueue: [],
  currentDownloading: [],
  downloadPercent: 0,
  loading: true,
};

export const playlist = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_PLAYLIST':
      return {
        ...state,
        id: action.payload,
      };
    case 'ADD_NEW_PLAYLIST':
      // console.log(action.payload);

      return {
        ...state,
        currentPlaylist: {
          responseInfo: action.payload.responseInfo,
          tracks: action.payload.tracks,
        },
      };

    case 'SAVE_PLAYLIST':
      return {
        ...state,
        currentPlaylist: {
          ...state.currentPlaylist,
          responseInfo: {
            ...state.currentPlaylist.responseInfo,
            saved: true,
          },
        },
      };
    case 'ADD_TO_DOWNLOAD_QUEUE':
      const newArr = [...state.downloadQueue];
      newArr.push(action.payload);
      // console.log('Queue:', newArr);

      return {
        ...state,
        downloadQueue: newArr,
      };
    case 'REMOVE_FROM_DOWNLOAD_QUEUE':
      const tempArr = [...state.downloadQueue];
      tempArr.shift();
      return {
        ...state,
        downloadQueue: tempArr,
      };
    case 'UPDATE_DOWNLOADED':
      const {path, duration, track} = action.payload;
      const updatedTracks = [...state.currentPlaylist.tracks].map((item) =>
        item.id === track.id
          ? {
              ...item,
              downloaded: true,
              path: path,
              duration: duration,
            }
          : item,
      );

      return {
        ...state,
        currentPlaylist: {
          ...state.currentPlaylist,
          tracks: updatedTracks,
        },
      };

    case 'SET_CURRENT_DOWNLOADING':
      return {
        ...state,
        currentDownloading: [...state.currentDownloading, action.payload],
      };
    case 'REMOVE_CURRENT_DOWNLOADING':
      let currentDownloadingArr = [...state.currentDownloading].filter(
        (item) => item.id !== action.payload.id,
      );
      // console.log(
      //   'After remove from current downloading : : ',
      //   currentDownloadingArr,
      // );

      return {
        ...state,
        currentDownloading: currentDownloadingArr,
      };
    case 'SET_DOWNLOAD_PERCENT':
      return {
        ...state,
        downloadPercent: action.payload,
      };
    case 'LOADING_TRUE':
      return {
        ...state,
        loading: true,
      };
    case 'LOADING_FALSE':
      return {
        ...state,
        loading: false,
      };
    // case 'DOWNLOAD_ONE' : {
    //    const newState = state.map((item) => item.id === action.payload.id ? {...item, downloaded : true, path : action.path}  : item  )
    //    return newState;
    // }
    default:
      return state;
  }
};
