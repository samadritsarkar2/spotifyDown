import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleUnorganized = (arr) => {
  return async (dispatch, getState) => {
    const storedValue = await AsyncStorage.getItem(`@playlistView`);

    const prevList = await JSON.parse(storedValue);
    const playlists = getState().downloadsReducer.playlists;
    if ('Unorganized' in playlists) {
      console.log('yes');
      dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'unorganized'});
    } else {
      console.log(playlists);
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
      await AsyncStorage.setItem(`@playlistView`, JSON.stringify(updatedData));
      dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: 'Unorganized'});
    }
  };
};
