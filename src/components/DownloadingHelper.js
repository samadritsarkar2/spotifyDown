import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBackgroundDownloader from 'react-native-background-downloader';
import Snackbar from 'react-native-snackbar';
import {DOWNLOAD_PATH} from '../common/index';
import {useDispatch} from 'react-redux';
import {checkExists, checkPermission, checkData} from '../utils';

import {API, NEW_API} from '@env';

// import {  } from 'react-native'

const DownloadingHelper = () => {
  const state = useSelector((state) => state.playlist);
  const dispatch = useDispatch();
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  const {downloadQueue, currentDownloading, currentPlaylist} = state;

  const downloadItem = (single, playlistDetails) => {
    console.log('Trying to download: ', single.title);
    return new Promise(async (resolve, reject) => {
      const api = `${NEW_API}/download?`;
      const req = checkPermission();
      const fileStatus = await checkExists(single);
      if (req) {
        if (!fileStatus.path) {
          let artistsString = single.artist.map((item) => item.name).join();

          const params = {
            title: single.title,
            album: single.album,
            artistsString,
          };

          let query = Object.keys(params)
            .map(
              (k) =>
                encodeURIComponent(k) + '=' + encodeURIComponent(params[k]),
            )
            .join('&');

          const response = await fetch(api + query);

          response
            .json()
            .then((res) => {
              let link = res.url;
              let duration = res.duration;

              if (link) {
                const path = `${DOWNLOAD_PATH}/${single.title}.mp3`;

                let task = RNBackgroundDownloader.download({
                  id: single.title,
                  url: `${link}`,
                  destination: path,
                })
                  .begin((expectedBytes) => {
                    // console.log(`Going to download ${expectedBytes} bytes!`);
                    // setVisible(true);
                    // setDownloadPercent(0);
                    // console.log('Begin reached');
                  })
                  .progress((percent) => {
                    console.log(`Downloaded: ${percent * 100}%`);
                    // setDownloadPercent(percent);
                    dispatch({type: 'SET_DOWNLOAD_PERCENT', payload: percent});
                  })
                  .done(async () => {
                    try {
                      // console.log('try block');
                      const newDownload = {
                        id: single.id,
                        title: single.title,
                        artist: single.artist[0].name,
                        album: single.album,
                        artwork: single.artwork,
                        url: path,
                        duration: duration,
                      };

                      const storedValue = await AsyncStorage.getItem(
                        `@playlistView`,
                      );

                      const prevList = await JSON.parse(storedValue);
                      const playlistId = playlistDetails.id;
                      if (!prevList) {
                        let playlistView = {
                          [playlistId]: {
                            info: {
                              id: playlistDetails.id,
                              name: playlistDetails.name,
                              image: playlistDetails.image,
                            },
                            tracks: [newDownload],
                          },
                        };

                        await AsyncStorage.setItem(
                          `@playlistView`,
                          JSON.stringify(playlistView),
                        );
                        // console.log(playlistView);
                        Snackbar.show({
                          text: 'First Track added to Downloads',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      } else {
                        let newList = {
                          ...prevList,
                        };

                        if (playlistId in prevList) {
                          newList[playlistId].tracks.push(newDownload);
                        } else {
                          newList = {
                            ...newList,
                            [playlistId]: {
                              info: {
                                id: playlistDetails.id,
                                name: playlistDetails.name,
                                image: playlistDetails.image,
                              },
                              tracks: [newDownload],
                            },
                          };
                        }
                        // console.log(newList);
                        await AsyncStorage.setItem(
                          `@playlistView`,
                          JSON.stringify(newList),
                        );
                        Snackbar.show({
                          text: 'Track added to Downloads',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      }
                      dispatch({
                        type: 'UPDATE_DOWNLOADED',
                        payload: {track: single, path, duration},
                      });
                      dispatch({
                        type: 'REMOVE_FROM_DOWNLOAD_QUEUE',
                        payload: single,
                      });
                      dispatch({
                        type: 'REMOVE_CURRENT_DOWNLOADING',
                        payload: single,
                      });
                      resolve();
                    } catch (err) {
                      console.log(err);
                      reject(err);
                    }
                  })
                  .error((error) => {
                    console.log('Download canceled due to error: ', error);
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
                      text: `Pardon!  Could not download ${single.title} particular file due to Youtube policies`,
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                    });
                    reject(error);
                  });
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
                  text: 'Server Error',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
                reject('Server Error');
              }
            })
            .catch((error) => {
              console.log('Download canceled due to error: ', error);
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
                text: `Could not download ${single.title}. Something went wrong with the yt`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
              reject(error);
            });
        } else {
          Snackbar.show({
            text: `The track ${single.title} is already downloaded`,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
          reject('Already Downloaded');
        }
      } else {
        Alert.alert(
          'Storage Permision Denied',
          'Unable to save',
          [{text: 'OK', onPress: () => {}}],
          {cancelable: false},
        );
        reject('Storage Permision Denied');
      }
    });
  };

  useEffect(() => {
    const workerFn = async () => {
      if (downloadQueue.length > 0 && !isExecutingTask) {
        const item = downloadQueue[0];
        try {
          await downloadItem(item, currentPlaylist.responseInfo);
        } catch (err) {}

        setIsExecutingTask(false);
      }
    };
    workerFn();
  }, [downloadQueue, isExecutingTask]);
  return null;
};

export default DownloadingHelper;
