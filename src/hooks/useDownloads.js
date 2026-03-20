import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, setStorage } from '../utils/storage';
import { handleUnorganized } from '../redux/actions/downloadsActions';
import { selectDownloadsState } from '../redux/selectors';
import { isExist } from '../utils';

export const useDownloads = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  const downloadsState = useSelector(selectDownloadsState);
  const { playlists, data, isPlaylistView, activePlaylist } = downloadsState;

  const getFileName = async (fn) => {
    try {
      const prevList = await getStorage(`@downloads`);

      if (prevList) {
        prevList.map(async (item) => {
          const exist = await isExist(item);
          if (exist === false) {
            const updatedList = prevList.filter((file) => file.id !== item.id);
            await setStorage(`@downloads`, updatedList);
            fn(updatedList);
          } else {
            fn(prevList);
          }
        });
      }
    } catch (error) {}
  };

  const getPlaylistView = async () => {
    try {
      const prevList = await getStorage(`@playlistView`);

      if (prevList !== null) {
        dispatch({ type: 'LOAD_DATA', payload: prevList });
        let playlistsKey = Object.keys(prevList);

        playlistsKey = playlistsKey.filter(
          (item) => prevList[item].tracks.length !== 0,
        );

        dispatch({ type: 'LOAD_PLAYLISTS', payload: playlistsKey });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const checkForUnorganized = async (result) => {
    const bool = await getStorage('@unorganized');
    result(bool ? true : false);
  };

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      getPlaylistView();
      checkForUnorganized((isDone) => {
        if (!isDone) {
          getFileName((arr) => {
            dispatch(handleUnorganized(arr));
          });
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setLoading(true);
    checkForUnorganized((isDone) => {
      if (!isDone) {
        getFileName((arr) => {
          dispatch(handleUnorganized(arr));
        });
      }
    });
    setTimeout(() => {
      getPlaylistView();
    }, 500);
  };

  return {
    loading,
    playlists,
    data,
    isPlaylistView,
    activePlaylist,
    onRefresh,
    dispatch
  };
};
