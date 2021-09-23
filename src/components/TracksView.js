import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
} from '../common';
import allActions from '../redux/actions';
import {shufflePlay} from '../redux/actions/playerActions';

const TracksView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const downloadsState = useSelector((state) => state.downloadsReducer);
  const {data, isPlaylistView, activePlaylist} = downloadsState;
  useEffect(() => {
    navigation.setOptions({title: data[activePlaylist].info.name});
    // if(activePlaylist === 'unorganized')
    // {

    // }
    console.log(activePlaylist);
  }, []);
  return (
    // <Text>Hello</Text>
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 10,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{}}
        // refreshControl={
        //   <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        // }
      >
        <View>
          <TouchableOpacity
            style={spotifyGreenButton}
            onPress={() => {
              dispatch(shufflePlay(activePlaylist));
            }}>
            <Text
              style={{...spotifyGreenButtonText, textTransform: 'capitalize'}}>
              {' '}
              Shuffle Play
            </Text>
          </TouchableOpacity>
        </View>
        {data[activePlaylist].tracks.map((item, index) => {
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
        <View style={{height: windowHeight * 0.07}} />
      </ScrollView>
    </View>
  );
};

export default TracksView;

const styles = StyleSheet.create({
  itemClickWrapper: {flex: 1, marginBottom: 10},
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
});
