import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlaylistState } from '../redux/selectors';
import { addNewPlaylist, addToDownloadQueue } from '../redux/actions/playlistActions';
import { ENDPOINTS } from '../common/api';
import Snackbar from 'react-native-snackbar';
import { updateStorage } from '../utils/storage';
import { colors, fonts } from '../theme';

export const usePlaylist = (navigation, isFocused) => {
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);

  const URlID = useSelector(selectPlaylistState).id;
  const dispatch = useDispatch();

  const state = useSelector(selectPlaylistState);
  const { responseInfo, tracks } = state.currentPlaylist || { responseInfo: {}, tracks: [] };
  const { loading, currentDownloading, downloadQueue } = state;

  const fetchData = async () => {
    try {
      let api = ENDPOINTS.redirect(URlID);
      const response = await fetch(api, {
        method: 'GET',
        headers: {},
      });
      if (response.status === 200) {
        response
          .json()
          .then((res) => {
            dispatch(addNewPlaylist(res));
          })
          .catch((err) => {
            setError(true);
            navigation.navigate('Error', { error: true });
          });
      } else {
        setError(true);
        navigation.navigate('Error', { error: true });
      }
    } catch (error) {
      setTimeout(() => {
        navigation.goBack();
        Snackbar.show({
          text: 'Internet connection is required to fetch playlist',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (isFocused) {
      dispatch({ type: 'LOADING_TRUE' });
      fetchData();
    }
  }, [isFocused]);

  const handleDownload = (item) => {
    dispatch(addToDownloadQueue(item));
  };

  const downloadAll = async () => {
    tracks.map((item) => {
      if (!item.downloaded) {
        setTimeout(() => {
          handleDownload(item);
        }, 500);
      }
    });
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAll();
      savePlaylist();
    } catch (error) {
      console.error(error);
    }
  };

  const savePlaylist = async () => {
    if (responseInfo.saved === false) {
      try {
        const playlistToAdd = {
          id: responseInfo.id,
          name: responseInfo.name,
          image: responseInfo.image,
        };

        await updateStorage('@saved_playlists', (prevList) => {
          if (!prevList) {
            Snackbar.show({
              text: 'First Playlist added to Library',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.accent.primary,
            });
            dispatch({ type: 'SAVE_PLAYLIST' });
            return [playlistToAdd];
          }

          const exists = prevList.some((item) => item.id === responseInfo.id);
          if (!exists) {
            Snackbar.show({
              text: 'Playlist added to Library',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.accent.primary,
              fontFamily: fonts.heading
            });
            dispatch({ type: 'SAVE_PLAYLIST' });
            return [...prevList, playlistToAdd];
          } else {
            Snackbar.show({
              text: 'Playlist already exists in Library',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
              fontFamily: fonts.body
            });
            dispatch({ type: 'SAVE_PLAYLIST' });
            return prevList; // No change
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCustomDownload = () => {
    setIsVisible(false);
    navigation.navigate('CustomDownload');
    dispatch({ type: 'SET_CUSTOM_ITEM', payload: selected });
  };

  return {
    error,
    selected,
    setSelected,
    isVisible,
    setIsVisible,
    downloadPercent,
    responseInfo,
    tracks,
    loading,
    currentDownloading,
    downloadQueue,
    handleDownload,
    handleDownloadAll,
    savePlaylist,
    handleCustomDownload
  };
};
