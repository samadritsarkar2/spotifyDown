const initialState = {
  id: '',
  currentPlaylist: {},
  downloadingArr: [],
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
