import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import allActions from "../redux/actions/index";

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
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics"



const New = ({navigation, route}) => {
    const [id, setId] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [playlistData, setPlaylistData] = useState();
    const [fetched, setFetched] = useState(false);
    const [visible,setVisible] = useState(false);
    const [downloadPercent, setDownloadPercent] = useState(0);

    const dispatch = useDispatch();



    const fetchApi = async () => {   
      setLoading(true);
      let URL = parse(url)
      let URlID = URL.pathname.split('/')[2]
      // Santiation of the input URL
      if(URL.host != 'open.spotify.com'|| URL.pathname.split('/')[1] != 'playlist')
      {
        setLoading(false)
        Alert.alert(
          "Link not supported",
          "Provide link in the format 'open.spotify.com/playlist'",
          [
         
            { text: "OK", onPress: () => {} }
          ],
          { cancelable: true,  }
        )
      } else {
        setId(URlID)
        dispatch(allActions.addNew(URlID))
        // await AsyncStorage.setItem('@currentItem', JSON.stringify(res))

         setFetched(true)
          setLoading(false);
          await analytics().logEvent('new_playlist',{
            id : URlID
          })
          navigation.navigate('Playlist');
      }
  }

    return (
      <>
          <>
            <View style={{flex: 1, backgroundColor: '#181818'}}>
              <StatusBar backgroundColor={'#282828'} />
              <View style={styles.container}>
              <Image
              source={require('../assets/Headphone-amico.png')}
              style={styles.logo}></Image>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={url}
                  onChangeText={(value) => {
                    setUrl(value);
                  }}
                  placeholder={'Enter Spotify Playlist Link'}
                  placeholderTextColor={'#B3B3b3'}
        
                />
                <TouchableOpacity style={styles.submit} onPress={fetchApi}>
                  <Text style={styles.text}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
      </>
    );
}

export default New;

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
   marginTop : 30,
  },
  logo: {
    height: '100%',
    aspectRatio : 1/1,
    alignSelf : 'center'
  },
  header: {
      marginTop : 20,
      fontSize : 30,
      textAlign : 'center',
    color: 'white',
  },
  inputBox : {
      flex : 0.6,
  },
  input: {
    color: 'white',
    marginHorizontal: 20,
    
    width : '70%',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    alignSelf : 'center',
    
  },
  submit : {
    justifyContent : "center",
    borderRadius : 30,
    backgroundColor : "#1DB954",
    marginVertical : 20,
    padding : 20,
    height: 50,
    width : '70%',
    alignSelf : 'center'
    
    },
    playlistHeader : {
        flex : 0.6,
        marginVertical : 15,
        marginTop : 25,
         justifyContent : 'space-evenly', 
         width : '90%'
      },
       scroller : {
         flex : 0.54,
         margin : 10,
         width : '90%',
         
         marginBottom : 20,
         
       }, list : {
        flex : 1, flexDirection : 'row',
         marginVertical : 10, 
        
       },
       text : {
        color: 'white',
        textAlign: 'center',
        fontWeight: "500",
        fontSize : 17,
        fontFamily : 'Gotham',
        textTransform : 'uppercase'
      },
       modalContainer: {
        alignItems: 'center',
       // backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
      },
      modalHeading: {
        fontSize: 25,
        color : 'red',
        marginBottom: 15,
      },
});