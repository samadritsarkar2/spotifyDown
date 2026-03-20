import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStorage } from '../utils/storage';
import { Vibration, ToastAndroid } from 'react-native';
import allActions from '../redux/actions';
import { isExist } from '../utils';
import { selectActivePlaylist } from '../redux/selectors';

export const useDownloadedTracks = (navigation) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const downloadsState = useSelector((state) => state.downloadsReducer);
  const { data, isPlaylistView } = downloadsState;
  const activePlaylist = useSelector(selectActivePlaylist);

  const confirmTracks = () => {
    data[activePlaylist].tracks.map((item) => {
      isExist(item).then(async (exists) => {
        if (!exists) {
          updateStorage('@playlistView', (prevData) => {
            if (!prevData) return prevData;
            const updatedPlaylistTracks = prevData[activePlaylist].tracks.filter(
              (file) => file.id !== item.id,
            );
            const updatedData = {
              ...prevData,
              [activePlaylist]: {
                ...prevData[activePlaylist],
                tracks: updatedPlaylistTracks,
              },
            };
            dispatch({ type: 'LOAD_DATA', payload: updatedData });
            return updatedData;
          });
        }
      });
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: data[activePlaylist].info.name });
    confirmTracks();
  }, [data]);

  const handleLongPress = (item) => {
    Vibration.vibrate(100);
    setIsVisible(true);
    setSelected(item);
  };

  const handleAddToQueue = (item) => {
    Vibration.vibrate(100);
    ToastAndroid.show(`Added to Queue`, ToastAndroid.SHORT);
    dispatch(allActions.addToQueue(item));
  };

  return {
    selected,
    setSelected,
    isVisible,
    setIsVisible,
    data,
    isPlaylistView,
    activePlaylist,
    confirmTracks,
    handleLongPress,
    handleAddToQueue,
    dispatch,
  };
};
