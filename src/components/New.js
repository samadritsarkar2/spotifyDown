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
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
} from '../common';
import {IronSourceBanner} from '@wowmaking/react-native-iron-source';
import {useIsFocused} from '@react-navigation/core';

const New = ({navigation, route}) => {
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const fetchApi = async () => {
    setLoading(true);

    // Sanitation of the input URL

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
    // console.log(finalIndex, URlID);
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

  // useEffect(() => {
  // }, [isFocused]);

  return (
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
          <View 
            style={{
              backgroundColor : 'white',
              marginHorizontal: 20,

              width: '81%',
           
              alignSelf: 'center',
              alignItems : 'center',
              flexDirection : 'row',
              borderRadius : 4,

            }}
          >
            <Image 
          source={require("../assets/magnifying-glass.png")} 
          style={{
            height : 30,
            width : 30,
            marginHorizontal : 5
          }}
          />
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={(value) => {
              setUrl(value);
            }}
            placeholder={'Enter Spotify Album/Playlist Link'}
            placeholderTextColor={'black'}
          />
          {url ? <TouchableOpacity 
              onPress={() => setUrl('')}
          > 
          <Image 
          source={require("../assets/close.png")} 
          style={{
            height : 25,
            width : 25,
            marginHorizontal : 7
          }}
          />
          </TouchableOpacity> : null}
          </View>
          <TouchableOpacity style={spotifyGreenButton} onPress={fetchApi}>
            <Text style={spotifyGreenButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    height: '85%',
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
    marginTop : 2
  },
  input: {
    flex : 5 ,
    color: 'black',
   fontFamily : "GothamRoundedMedium"
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
  }
});
