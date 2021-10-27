import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {initAdMob, spotifyGreenButton, spotifyGreenButtonText} from '../common';
// import AdMob, {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import {IronSource} from '@wowmaking/react-native-iron-source';

import {AdSettings} from 'react-native-fbads';

const App = ({navigation, route}) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    initAdMob(() => console.log('initilized Admob'));
    // console.log(AdSettings.currentDeviceHash);
    // AdSettings.addTestDevice(AdSettings.currentDeviceHash);
    IronSource.initializeIronSource('118aa3d25', 'userId', {
      validateIntegration: true,
    })
      .then(() => {
        console.log('Init finished');
      })
      .catch(() => {
        console.warn('error');
      });

    return unsubscribe;
  }, []);

  return (
    <>
      <View
        style={{flex: 1, backgroundColor: '#181818', justifyContent: 'center'}}>
        <StatusBar backgroundColor={'#282828'} />
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/homeLogo.png')}
              style={styles.logo}></Image>
          </View>
          <Text style={styles.header}>Downify</Text>
        </View>
        <View style={styles.inputBox}>
          <TouchableOpacity
            style={spotifyGreenButton}
            onPress={() => {
              navigation.navigate('NewStack', {screen: 'New'});
            }}>
            <Text style={spotifyGreenButtonText}>Add New </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={spotifyGreenButton}
            onPress={() => {
              navigation.navigate('LibraryStack', {screen: 'Library'});
            }}>
            <Text style={spotifyGreenButtonText}>Library</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    marginTop: '7%',
  },
  logoWrapper: {
    flex: 0.5,
    marginBottom: 0,
  },
  logo: {
    height: '100%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
  },
  header: {
    flex: 0.4,
    marginTop: 15,
    fontSize: 33,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Montserrat',
  },
  inputBox: {
    flex: 0.5,
    marginVertical: 20,
  },
  knowMore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    width: '60%',
    borderRadius: 30,
    marginTop: 25,
    backgroundColor: '#ff3c3c',
    paddingHorizontal: 20,
  },
});
