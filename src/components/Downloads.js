import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Vibration,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import allActions from '../redux/actions/index';
import {isExist} from '../utils';
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
  windowWidth,
} from '../common';
import Spinner from 'react-native-spinkit';
import {handleUnorganized} from '../redux/actions/downloadsActions';

const Downloads = ({navigation}) => {
  const dispatch = useDispatch();
  const downloadQueue = useSelector((state) => state.playlist).downloadQueue;
  const [loading, setLoading] = useState(true);
  const windowHeight = Dimensions.get('window').height;
  // const [arr, setArr] = useState([]);
  // const [playlistView, setPlaylistView] = useState();
  const downloadsState = useSelector((state) => state.downloadsReducer);
  const {playlists, data, isPlaylistView, activePlaylist} = downloadsState;
  // const [playlists, setPlaylists] = useState([]);

  const getFileName = async (fn) => {
    try {
      const storedValue = await AsyncStorage.getItem(`@downloads`);

      const prevList = await JSON.parse(storedValue);

      prevList.map(async (item) => {
        const exist = await isExist(item);
        if (exist === false) {
          const updatedList = prevList.filter((file) => file.id != item.id);
          await AsyncStorage.setItem(`@downloads`, JSON.stringify(updatedList));
          // setArr(updatedList);
          fn(updatedList);
        } else {
          // setArr(prevList);
          fn(prevList);
        }
      });
    } catch (error) {}
  };

  const getPlaylistView = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(`@playlistView`);

      const prevList = await JSON.parse(storedValue);

      if (prevList !== null) {
        dispatch({type: 'LOAD_DATA', payload: prevList});
        let playlists = Object.keys(prevList);

        playlists = playlists.filter(
          (item) => prevList[item].tracks.length !== 0,
        );

        dispatch({type: 'LOAD_PLAYLISTS', payload: playlists});
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
  };

  const checkForUnorganized = (result) => {
    AsyncStorage.getItem('@unorganized').then((storedValue) => {
      const bool = JSON.parse(storedValue);
      // console.log(bool);

      result(bool ? true : false);
    });
  };

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      getPlaylistView();
      checkForUnorganized((isDone) => {
        if (!isDone) {
          getFileName((arr) => {
            dispatch(handleUnorganized(arr));
          });
        }
      });
    }, 500);

    // return () => {
    //   IronSourceBanner.hideBanner();
    // };
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

  const PlaylistView = () => {
    return (
      <View>
        {playlists.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              dispatch({type: 'SET_ACTIVE_PLAYLIST', payload: item});

              navigation.navigate('TracksView');
            }}
            onLongPress={() => {
              dispatch(allActions.addNew(item));
              Vibration.vibrate(300);
              navigation.navigate('NewStack', {screen: 'Playlist'});
            }}
            style={{
              marginVertical: 10,
              paddingVertical : 5,
              paddingHorizontal: 5,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#111111',
              borderRadius: 10,
            }}>
            <View style={styles.itemWrapper}>
              <Image
                style={styles.playlistImg}
                source={
                  data[item].info.image
                    ? Image.resolveAssetSource({
                        uri: `${data[item].info.image}`,
                      })
                    : require('../assets/defaultPlaylist.png')
                }
              />
              <View
                style={{
                  flex: 9,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems : 'center'
                }}>
                <Text style={styles.playlistId}>{data[item].info.name}</Text>
                <Text style={styles.playlistTrackCount}> {data[item].tracks.length} </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <>
      <View style={{flex: 1, paddingHorizontal: 12, marginTop: 10}}>
        {/* <View style={styles.header}>
          <Text style={styles.heading}>Downloads</Text>
        </View> */}

        {loading ? (
          <View style={{flex: 1}}>
            <Spinner
              style={{marginBottom: 7, alignSelf: 'center'}}
              size={72}
              type={'9CubeGrid'}
              color={'#FFF'}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}>
            {playlists.length === 0 ? (
              <>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 25,
                      fontFamily: 'GothamMedium',
                      marginVertical: 15,
                    }}>
                    No tracks Downloaded
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: 'Montserrat-Regular ',
                      alignItems: 'center',
                    }}>
                    Try adding a Playlist/Album & download a Track
                  </Text>
                  <TouchableOpacity
                    style={spotifyGreenButton}
                    onPress={() => {
                      navigation.navigate('NewStack', {screen: 'New'});
                    }}>
                    <Text style={spotifyGreenButtonText}>Add New</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{}}
                refreshControl={
                  <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                }>
                {/* <Unorganized /> */}
                <PlaylistView />

                <View style={{height: windowHeight * 0.07}} />
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default Downloads;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
    marginHorizontal: '1%',
  },
  heading: {
    color: '#1DB954',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 45,
    alignSelf: 'center',
    marginTop: '5%',
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight * 0.07,
  },
  itemClickWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight * 0.07,
    marginBottom: 50,
    backgroundColor: 'blue',
  },
  trackTitle: {
    color: 'white',
    fontSize: 16.9,
    justifyContent: 'flex-start',
    fontFamily: 'GothamMedium',
  },
  trackInfo: {
    color: '#6C7A89',
    fontSize: 12,
    fontFamily: 'GothamMedium',
  },
  trackArtwork: {
    flex: 1,
    marginRight: 20,
    height: '90%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    borderRadius: 6,
    padding: 6,
  },
  submit: {
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#1DB954',
    marginVertical: 20,
    height: 50,
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 17,
    fontFamily: 'Gotham',
    textTransform: 'uppercase',
  },
  playlistId: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'flex-start',
    fontFamily: 'GothamRoundedMedium',
    // fontWeight: 'bold',
  },
  playlistTrackCount : {
    color: '#d3d3d3',
    fontSize: 14,
    justifyContent: 'flex-start',
    fontFamily: 'GothamRoundedMedium',
    paddingRight : 7
  },
  playlistImg: {
    flex: 1.3,
    marginLeft: 7,
    marginRight: 12,
    height: '100%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    padding: 6,
  },
});
