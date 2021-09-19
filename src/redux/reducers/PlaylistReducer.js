const initialState = {
  id: '',
  currentPlaylist: {},
  downloadQueue: [],
  currentDownloading: null,
  downloadPercent: 0,
};

export const playlist = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_PLAYLIST':
      return {
        ...state,
        id: action.payload,
      };
    case 'ADD_NEW_PLAYLIST':
      //   console.log(action.payload);

      return {
        ...state,
        currentPlaylist: action.payload,
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
      return {
        ...state,
        downloadQueue: newArr,
      };
    case 'UPDATE_DOWNLOADED':
      const {path, duration, id} = action.payload;
      const updatedTracks = [...state.currentPlaylist.tracks].map((item) =>
        item.id === id
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
    case 'REMOVE_FROM_DOWNLOAD_QUEUE':
      const reducedArr = [...state.downloadQueue];
      reducedArr.shift();
      return {
        ...state,
        downloadQueue: reducedArr,
      };

    case 'SET_CURRENT_DOWNLOADING':
      return {
        ...state,
        currentDownloading: action.payload,
      };
    case 'SET_DOWNLOAD_PERCENT':
      return {
        ...state,
        downloadPercent: action.payload,
      };
    // case 'DOWNLOAD_ONE' : {
    //    const newState = state.map((item) => item.id === action.payload.id ? {...item, downloaded : true, path : action.path}  : item  )
    //    return newState;
    // }
    default:
      return state;
  }
};

export const downloadSong = (state = {}, action) => {
  switch (action.type) {
    case 'DOWNLOAD':
      return {
        ...state,
        downloaded: true,
        path: action.path,
      };
    default:
      return state;
  }
};
