import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Vibration,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import allActions from '../redux/actions/index';
import {isExist} from '../utils';

const Downloads = ({navigation}) => {
  const dispatch = useDispatch();
  const queue = useSelector((state) => state.player);
  const windowHeight = Dimensions.get('window').height;
  const [arr, setArr] = useState([]);

  const getFileName = async () => {
    const storedValue = await AsyncStorage.getItem(`@downloads`);
    const prevList = await JSON.parse(storedValue);
    console.log(prevList);
    prevList.map(async (item) => {
      const exist = await isExist(item);
      if (exist === false) {
        const updatedList = prevList.filter((file) => file.id != item.id);
        await AsyncStorage.setItem(`@downloads`, JSON.stringify(updatedList));
        setArr(updatedList);
      }
    });

    // console.log(queue)
    setArr(prevList);
  };

  useEffect(() => {
    getFileName();
  }, []);

  const handleLongPress = (item) => {
    Vibration.vibrate(100);
    dispatch(allActions.addToQueue(item));
  };

  return (
    <>
      <View
        style={{flex: 1, backgroundColor: '#181818', paddingHorizontal: 10}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Downloads</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',

            marginHorizontal: '1%',
          }}>
          {arr.length === 0 ? (
            <>
              <View>
                <Text style={{color: 'red', fontSize: 20}}>
                  No tracks Downloaded
                </Text>
                <Text style={{color: 'white', fontSize: 20}}>
                  Try adding one{' '}
                </Text>
                <TouchableOpacity
                  style={styles.submit}
                  onPress={() => {
                    navigation.navigate('New');
                  }}>
                  <Text style={styles.buttonText}>Enter New</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{}}>
              {arr.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    dispatch(allActions.playOne(item));
                  }}
                  style={{flex: 1, marginBottom: 15}}
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
                      }}>
                      <Text style={styles.trackTitle}>{item.title}</Text>
                      <Text style={{color: 'gray'}}>
                        {item.artist} - {item.album}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={{height: windowHeight * 0.06}} />
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
};

export default Downloads;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
    marginTop: '5%',
    marginHorizontal: '1%',
  },
  heading: {
    fontSize: 50,
    color: '#1DB954',
    fontFamily: 'Roboto',
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  trackTitle: {
    color: 'white',
    fontSize: 15,
    justifyContent: 'flex-start',
  },
  trackArtwork: {
    flex: 1,
    marginRight: 20,
    width: '100%',
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    backgroundColor: 'blue',
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
