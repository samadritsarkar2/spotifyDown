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
import {NEW_API, NEWER_API} from '@env';
import {addToDownloadQueue} from '../redux/actions/playlistActions';

const CustomDownload = () => {
  const api = `${NEWER_API}/getCustomDownload?trackId=`;
  // const directAPI = `${NEW_API}/getdirectlink?`;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const dispatch = useDispatch();

  const single = useSelector((state) => state.playlist).customItem;

  const doFetch = async () => {
    // let artistsString = single.artist.map((item) => item.name).join();

    // const params = {
    //   title: single.title,
    //   album: single.album,
    //   artistsString,
    // };
    // let query = Object.keys(params)
    //   .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //   .join('&');

    const response = await fetch(api + single.id);
    response
      .json()
      .then((data) => {
        console.log(data);
        setData(data.results);
        setLoading(false);
      })
      .catch((err) => {
        //TODO: Show error to user
        setLoading(false);
        console.log(err)
      });
  };

  useEffect(() => {
    setLoading(true);
    // console.log(single);
    doFetch();
  }, []);

  const handleClick = async (item) => {
    //
    // console.log("Clicked: ", item);
    setLoading(true);
        // single.title = "cold\/mess";
        single.customDownloadData = item;

        dispatch(addToDownloadQueue(single));
        setLoading(false);
  
  };

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
          The videos are sorted in descending order of views
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
                    handleClick(item);
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
                        aspectRatio: 1 / 1,
                        alignSelf: 'center',
                        borderRadius: 6,
                      }}
                      source={{uri: item.thumbnail}}
                    />
                    <Text style={{...styles.titleText, alignSelf: 'center'}}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        ...styles.otherText,
                        alignSelf: 'center',
                        marginLeft: 5,
                      }}>
                      {' '}
                      {item.duration_string}
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
