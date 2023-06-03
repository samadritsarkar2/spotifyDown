import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import {useSelector} from 'react-redux';
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
  windowWidth,
} from '../common';
const downloadQueue1 = [
  {
    album: 'Best Of Shraddha Kapoor',
    artist: [[Object]],
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8d81ccb980b57d373e91f62',
    downloaded: false,
    id: '517bz7zkWELmyL4eZzJ5R9',
    title: 'Galliyan (From "Ek Villain")',
  },
  {
    album: 'Best Of Shraddha Kapoor',
    artist: [[Object]],
    artwork: 'https://i.scdn.co/image/ab67616d0000b273c8d81ccb980b57d373e91f62',
    downloaded: false,
    id: '517bz7zkWELmyL4eZzJ5R',
    title: 'Mitwa',
  },
];
const DownloadQueue = () => {
  const state = useSelector((state) => state.playlist);
  const navigation = useNavigation();

  const [isExecutingTask, setIsExecutingTask] = useState(false);
  const {
    downloadQueue,
    currentDownloading,
    currentPlaylist,
    downloadPercent,
    downloadSize,
  } = state;
  return (
    <View style={{flex: 1, margin: 10}}>
      {downloadQueue.length === 0 ? (
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
            Queue is empty!
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontFamily: 'Montserrat-Regular',
              alignItems: 'center',
            }}>
            Currently downloading tracks will appear here
          </Text>
          <TouchableOpacity
            style={spotifyGreenButton}
            onPress={() => {
              navigation.navigate('NewStack', {screen: 'New'});
            }}>
            <Text style={spotifyGreenButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {/* <Text style={{color: 'white'}}>{JSON.stringify(state)}</Text> */}

          {downloadQueue.map((item, index) => {
            return (
              <View style={{marginVertical: 5}} key={item.id}>
                <View style={styles.itemWrapper}>
                  <Image
                    style={styles.trackArtwork}
                    source={{uri: `${item.artwork}`}}
                  />
                  <View style={styles.trackDetails}>
                    <Text style={styles.trackTitle}>{item.title}</Text>

                    <Text style={styles.trackInfo}>{item.album}</Text>
                  </View>
                  <View>
                    {currentDownloading[0]?.id === item.id ? (
                      <Text style={{...styles.trackTitle, fontSize: 15}}>
                        {parseInt(downloadPercent)} % of {downloadSize}
                      </Text>
                    ) : (
                      <Text style={{color: 'white'}}>
                        <Spinner
                          style={{marginBottom: 7, justifyContent: 'center'}}
                          size={30}
                          type={'Circle'}
                          color={'#FFF'}
                        />
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
            <View style={{height: windowHeight * 0.06}} />
        </ScrollView>
      )}
    </View>
  );
};

export default DownloadQueue;

const styles = StyleSheet.create({
  itemClickWrapper: {flex: 1, marginBottom: 10},
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: windowHeight * 0.07,
  },
  trackDetails: {
    flex: 9,
    flexDirection: 'column',
    justifyContent: 'center',
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
    marginRight: 10,
    height: '90%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    borderRadius: 6,
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
    fontFamily: 'Roboto',
    marginLeft: 15,
  },
});
