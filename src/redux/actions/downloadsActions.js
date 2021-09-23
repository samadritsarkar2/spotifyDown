import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleUnorganized = (arr) => {
  return async (dispatch, getState) => {
    const storedValue = await AsyncStorage.getItem(`@playlistView`);

    const prevList = await JSON.parse(storedValue);
    const playlists = getState().downloadsReducer.playlists;
    if ('unorganized' in playlists) {
      console.log('yes');
      dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'unorganized'});
    } else {
      console.log(playlists);
      const updatedData = {
        ...prevList,
        ['unorganized']: {
          info: {
            id: 'unorganized',
            name: 'unorganized',
          },
          tracks: arr,
        },
      };
      await AsyncStorage.setItem(`@playlistView`, JSON.stringify(updatedData));
      dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'unorganized'});
    }
  };
};
