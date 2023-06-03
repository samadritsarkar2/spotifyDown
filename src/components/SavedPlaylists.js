import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import allActions from '../redux/actions/index';
import Spinner from 'react-native-spinkit';
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
  windowWidth,
} from '../common';

const SavedPlaylists = () => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      retrieveSaved();
    }, 200);

    // retriveDownloaded();
  }, []);

  const retrieveSaved = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(`@saved_playlists`);

      const retrieved = await JSON.parse(storedValue);
      //console.log(storedValue, retrieved)
      setSaved(retrieved);
      setLoading(false);
    } catch (error) {
      // console.log('Coulnot retrieve saved Playlists', error);
      setLoading(false);
      setError(true);
    }
  };

  const handleClick = async (id) => {
    dispatch(allActions.addNew(id));
    navigation.navigate('NewStack', {screen: 'Playlist'});
  };

  return (
    <>
      <View
        style={{flex: 1, backgroundColor: '#181818', paddingHorizontal: 10}}>
        {loading ? (
          <View style={{flex: 1}}>
            <Spinner
              style={{marginBottom: 7, alignSelf: 'center'}}
              size={72}
              type={'Circle'}
              color={'#FFF'}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{}}>
              {saved === null ? (
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
                        fontFamily: 'GothamRoundedMedium',
                        marginVertical: 15,
                      }}>
                      Nothing Saved
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: 'GothamRoundedBook',
                        alignItems: 'center',
                      }}>
                      Try saving a Playlist/Album
                    </Text>
                    <TouchableOpacity
                      style={spotifyGreenButton}
                      onPress={() => {
                        navigation.navigate('NewStack', {screen: 'New'});
                      }}>
                      <Text style={spotifyGreenButtonText}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View>
                  {saved?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleClick(item.id)}
                      style={{
                        flex: 1, 
                        marginVertical: 10,
                        paddingVertical : 5,
                        paddingHorizontal: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#111111',
                        borderRadius: 10,}}>
                      <View key={index} style={styles.itemWrapper}>
                        <Image
                          style={styles.playlistImg}
                          source={
                            item.image
                              ? Image.resolveAssetSource({
                                  uri: `${item.image}`,
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
                          <Text style={styles.playlistId}>{item.name}</Text>
                        </View>
                        <Text style={styles.listText}> </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
};

export default SavedPlaylists;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
    marginHorizontal: '1%',
    alignItems: 'center',
  },
  heading: {
    color: '#1DB954',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 45,
    alignSelf: 'center',
    marginTop: '5%',
  },
  actions: {
    flex: 0.7,
    flexDirection: 'row',
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  buttons: {
    fontSize: 25,
    color: 'lightgray',
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight * 0.07,
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
  playlistId: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'flex-start',
    fontFamily: 'GothamRoundedMedium',
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 25,
    color: 'white',
    fontWeight: '200',
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
    fontFamily: 'GothamRoundedBook',
    textTransform: 'uppercase',
  },
});
