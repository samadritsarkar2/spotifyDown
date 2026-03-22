import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateStorage } from '../utils/storage';
import Snackbar from 'react-native-snackbar';
import { DOWNLOAD_PATH } from '../common/index';
import { colors, fonts } from '../theme';
import { checkExists, checkPermission, checkData, isExist } from '../utils';
import RNFS from 'react-native-fs';
import { findYTMusicMatch, downloadAudio } from '../common/YouTubeExtractor';
import { selectDownloadQueue, selectCurrentDownloading, selectCurrentPlaylist, selectDownloadPercent } from '../redux/selectors';

const DownloadingHelper = () => {
  const dispatch = useDispatch();
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  
  const downloadQueue = useSelector(selectDownloadQueue);
  const currentDownloading = useSelector(selectCurrentDownloading);
  const currentPlaylist = useSelector(selectCurrentPlaylist);
  const downloadPercent = useSelector(selectDownloadPercent);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const downloadItem = (single, playlistDetails) => {
    // console.log('Trying to download: ', single.title);

    return new Promise(async (resolve, reject) => {

      const req = checkPermission();
      const fileStatus = await isExist(single);
      // console.log(fileStatus);
      if (req) {
        let videoId;
        let duration;
        if (!single.customDownloadData) {
          try {
            // Step 1: Search YT Music for matching video (on-device)
            const artistNames = single.artist.map(a => a.name);
            const match = await findYTMusicMatch(single.title, artistNames, single.duration);
            if (!match || !match.videoId) { throw new Error('No match found'); }
            videoId = match.videoId;
            duration = match.duration;
          } catch (e) {
            console.error(e);
            dispatch({
              type: 'SET_DOWNLOAD_PERCENT',
              payload: 0,
            });
            dispatch({
              type: 'REMOVE_FROM_DOWNLOAD_QUEUE',
              payload: single,
            });
            dispatch({
              type: 'REMOVE_CURRENT_DOWNLOADING',
              payload: single,
            });
            Snackbar.show({
              text: `Pardon! Unable to find on YouTube Music`,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
            reject(e);
            return;
          }
        } else {
          // Custom download: user already picked a video
          videoId = single.customDownloadData.videoId;
          duration = single.customDownloadData.duration;
        }

        if (videoId) {
          const path = `${DOWNLOAD_PATH}/${single.title}.mp3`;

          if (fileStatus && !single.customDownloadData) {
            // File already exists — skip download
            try {
              const newDownload = {
                id: single.id,
                title: single.title,
                artist: single.artist.map(i => i.name).join(","),
                album: single.album,
                artwork: single.artwork,
                url: fileStatus,
                duration: duration,
              };

              await updateStorage('@playlistView', (prevList) => {
                const playlistId = playlistDetails.id;
                if (!prevList) {
                  Snackbar.show({
                    text: 'First Track added to Downloads',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.accent.primary,
                    fontFamily: fonts.heading
                  });
                  return {
                    [playlistId]: {
                      info: {
                        id: playlistId,
                        name: playlistDetails.name,
                        image: playlistDetails.image,
                      },
                      tracks: [newDownload],
                    },
                  };
                } else {
                  let newList = { ...prevList };
                  if (playlistId in prevList) {
                    newList[playlistId].tracks.push(newDownload);
                  } else {
                    newList = {
                      ...newList,
                      [playlistId]: {
                        info: {
                          id: playlistId,
                          name: playlistDetails.name,
                          image: playlistDetails.image,
                        },
                        tracks: [newDownload],
                      },
                    };
                  }
                  Snackbar.show({
                    text: 'Track added to Downloads',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.accent.primary,
                    fontFamily: fonts.heading
                  });
                  return newList;
                }
              });
              dispatch({ type: 'UPDATE_DOWNLOADED', payload: { track: single, path, duration } });
              dispatch({ type: 'REMOVE_FROM_DOWNLOAD_QUEUE', payload: single });
              dispatch({ type: 'REMOVE_CURRENT_DOWNLOADING', payload: single });
              resolve();
              dispatch({ type: 'SET_DOWNLOAD_PERCENT', payload: 0 });
            } catch (err) {
              console.log(err);
              reject(err);
            }
          } else {
            // Download audio using native OkHttp (proper headers, no throttling)
            try {
              const result = await downloadAudio(videoId, path, (progress) => {
                dispatch({ type: 'SET_DOWNLOAD_PERCENT', payload: progress.percent != null ? progress.percent : 0 });
                if (progress.contentLength != null && progress.contentLength > 0) {
                  let size = formatBytes(progress.contentLength);
                  dispatch({ type: 'SET_DOWNLOAD_SIZE', payload: size });
                }
              });

              if (result && result.size > 0) {
                const newDownload = {
                  id: single.id,
                  title: single.title,
                  artist: single.artist.map(i => i.name).join(", "),
                  album: single.album,
                  artwork: single.artwork,
                  url: path,
                  duration: duration,
                };

                await updateStorage('@playlistView', (prevList) => {
                  const playlistId = playlistDetails.id;
                  if (!prevList) {
                    Snackbar.show({
                      text: 'First Track added to Downloads',
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: colors.accent.primary,
                      fontFamily: fonts.heading
                    });
                    return {
                      [playlistId]: {
                        info: {
                          id: playlistId,
                          name: playlistDetails.name,
                          image: playlistDetails.image,
                        },
                        tracks: [newDownload],
                      },
                    };
                  } else {
                    let newList = { ...prevList };
                    if (playlistId in prevList) {
                      newList[playlistId].tracks.push(newDownload);
                    } else {
                      newList = {
                        ...newList,
                        [playlistId]: {
                          info: {
                            id: playlistId,
                            name: playlistDetails.name,
                            image: playlistDetails.image,
                          },
                          tracks: [newDownload],
                        },
                      };
                    }
                    Snackbar.show({
                      text: 'Track added to Downloads',
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: colors.accent.primary,
                      fontFamily: fonts.heading
                    });
                    return newList;
                  }
                });
                dispatch({ type: 'UPDATE_DOWNLOADED', payload: { track: single, path, duration } });
                dispatch({ type: 'REMOVE_FROM_DOWNLOAD_QUEUE', payload: single });
                dispatch({ type: 'REMOVE_CURRENT_DOWNLOADING', payload: single });
                resolve();
                dispatch({ type: 'SET_DOWNLOAD_PERCENT', payload: 0 });
              } else {
                dispatch({ type: 'SET_DOWNLOAD_PERCENT', payload: 0 });
                dispatch({ type: 'REMOVE_FROM_DOWNLOAD_QUEUE', payload: single });
                dispatch({ type: 'REMOVE_CURRENT_DOWNLOADING', payload: single });
                Snackbar.show({
                  text: `Pardon! Could not download ${single.title}. Try the Custom Downloader.`,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                  fontFamily: fonts.body,
                });
                reject('Download error');
              }
            } catch (err) {
              console.log('Download error: ', err);
              dispatch({ type: 'SET_DOWNLOAD_PERCENT', payload: 0 });
              dispatch({ type: 'REMOVE_FROM_DOWNLOAD_QUEUE', payload: single });
              dispatch({ type: 'REMOVE_CURRENT_DOWNLOADING', payload: single });
              Snackbar.show({
                text: `Pardon! Download failed, please try again`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
              reject(err);
            }
          }
        } else {
          dispatch({
            type: 'SET_DOWNLOAD_PERCENT',
            payload: 0,
          });

          dispatch({
            type: 'REMOVE_FROM_DOWNLOAD_QUEUE',
            payload: single,
          });
          dispatch({
            type: 'REMOVE_CURRENT_DOWNLOADING',
            payload: single,
          });

          Snackbar.show({
            text: 'Could not fetch proper link from server',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
          reject('Could not fetch proper link from server');
        }
      } else {
        Alert.alert(
          'Storage Permission Denied',
          'Unable to save',
          [{ text: 'OK', onPress: () => { } }],
          { cancelable: false },
        );
        reject('Storage Permission Denied');
      }
    });
  };

  useEffect(() => {
    // console.log(downloadQueue);
    const workerFn = async () => {
      if (downloadQueue.length > 0 && !isExecutingTask) {
        setIsExecutingTask(true);
        const item = downloadQueue[0];
        try {
          await downloadItem(item, currentPlaylist.responseInfo);
        } catch (err) { }

        setIsExecutingTask(false);
      }
    };
    workerFn();
  }, [downloadQueue, isExecutingTask]);

  // Download progress is now shown in MiniPlayer — no visible UI here
  return null;
};

export default DownloadingHelper;
