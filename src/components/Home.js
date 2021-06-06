import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';

const App = ({navigation, route}) => {
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
            style={styles.submit}
            onPress={() => {
              navigation.navigate('New');
            }}>
            <Text style={styles.text}>Add New </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              navigation.navigate('LibraryStack');
            }}>
            <Text style={styles.text}>Library</Text>
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
  submit: {
    justifyContent: 'center',
    height: 50,
    width: '60%',
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 25,
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
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
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 17,
    fontFamily: 'Gotham',
    textTransform: 'uppercase',
  },
});
