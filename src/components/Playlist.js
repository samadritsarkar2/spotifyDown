import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import allActions from '../redux/actions/index';
import {useIsFocused} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-spinkit';
import TextTicker from 'react-native-text-ticker';

import {NEW_API} from '@env';
import {windowWidth, windowHeight} from '../common';

import {
  addNewPlaylist,
  addToDownloadQueue,
} from '../redux/actions/playlistActions';

const Playlist = ({navigation, route}) => {
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // const [tracks, setTracks] = useState([]);
  // const [responseData, setResponseData] = useState({});

  const [visible, setVisible] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);
  // const [curentDownloading, setCurentDownloading] = useState(null);

  const isFocused = useIsFocused();
  const URlID = useSelector((state) => state.playlist).id;

  const dispatch = useDispatch();
  const state = useSelector((state) => state.playlist);
  const {responseInfo, tracks} = state.currentPlaylist;
  const {loading, currentDownloading, downloadQueue} = state;

  const fetchData = async () => {
    try {
      let api = `${NEW_API}/redirect?id=${URlID}`;
      const response = await fetch(api, {
        method: 'GET',
        headers: {},
      });
      // const text = await response.text();
      // console.log('Error', response.status);
      if (response) {
        response
          .json()
          .then((res) => {
            dispatch(addNewPlaylist(res));
          })
          .catch((err) => {
            console.log(err);
            // setLoading(false);
            setError(true);
            //navigation.goBack();
            Alert.alert(
              'Server Error',
              'Server Error',
              [{text: 'OK', onPress: () => {}}],
              {cancelable: true},
            );
          });
      } else {
        setLoading(false);
        setError(true);
        navigation.navigate('Error', {error: error});
      }
    } catch (error) {
      setTimeout(() => {
        navigation.goBack();
        Snackbar.show({
          text: 'Internt connection is required to fetch playlist',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      }, 1000);
    }
  };

  useEffect(() => {
    // setLoading(true);
    // console.log(state);
    dispatch({type: 'LOADING_TRUE'});

    fetchData();

    // return () => {
    //   const [loading, setLoading] = useState(true);
    //   const [error, setError] = useState(false);
    //   const [tracks, setTracks] = useState([]);
    //   const [responseData, setResponseData] = useState({});
    // };
  }, [isFocused]);

  const handleDownload = (item) => {
    dispatch(addToDownloadQueue(item));
  };

  const downloadAll = async () => {
    tracks.map((item) => {
      if (!item.downloaded) {
        // console.log(item);
        setTimeout(() => {
          handleDownload(item);
        }, 2000);
      }
    });
  };

  const handleDownloadAll = async () => {
    try {
      if (true) {
        let downloaded = await downloadAll();
        savePlaylist();
      } else {
        Snackbar.show({
          text: 'Playlist already exists in Download Library',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const savePlaylist = async () => {
    if (responseInfo.saved == false) {
      try {
        const playlistToAdd = {
          id: responseInfo.id,
          name: responseInfo.name,
          image: responseInfo.image,
        };

        const storedValue = await AsyncStorage.getItem(`@saved_playlists`);
        const prevList = await JSON.parse(storedValue);
        // console.log(storedValue)
        if (!prevList) {
          const newList = [playlistToAdd];
          await AsyncStorage.setItem(
            '@saved_playlists',
            JSON.stringify(newList),
          );
          Snackbar.show({
            text: 'First Playlist added to Library',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
          setResponseData((item) =>
            !item.saved ? {...item, saved: true} : item,
          );
        } else {
          const exists = prevList.some((item) => item.id === responseInfo.id);

          if (!exists) {
            prevList.push(playlistToAdd);
            await AsyncStorage.setItem(
              '@saved_playlists',
              JSON.stringify(prevList),
            );

            Snackbar.show({
              text: 'Playlist added to Library',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
            dispatch({type: 'SAVE_PLAYLIST'});
          } else {
            Snackbar.show({
              text: 'Playlist already exists in Library',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
            dispatch({type: 'SAVE_PLAYLIST'});
          }
          // console.log(prevList)
        }
      } catch (err) {
        // console.log(err);
      }
    }
  };

  const openFile = (single) => {
    navigation.navigate('LibraryStack', {screen: 'Downloads'});
  };

  const onRequestClose = () => null;

  return (
    <>
      {loading ? (
        <View style={styles.wholeScreen}>
          <Spinner
            style={{marginBottom: 7}}
            size={72}
            type={'ThreeBounce'}
            color={'#FFF'}
          />
          <Text style={{color: 'white', fontSize: 20}}>Fetching...</Text>
        </View>
      ) : (
        <>
          <View style={styles.wholeScreen}>
            <View style={styles.playlistHeader}>
              <View
                style={{
                  flex: 0.9,
                  flexDirection: 'column',
                }}>
                {responseInfo.image ? (
                  <Image
                    source={{uri: responseInfo.image}}
                    style={{
                      height: '100%',
                      aspectRatio: 1 / 1,
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}
                  />
                ) : (
                  <Image
                    source={require('../assets/defaultPlaylist.png')}
                    style={{
                      height: '100%',
                      width: '60%',
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}
                  />
                )}
                <View
                  style={{
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextTicker
                    style={[styles.playlistId, {}]}
                    duration={10000}
                    scroll={false}
                    repeatSpacer={150}
                    marqueeDelay={2000}>
                    {responseInfo.name}
                  </TextTicker>
                </View>
              </View>
              <View
                style={{
                  flex: 0.1,
                  marginTop: 50,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.downloadAllButton}
                  onPress={() => {
                    handleDownloadAll();
                  }}>
                  <Text style={styles.downloadAllButtonText}>Download All</Text>
                </TouchableOpacity>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      savePlaylist();
                    }}
                    onLongPress={() => {
                      Snackbar.show({
                        text: 'Save  this playlist in Library',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'red',
                      });
                    }}>
                    {responseInfo.saved ? (
                      <Image
                        source={require('../assets/red-heart.png')}
                        style={{height: 30, width: 30}}
                      />
                    ) : (
                      <Image
                        source={require('../assets/heart.png')}
                        style={{height: 30, width: 30}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scroller}>
              {/* <Text style={{color :'white'}}> {JSON.stringify(tracks)} </Text> */}
              {tracks.map((item, index) => {
                return (
                  <View key={index} style={styles.list}>
                    {item.downloaded ? (
                      <View style={{flex: 0.7}}>
                        <TouchableOpacity
                          onPress={() => {
                            openFile(item);
                          }}>
                          <Text style={styles.trackTitle}>{item.title}</Text>
                          <Text style={styles.trackInfo}>
                            {item?.artist[0].name} - {item.album}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={{flex: 0.7}}>
                        <Text style={styles.trackTitle}>{item.title}</Text>
                        <Text style={styles.trackInfo}>
                          {item?.artist[0].name} - {item.album}
                        </Text>
                      </View>
                    )}
                    {item.downloaded ? (
                      <TouchableOpacity
                        style={{
                          flex: 0.3,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          openFile(item);
                        }}>
                        <Image
                          source={require('../assets/check.png')}
                          style={{
                            height: 25,
                            width: 25,
                            borderRadius: 25 / 2,
                            backgroundColor: '#1DB954',
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          flex: 0.3,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                        onPress={() => handleDownload(item)}>
                        {currentDownloading.includes(item) ? (
                          <Spinner
                            style={{marginBottom: 7, justifyContent: 'center'}}
                            size={30}
                            type={'Circle'}
                            color={'#FFF'}
                          />
                        ) : (
                          <Image
                            source={require('../assets/down.png')}
                            style={{
                              height: 25,
                              width: 25,
                              borderRadius: 25 / 2,
                              justifyContent: 'center',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
              <View style={{height: windowHeight * 0.06}} />
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
};

export default Playlist;

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
  },
  container: {
    flex: 1,
    top: 30,
  },
  header: {
    marginTop: 20,
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },

  playlistId: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'bold',
  },
  trackTitle: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'GothamMedium',
  },
  trackInfo: {
    color: '#6C7A89',
    fontSize: 12,
    fontFamily: 'GothamMedium',
  },
  downloadAllButton: {
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#1DB954',
    marginVertical: 20,
    height: windowHeight * 0.07,
    width: windowWidth * 0.3,
    alignSelf: 'center',
  },
  downloadAllButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'GothamMedium',
  },
  playlistHeader: {
    flex: 0.6,
    marginVertical: 15,
    marginTop: 25,
    justifyContent: 'space-evenly',
    width: '90%',
  },
  scroller: {
    flex: 0.54,
    margin: 10,
    width: '95%',

    marginBottom: 0,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
});
