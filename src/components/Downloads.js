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

const Downloads = ({navigation}) => {
  const dispatch = useDispatch();
  const downloadQueue = useSelector((state) => state.playlist).downloadQueue;
  const [loading, setLoading] = useState(true);
  const windowHeight = Dimensions.get('window').height;
  const [arr, setArr] = useState([]);
  const [playlistView, setPlaylistView] = useState();
  const [playlists, setPlaylists] = useState([]);

  const [isPlaylistView, setIsPlaylisView] = useState(true);
  const [activePlaylist, setActivePlaylist] = useState(null);

  const getFileName = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(`@downloads`);
      const prevList = await JSON.parse(storedValue);
      //  console.log(prevList);
      prevList.map(async (item) => {
        const exist = await isExist(item);
        if (exist === false) {
          const updatedList = prevList.filter((file) => file.id != item.id);
          await AsyncStorage.setItem(`@downloads`, JSON.stringify(updatedList));
          setArr(updatedList);
          setLoading(false);
        } else {
          setArr(prevList);
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const getPlaylistView = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(`@playlistView`);

      const prevList = await JSON.parse(storedValue);
      setPlaylistView(prevList);
      const playlists = Object.keys(prevList);
      // for (const playlist in prevList) {
      //   console.log(playlist, ':::', prevList[playlist]);
      // }
      // playlists.forEach((key, index) => {
      //   console.log(key, ' :: ', prevList[key]);
      // });
      setPlaylists(playlists);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(downloadQueue);
    setLoading(true);
    setTimeout(() => {
      getFileName();
      getPlaylistView();
    }, 500);
  }, []);

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      getFileName();
    }, 500);
  };

  const handleLongPress = (item) => {
    Vibration.vibrate(100);
    ToastAndroid.show(`Added to Queue`, ToastAndroid.SHORT);
    dispatch(allActions.addToQueue(item));
  };

  const PlaylistView = () => {
    return (
      <View>
        {playlists.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setActivePlaylist(item);
              setIsPlaylisView(false);
              console.log(playlistView[item].info);
            }}
            style={styles.itemWrapper}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                height: windowHeight * 0.07,
              }}>
              <Image
                style={styles.playlistImg}
                source={
                  playlistView[item].info.image
                    ? Image.resolveAssetSource({
                        uri: `${playlistView[item].info.image}`,
                      })
                    : require('../assets/defaultPlaylist.png')
                }
              />
              <View
                style={{
                  flex: 9,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Text style={styles.playlistId}>
                  {playlistView[item].info.name}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const TracksView = () => {
    return (
      <View>
        {playlistView[activePlaylist].tracks.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                dispatch(allActions.playOne(item));
              }}
              style={styles.itemClickWrapper}
              onLongPress={() => handleLongPress(item)}>
              <View style={styles.itemWrapper}>
                <Image
                  style={styles.trackArtwork}
                  source={{uri: `${item.artwork}`}}
                />
                <View
                  style={{
                    flex: 9,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <Text style={styles.trackInfo}>
                    {item.artist} - {item.album}
                  </Text>
                </View>
                {/* <Text style={{color: 'white', alignSelf: 'center'}}>
                      {Math.floor(item?.duration)}
                    </Text> */}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View style={styles.header}>
          <Text style={styles.heading}>Downloads</Text>
        </View>
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
              marginHorizontal: 10,
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
                {isPlaylistView ? <PlaylistView /> : <TracksView />}

                <TouchableOpacity
                  style={spotifyGreenButton}
                  onPress={async () => {
                    // const storedValue = await AsyncStorage.getItem(
                    //   `@playlistView`,
                    // );

                    // const prevList = await JSON.parse(storedValue);
                    // console.log(prevList);
                    console.log(playlistView[activePlaylist].tracks);
                  }}>
                  <Text style={spotifyGreenButtonText}>Add New</Text>
                </TouchableOpacity>

                <View style={{height: windowHeight * 0.06}} />
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
  itemClickWrapper: {flex: 1, marginBottom: 15},
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight * 0.07,
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
    fontSize: 17,
    justifyContent: 'flex-start',
    fontFamily: 'GothamMedium',
    fontWeight: 'bold',
  },
  playlistImg: {
    flex: 1.5,
    marginLeft: 7,
    marginRight: 12,
    height: '100%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    padding: 6,
  },
});
