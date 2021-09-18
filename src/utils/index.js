import {DOWNLOAD_PATH} from '../common';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';

export const isExist = async (single) => {
  const filepath = `${DOWNLOAD_PATH}/${single.title}.mp3`;
  const exists = await RNFetchBlob.fs.exists(filepath);
  if (exists) {
    const stats = await RNFetchBlob.fs.stat(filepath);

    if (stats.size === 0) {
      RNFetchBlob.fs.unlink(filepath);
      return false;
    } else return true;
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

export const checkExists = async (single) => {
  // const path = `${RNBackgroundDownloader.directories.documents}/${playlistData.playlistId}/${single.name}.mp3`;
  const path = `${RNBackgroundDownloader.directories.documents}/${single.title}.mp3`;
  const exists = await RNFetchBlob.fs.exists(path);

  //console.log(exists, path)
  if (exists) {
    const stats = await RNFetchBlob.fs.stat(path);

    if (stats.size === 0) return {...single};
    else return {...single, downloaded: true, path: path};
  } else {
    return {...single};
  }

  // console.log(exists)
};

export const checkData = (data) => {
  return Promise.all(data.map((item) => checkExists(item)));
};
