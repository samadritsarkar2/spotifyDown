import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  Vibration,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
  windowWidth,
} from '../common';
import allActions from '../redux/actions';
import {shufflePlay} from '../redux/actions/playerActions';
import {isExist} from '../utils';
import TextTicker from 'react-native-text-ticker';

const TracksView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const downloadsState = useSelector((state) => state.downloadsReducer);
  const {data, isPlaylistView, activePlaylist} = downloadsState;

  const confirmTracks = () => {
    data[activePlaylist].tracks.map((item) => {
      isExist(item).then(async (exists) => {
        if (!exists) {
          let updatedPlaylistTracks = data[activePlaylist].tracks.filter(
            (file) => file.id !== item.id,
          );
          const updatedData = {
            ...data,
            [activePlaylist]: {
              ...data[activePlaylist],
              ['tracks']: updatedPlaylistTracks,
            },
          };
          await AsyncStorage.setItem(
            `@playlistView`,
            JSON.stringify(updatedData),
          );
          dispatch({type: 'LOAD_DATA', payload: updatedData});

          // console.log(updatedData[activePlaylist].tracks.length);
        }
      });
    });
  };

  useEffect(() => {
    navigation.setOptions({title: data[activePlaylist].info.name});
    confirmTracks();
    // console.log(Object.keys(data));
  }, [data]);



  const handleLongPress = (item) => {
    Vibration.vibrate(100);
    setIsVisible(true);
    setSelected(item);
  };

  const handleAddToQueue = (item) => {
    // console.log(item);
    Vibration.vibrate(100);
    ToastAndroid.show(`Added to Queue`, ToastAndroid.SHORT);
    dispatch(allActions.addToQueue(item));
  };

  return (
    // <Text>Hello</Text>
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        marginTop: 10,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{}}
        // refreshControl={
        //   <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        // }
      >
        <View
          style={{
            flex :1 ,
            marginBottom: 10,
            flexDirection : 'row',
            justifyContent : 'space-evenly',
          }}>
            <TouchableOpacity
            style={styles.playButtonTouchable}
            onPress={() => {
              dispatch(allActions.addPlaylistToQueue(activePlaylist));
            }}
            delayLongPress={100}>
            <Image
              source={require('../assets/play.png')}
              style={styles.playButtonImg}
            />
            <Text
              style={styles.playButtonText}>
              {' '}
              Play
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButtonTouchable}
            onPress={() => {
              dispatch(allActions.shufflePlay(activePlaylist));
            }}
            delayLongPress={100}>
            <Image
              source={require('../assets/shuffle.png')}
              style={styles.playButtonImg}
            />
            <Text
              style={styles.playButtonText}>
              {' '}
              Shuffle Play
            </Text>
          </TouchableOpacity>
        </View>

        {data[activePlaylist].tracks.map((item, index) => {
          return (
            <View
              style={{flexDirection: 'row', alignItems: 'center'}}
              key={index}>
              <TouchableOpacity
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
                  <View style={styles.trackDetails}>
                    <TextTicker duration={8000} style={styles.trackTitle}>{item.title}</TextTicker>
                    <Text style={styles.trackInfo}>
                      {item.artist} - {item.album}
                    </Text>
                  </View>
                  {/* <Text style={{color: 'white', alignSelf: 'center'}}>
                      {Math.floor(item?.duration)}
                    </Text> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.trackOption}
                onPress={() => handleLongPress(item)}>
                <Image
                  source={require('../assets/more.png')}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
            </View>
          );
        })}
        <View style={{height: windowHeight * 0.07}} />
      </ScrollView>
      <Modal
        isVisible={isVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => setIsVisible(false)}
        onBackButtonPress={() => setIsVisible(false)}
        swipeDirection={['down']}
        useNativeDriver={true}
        deviceWidth={windowWidth}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.optionOverlayWrapper}>
          <TouchableOpacity
            style={styles.trackOptionTouchable}
            onPress={() => {
              handleAddToQueue(selected);
            }}>
            <Image
              source={require('../assets/addTo.png')}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.trackOptionText}>Add to Queue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trackOptionTouchable}
            onPress={() => {
              dispatch(allActions.deleteTrack(selected));
              setTimeout(() => {
                confirmTracks();
                setSelected(null);
                setIsVisible(false);
              }, 100);
            }}>
            <Image
              source={require('../assets/bin.png')}
              style={{width: 20, height: 20}}
            />
            <Text style={styles.trackOptionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default TracksView;

const styles = StyleSheet.create({
  playButtonTouchable : {
    ...spotifyGreenButton,
    flexDirection: 'row',
    width: '44%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  playButtonImg : {height: 25, width: 25},
  playButtonText : {...spotifyGreenButtonText, fontSize :17, textTransform: 'capitalize'},
  itemClickWrapper: {flex: 1, marginBottom: 10},
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight * 0.07,
  
  },
  trackDetails: {
    flex: 9,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  trackTitle: {
    color: 'white',
    fontSize: 18,
    justifyContent: 'flex-start',
    fontFamily: 'GothamRoundedBook',
    
  },
  trackInfo: {
    color: '#6C7A89',
    fontSize: 12,
    fontFamily: 'GothamRoundedMedium',
  },
  trackArtwork: {
    flex: 1,
    marginRight: 10,
    height: '90%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    
    padding: 6,
  },
  trackOption: {
    flex: 0.1,
    height: windowHeight * 0.07,

    justifyContent: 'center',
    alignItems: 'center',
  },
  optionOverlayWrapper: {
    height: windowHeight * 0.15,
    width: windowWidth,
    backgroundColor: '#181818',
    paddingHorizontal: 10,
  },
  trackOptionTouchable: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '40%',
  },
  trackOptionText: {
    fontSize: 17,
    color: 'white',
    fontFamily: 'GothamRoundedMedium',
    marginLeft: 15,
  },
});
