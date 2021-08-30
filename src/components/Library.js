import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AdMob, {useRewardedAd} from '@react-native-admob/admob';
import KnowMore from './KnowMore.js';

const Library = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAdClicked, setIsAdClicked] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const hookOptions = {
    loadOnDismissed: true,
  };
  const {
    adLoadError,
    adLoaded,
    reward,
    show,
    adPresented,
    adDismissed,
    load,
  } = useRewardedAd('ca-app-pub-3940256099942544/5224354917', hookOptions);

  const showAd = () => {
    setIsAdClicked(true);

    if (adLoadError) {
      ToastAndroid.show(
        'Something went wrong! Cannot load the App',
        ToastAndroid.SHORT,
      );
    }

    if (adLoaded) {
      show();
    } else {
      ToastAndroid.show('Ad is loading. Please wait', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    if (adLoaded && isAdClicked) {
      show();
    }
  }, [adLoaded]);

  useEffect(() => {
    if (adPresented || adDismissed) {
      setIsAdClicked(false);
    }
  }, [adDismissed, adPresented]);

  useEffect(() => {
    if (adLoadError) {
      console.error('Error ::', adLoadError);
    }
  }, [adLoadError]);

  const BetterKnowMore = React.memo(KnowMore);
  useEffect(() => {
    // console.log("rendered")
  }, []);

  return (
    <>
      <View
        style={{flex: 1, backgroundColor: '#181818', paddingHorizontal: 10}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Your Library</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <ScrollView alwaysBounceVertical={true}>
            <TouchableOpacity onPress={() => navigation.navigate('Downloads')}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/down.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Downloads </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('SavedPlaylists')}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/heart.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Saved</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/info.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Know More</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Donations')}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/red-heart.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Support the App</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={showAd}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/check.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Watch an Ad</Text>
              </View>
            </TouchableOpacity>
            <BetterKnowMore
              isModalVisible={isModalVisible}
              toggleModal={toggleModal}
            />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Library;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
    marginTop: '5%',
  },
  heading: {
    color: '#1DB954',
    fontFamily: 'GothamMedium',
    fontSize: 50,
    alignSelf: 'center',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 0,
    justifyContent: 'flex-start',
  },
  buttons: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Gotham',
  },
  optionWrapper: {
    flex: 1,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#111111',
    borderRadius: 10,
  },
  optionIcon: {
    height: 25,
    width: 25,
    marginHorizontal: 15,
  },
});
