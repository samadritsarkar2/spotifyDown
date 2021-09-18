import {API, NEW_API} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {checkExists, checkPermission, checkData} from '../../utils';

export const addNew = (playlist) => {
  return {
    type: 'NEW_PLAYLIST',
    payload: playlist,
  };
};
export const addNewPlaylist = (playlistData) => {
  return async (dispatch) => {
    console.log('addNewPlaylist');
    dispatch({type: 'ADD_NEW_PLAYLIST', payload: playlistData});
    // checkData(playlistData.tracks);
  };
};

export const downloadOne = (track) => {
  return async (dispatch) => {
    const api = `${NEW_API}/download?`;
    const req = checkPermission();
    const fileStatus = await checkExists(single);
    if (req) {
      if (!fileStatus.path) {
        // setVisible(true);
        // setCurentDownloading(single.id);
        let artistsString = single.artist.map((item) => item.name).join();
        let passedQuery =
          single.title + ' ' + single.album + ' ' + artistsString;
        const params = {
          title: single.title,
          album: single.album,
          artistsString,
        };
        const url = new URL(api);
        let query = Object.keys(params)
          .map(
            (k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]),
          )
          .join('&');
        // url.search = new URLSearchParams(params).toString();
        //console.log(api+query);
        const response = await fetch(api + query);

        response
          .json()
          .then((res) => {
            //  console.log('link fetched ....');
            let link = res.url;
            let duration = res.duration;

            let promise = new Promise((resolve, reject) => {
              if (link) {
                let task = RNBackgroundDownloader.download({
                  id: single.title,
                  url: `${link}`,
                  destination: `${RNBackgroundDownloader.directories.documents}/${single.title}.mp3`,
                })
                  .begin((expectedBytes) => {
                    // console.log(`Going to download ${expectedBytes} bytes!`);
                    setVisible(true);
                    setDownloadPercent(0);
                  })
                  .progress((percent) => {
                    // console.log(`Downloaded: ${percent * 100}%`);
                    setDownloadPercent(percent);
                  })
                  .done(async () => {
                    //console.log('Download is done!');

                    const path = `${RNBackgroundDownloader.directories.documents}/${single.title}.mp3`;

                    setTracks((prev) => {
                      const nextState = prev.map((item) =>
                        item.id == single.id
                          ? {
                              ...item,
                              downloaded: true,
                              path: path,
                              duration: duration,
                            }
                          : item,
                      );

                      return nextState;
                    });

                    try {
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
                        `@downloads`,
                      );
                      const prevList = await JSON.parse(storedValue);

                      if (!prevList) {
                        const newList = [newDownload];
                        await AsyncStorage.setItem(
                          `@downloads`,
                          JSON.stringify(newList),
                        );
                        //console.log(newDownload)
                        Snackbar.show({
                          text: 'First Track added to Downloads',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      } else {
                        prevList.push(newDownload);
                        await AsyncStorage.setItem(
                          `@downloads`,
                          JSON.stringify(prevList),
                        );
                        Snackbar.show({
                          text: 'Track added to Downloads',
                          duration: Snackbar.LENGTH_SHORT,
                          backgroundColor: 'red',
                        });
                      }
                    } catch (err) {
                      //console.log(err);
                    }

                    // dispatch(allActions.downloadOne(single, path));

                    // setVisible(false);
                    // resolve(path);
                    // setDownloadPercent(1);
                    // setCurentDownloading(null);
                  })
                  .error((error) => {
                    console.log('Download canceled due to error: ', error);
                    setDownloadPercent(0);
                    setVisible(false);
                    setCurentDownloading(null);

                    Snackbar.show({
                      text:
                        'Pardon!  Could not download this particular file due to Youtube policies',
                      duration: Snackbar.LENGTH_SHORT,
                      backgroundColor: 'red',
                    });
                    resolve('Failed');
                  });
              } else {
                setDownloadPercent(0);
                setVisible(false);
                setCurentDownloading(null);
                Snackbar.show({
                  text: 'Server Error',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              }
            });

            return promise;
          })
          .catch((error) => {
            console.log('Download canceled due to error: ', error);
            setDownloadPercent(0);
            setVisible(false);
            setCurentDownloading(null);

            Snackbar.show({
              text: 'Something went wrong in the server',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
            //resolve('Failed');
          });
      }
    } else {
      Alert.alert(
        'Storage Permision Denied',
        'Unable to save',
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false},
      );
    }
  };

  // return  {
  //     type : "DOWNLOAD_ONE",
  //     payload : item,
  //     path : path
  // }
};
