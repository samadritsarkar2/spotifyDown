import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {DOWNLOAD_PATH, windowHeight, windowWidth} from '../common/index';
import {useDispatch} from 'react-redux';
import {checkExists, checkPermission, checkData, isExist} from '../utils';
import RNFS, {downloadFile} from 'react-native-fs';
import {API, NEW_API, NEWER_API} from '@env';
import Spinner from 'react-native-spinkit';
import {useNavigation} from '@react-navigation/native';

// import {  } from 'react-native'

const DownloadingHelper = () => {
  const state = useSelector((state) => state.playlist);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  const {
    downloadQueue,
    currentDownloading,
    currentPlaylist,
    downloadPercent,
  } = state;

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
    console.log(single);
    return new Promise(async (resolve, reject) => {
      const api = `${NEW_API}/download?`;
      const newApi = `https://us-central1-downify-sam.cloudfunctions.net/getDownloadLink?trackId=`

      
      const req = checkPermission();
      const fileStatus = await isExist(single);
      // console.log(fileStatus);
      if (req) {
        let data;
        if (!single.customDownloadData) {
          // let artistsString = single.artist.map((item) => item.name).join();

          // const params = {
          //   title: single.title,
          //   album: single.album,
          //   artistsString,
          // };

          // let query = Object.keys(params)
          //   .map(
          //     (k) =>
          //       encodeURIComponent(k) + '=' + encodeURIComponent(params[k]),
          //   )
          //   .join('&');



          // const response = await fetch(api + query);
          
          const newResponse = await fetch(newApi + single.id);

          data = await newResponse.json();
          console.log("Data::", data)
        } else {
          data = single.customDownloadData;
        }
      
        // let link = data.url;
        let link = `${NEWER_API}/directStream?videoId=` + data.videoId;
        let duration = data.duration;

        if (link) {
          const path = `${DOWNLOAD_PATH}/${single.title}.mp3`;
          let headers = {
            Accept: 'audio/*',
            'Content-Type': 'audio/*',
          };

          if (fileStatus && !single.customDownloadData) {
            // console.log('Triggered already downloaded');
            try {
              // console.log('try block');
              const newDownload = {
                id: single.id,
                title: single.title,
                artist: single.artist[0].name,
                album: single.album,
                artwork: single.artwork,
                url: fileStatus,
                duration: duration,
              };

              const storedValue = await AsyncStorage.getItem(`@playlistView`);

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
              dispatch({
                type: 'SET_DOWNLOAD_PERCENT',
                payload: 0,
              });
            } catch (err) {
              console.log(err);
              reject(err);
            }
          } else {
            let totalBytes;

            downloadFile({
              fromUrl: link,
              headers: headers,
              toFile: path,
              progressDivider: 4,
              begin: (res) => {
                // console.log('Response begin ===\n\n');
                // console.log(res);
              },
              progress: (res) => {
                //here you can calculate your progress for file download
                let percent = (res.bytesWritten / res.contentLength) * 100; // to calculate in percentage
                console.log(`Downloaded: ${percent}%`);
                // setDownloadPercent(percent);
                dispatch({
                  type: 'SET_DOWNLOAD_PERCENT',
                  payload: percent,
                });
                let size = formatBytes(res.contentLength);
                totalBytes = res.contentLength;
                dispatch({
                  type: 'SET_DOWNLOAD_SIZE',
                  payload: size,
                });
              },
            })
              .promise.then(async (res) => {
                if (res && res.statusCode === 200 && res.bytesWritten > 0) {
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
                    dispatch({
                      type: 'SET_DOWNLOAD_PERCENT',
                      payload: 0,
                    });
                  } catch (err) {
                    console.log(err);
                    reject(err);
                  }
                } else {
                  // console.log('Else:  ', res);

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
                    text: `Pardon!  Could not download ${single.title} due to Youtube policies. Try the Custom Downloader.`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    fontFamily: 'GothamMedium',
                  });
                  reject('Yt error');
                }
              })
              .catch(async (err) => {
                // console.log('Download canceled due to error: ', err);
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
                  text: `Pardon!  Could not download ${single.title} file due to Youtube policies. Try the Custom Downloader.`,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
                reject(err);
              });
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
    // console.log(downloadQueue);
    const workerFn = async () => {
      if (downloadQueue.length > 0 && !isExecutingTask) {
        setIsExecutingTask(true);
        const item = downloadQueue[0];
        try {
          await downloadItem(item, currentPlaylist.responseInfo);
        } catch (err) {}

        setIsExecutingTask(false);
      }
    };
    workerFn();
  }, [downloadQueue, isExecutingTask]);

  return (
    <View>
      {downloadQueue.length >= 1 ? (
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            height: windowWidth * 0.15,

            width: windowWidth * 0.15,
            borderRadius: 15,
            position: 'absolute',
            bottom: windowHeight * 0.12,
            left: 20,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={
            () =>
              navigation.navigate('LibraryStack', {
                screen: 'DownloadQueue',
                initial: false,
              })
            // navigation.navigate('DownloadQueue')
          }>
          <Spinner
            style={{marginBottom: 7, justifyContent: 'center'}}
            size={20}
            type={'Circle'}
            color={'red'}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default DownloadingHelper;
