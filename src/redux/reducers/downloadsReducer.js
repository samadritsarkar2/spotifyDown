const initialState = {
  data: null,
  playlists: [],
  isPlaylistView: true,
  activePlaylist: null,
};

export const downloadsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        data: action.payload,
      };
    case 'LOAD_PLAYLISTS':
      return {
        ...state,
        playlists: action.payload,
      };
    case 'SET_ACTIVE_PLAYLIST':
      return {
        ...state,
        activePlaylist: action.payload,
      };
    case 'CLEAR_ACTIVE_PLAYLIST':
      return {
        ...state,
        activePlaylist: null,
      };
    default:
      return state;
  }
};
