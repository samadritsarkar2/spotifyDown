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
import {spotifyGreenButton, spotifyGreenButtonText} from '../common';

const App = ({navigation, route}) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
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
          <Text style={styles.header}>Spotify Downloader</Text>
        </View>
        <View style={styles.inputBox}>
          <TouchableOpacity
            style={spotifyGreenButton}
            onPress={() => {
              navigation.navigate('New');
            }}>
            <Text style={spotifyGreenButtonText}>Add New </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={spotifyGreenButton}
            onPress={() => {
              navigation.navigate('LibraryStack');
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
