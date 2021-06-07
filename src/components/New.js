import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import allActions from '../redux/actions/index';

import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  PermissionsAndroid,
} from 'react-native';

var parse = require('url-parse');
import analytics from '@react-native-firebase/analytics';
import {spotifyGreenButton, spotifyGreenButtonText} from '../common';

const New = ({navigation, route}) => {
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchApi = async () => {
    setLoading(true);

    // Santiation of the input URL

    let URL = parse(url);
    let pathArr = URL.pathname.split('/');

    var supported = ['album', 'playlist'];
    // let index;
    // supported.map((val) => {
    //   let i = pathArr.indexOf(val);

    //   if (i !== -1) index = i;
    // });
    let playlistIndex = pathArr.indexOf('playlist');
    let albumIndex = pathArr.indexOf('album');
    let finalIndex;

    if (albumIndex === -1 && playlistIndex !== -1) {
      finalIndex = playlistIndex;
    } else if (playlistIndex === -1 && albumIndex !== -1) {
      finalIndex = albumIndex;
    } else {
      finalIndex = -1;
    }

    let URlID = pathArr[finalIndex + 1];
    console.log(finalIndex, URlID);
    if (
      URL.host != 'open.spotify.com' ||
      (pathArr[finalIndex] !== 'playlist' && pathArr[finalIndex] !== 'album')
    ) {
      setLoading(false);
      Alert.alert(
        'Link not supported',
        "Provide link in the format 'open.spotify.com/playlist'",
        [{text: 'OK', onPress: () => {}}],
        {cancelable: true},
      );
    } else {
      setId(URlID);
      dispatch(allActions.addNew(URlID));
      // await AsyncStorage.setItem('@currentItem', JSON.stringify(res))

      setFetched(true);
      setLoading(false);
      await analytics().logEvent('new_playlist', {
        id: URlID,
      });
      navigation.navigate('Playlist');
    }
  };

  return (
    <>
      <>
        <View style={{flex: 1, backgroundColor: '#181818'}}>
          <StatusBar backgroundColor={'#282828'} />
          <View style={styles.container}>
            <Image
              source={require('../assets/Headphone-amico.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={(value) => {
                setUrl(value);
              }}
              placeholder={'Enter Spotify Album/Playlist Link'}
              placeholderTextColor={'#B3B3b3'}
            />
            <TouchableOpacity style={spotifyGreenButton} onPress={fetchApi}>
              <Text style={spotifyGreenButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </>
  );
};

export default New;

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    marginTop: 30,
  },
  logo: {
    height: '100%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
  },
  header: {
    marginTop: 20,
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
  inputBox: {
    flex: 0.6,
  },
  input: {
    color: 'white',
    marginHorizontal: 20,

    width: '70%',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    alignSelf: 'center',
  },
  submit: {
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#1DB954',
    marginVertical: 20,
    padding: 10,
    height: 50,
    width: '70%',
    alignSelf: 'center',
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
    width: '90%',

    marginBottom: 20,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  text: {
    color: 'white',
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 17,
    fontFamily: 'Gotham',
    textTransform: 'uppercase',
  },
});
