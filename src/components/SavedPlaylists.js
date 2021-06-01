import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import allActions from '../redux/actions/index';
import Spinner from 'react-native-spinkit';
import {windowHeight, windowWidth} from '../common';

const SavedPlaylists = () => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      retriveSaved();

      // retriveDownloaded();
    }, []),
  );

  const retriveSaved = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(`@saved_playlists`);

      const retrieved = await JSON.parse(storedValue);
      //console.log(storedValue, retrieved)
      setSaved(retrieved);
      setLoading(false);
    } catch (error) {
      console.log('Coulnot retrieve saved Playlists', error);
      setLoading(false);
      setError(true);
    }
  };

  const handleClick = async (id) => {
    dispatch(allActions.addNew(id));
    navigation.navigate('Playlist');
  };

  return (
    <>
      <View
        style={{flex: 1, backgroundColor: '#181818', paddingHorizontal: 10}}>
        <View style={styles.header}>
          <Text style={styles.heading}>Saved</Text>
        </View>
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
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={{}}>
              {saved == null ? (
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: 'red', fontSize: 20}}>
                    Nothing saved yet
                  </Text>
                  <Text style={{color: 'white', fontSize: 20}}>
                    Try adding one{' '}
                  </Text>
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={() => {
                      navigation.navigate('New');
                    }}>
                    <Text style={styles.buttonText}>Enter new Playlist</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {saved?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleClick(item.id)}
                      style={{flex: 1, marginBottom: 15}}>
                      <View key={index} style={styles.itemWrapper}>
                        <Image
                          style={styles.playlistImg}
                          source={
                            item.playlistImg
                              ? Image.resolveAssetSource({
                                  uri: `${item.playlistImg}`,
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
                          <Text style={styles.playlistId}>
                            {item.playlistId}
                          </Text>
                        </View>
                        <Text style={styles.listText}> </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </>
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
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: '5%',
  },
  library: {
    flex: 0.7,

    marginHorizontal: 10,
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
    fontSize: 20,
    justifyContent: 'flex-start',
    fontFamily: 'serif',
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
    fontFamily: 'Gotham',
    textTransform: 'uppercase',
  },
});
