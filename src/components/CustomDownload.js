import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {windowHeight} from '../common/index';
import {NEW_API} from '@env';

const CustomDownload = () => {
  const api = `${NEW_API}/customdownload?`;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const single = useSelector((state) => state.playlist).customItem;

  const doFetch = async () => {
    let artistsString = single.artist.map((item) => item.name).join();

    const params = {
      title: single.title,
      album: single.album,
      artistsString,
    };
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    const response = await fetch(api + query);
    response
      .json()
      .then((data) => {
        // console.log(data);
        setData(data.results);
        setLoading(false);
        console.log(data.results.length);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    // console.log(single);
    doFetch();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingText}>Select any video to download</Text>
        <Text
          style={{
            color: 'gray',
            fontSize: 13,
            fontFamily: 'GothamMedium',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          The first video is downloaded in default mode
        </Text>
      </View>
      {!loading ? (
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log(item);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      minHeight: windowHeight * 0.085,

                      paddingVertical: 2,
                      marginVertical: 7,
                      alignItems: 'flex-start',
                      // justifyContent: 'space-evenly',
                      backgroundColor: '#111111',
                      borderRadius: 10,
                    }}>
                    <Image
                      style={{
                        flex: 1,
                        marginRight: 10,
                        height: '95%',
                        aspectRatio: 1.5 / 1,
                        alignSelf: 'center',
                        borderRadius: 6,
                      }}
                      source={{uri: item.thumbnail}}
                    />
                    <Text style={{...styles.titleText, alignSelf: 'center'}}>
                      {' '}
                      {item.title}
                    </Text>
                    <Text style={{...styles.otherText, alignSelf: 'center'}}>
                      {' '}
                      {item.duration}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View style={{height: windowHeight * 0.07}} />
        </View>
      ) : (
        <Text style={styles.otherText}>Loading...</Text>
      )}
    </View>
  );
};

export default CustomDownload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181820',
    paddingTop: 10,

    justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    padding: 15,
  },
  headingText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 17,
    fontFamily: 'GothamMedium',
  },
  titleText: {
    flex: 4,
    color: 'white',
    fontSize: 15,
    fontFamily: 'Roboto',
    marginHorizontal: 2,
  },
  otherText: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontFamily: 'GothamMedium',
    justifyContent: 'center',
  },
});
