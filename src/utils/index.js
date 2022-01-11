import {DOWNLOAD_PATH} from '../common';

import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isExist = async (single) => {
  const filepath = `${DOWNLOAD_PATH}/${single.title}.mp3`;

  const exists = await RNFS.exists(filepath);
  if (exists) {
    const stats = await RNFS.stat(filepath);

    if (stats.size === 0) {
      RNFS.unlink(filepath);
      return false;
    } else return filepath;
  } else {
    return false;
  }
};

export const checkPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Required to download files',
        message: 'Needs to save the mp3 files',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log('You can use the Storage');
      return true;
    } else {
      //console.log('Storage permission denied');
      return false;
    }
  } catch (error) {
    //console.log(error);
    return false;
  }
};

export const checkExists = async (allDownloadedTracks, single) => {
  try {
    const path = `${DOWNLOAD_PATH}/${single.title}.mp3`;

    if (allDownloadedTracks.includes(single.id)) {
      const exists = await RNFS.exists(path);

      //console.log(exists, path)
      if (exists) {
        const stats = await RNFS.stat(path);

        if (stats.size === 0) {
          RNFS.unlink(path);
          return {...single};
        } else return {...single, downloaded: true, path: path};
      } else {
        return {...single};
      }
    } else {
      return {...single};
    }
  } catch (error) {
    return {...single};
  }
  // console.log(exists)
};

const findIdOfTrack = (track) => {
  return track.id;
};

export const checkData = async (data, playlistId) => {
  let allDownloadedTracks = [];
  try {
    const storedValue = await AsyncStorage.getItem(`@playlistView`);

    const prevList = await JSON.parse(storedValue);

    if (prevList !== null) {
      let playlists = Object.keys(prevList);

      if (playlists.includes(playlistId)) {
        allDownloadedTracks = prevList[playlistId].tracks.map((track) =>
          findIdOfTrack(track),
        );
        // console.log(allDownloadedTracks);
        // allTracks = prevList[playlistId].tracks;
      }
    } else {
    }
  } catch (error) {
    // console.log(error);
  }

  return Promise.all(
    data.map((item) => checkExists(allDownloadedTracks, item)),
  );
};
