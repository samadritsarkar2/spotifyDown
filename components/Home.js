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
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
// import Spinner from 'react-native-loading-spinner-overlay';
var parse = require('url-parse')
import Modal from 'react-native-modal';




const App = ({navigation, route}) => {
    const [id, setId] = useState('');
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);


    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    return (
      <>
        <View style={{flex: 1, backgroundColor: '#181818'}}>
          <StatusBar backgroundColor={'#282828'} />
          <View style={{position : 'absolute', top : 10, right : 10}} >
            
          </View>
          <View style={styles.container}>
            <Image
              source={require('../assets/homeLogo.png')}
              style={styles.logo}></Image>
            <Text style={styles.header}>Spotify Offline Downloader</Text>
          </View>
          <View style={styles.inputBox}>
            <TouchableOpacity style={styles.submit} onPress={() => { navigation.navigate('New') }}>
              <Text
                style={styles.text}>
                Enter new Playlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submit} onPress={() => {navigation.navigate('Library')}}>
              <Text style={styles.text}>Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.knowMore} onPress={() => { toggleModal() }}>
            <Image source={require('../assets/info.png')} style={{height : 30, width : 30, }} />
              <Text style={styles.text}>Know More</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={isModalVisible} >
                  <View style={{flex: 1, justifyContent : 'center', alignItems : 'center' }}>
                    <View style={{backgroundColor : 'white', height : '50%', width : '90%', borderRadius : 10}}>
                      <Text style={{alignSelf : 'center', fontFamily : 'Gotham', fontSize : 35}} >FAQ</Text>
                      <View style={{margin : 10,}} >
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>How it Works?</Text>
                            <Text>The app searches the songs in your playlist in Youtube and downloads the first result. I will try to make a detailed System Design doc soon.</Text>
                        </View>
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>Upcoming Features?</Text>
                            <Text>I plan to add in-app Music Player and <Text style={{color : '#1DB954'}}>Spotify</Text> login, so that no need of copy-pasting playlist links and few more.
                               Also, I know I suck in UI design :( Will improve on that!
                                </Text>
                        </View>
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>Tech Stack?</Text>
                            <Text>React Native + Node.Js (Backend server)</Text>
                        </View>
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>Dev?</Text>
                            <Text>Samadrit Sarkar</Text>
                        </View>

                      </View>
                      <Button title="Hide modal" onPress={toggleModal} />
                    </View>
                  </View>
            </Modal>
      </>
    );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   top : 50,
  },
  logo: {
    height: 200,
    width: 200,
    alignSelf : 'center'
  },
  header: {
      marginTop : 20,
      fontSize : 30,
      textAlign : 'center',
    color: 'white',
    fontFamily : 'Montserrat'
   },
  inputBox : {
      flex : 1,
      marginTop : -40,
  },
  input: {
    color: 'white',
    marginHorizontal: 20,
    height: 50,
    width : '70%',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    alignSelf : 'center',
    
  },
  submit : {

    justifyContent : "center",
    height : 50,
    width : '60%',
    borderRadius : 30,
    alignSelf : "center",
    marginTop : 25,
    backgroundColor : "#1DB954",
    paddingHorizontal : 20
    
    },
    knowMore : {
      display : 'flex',
      flexDirection : 'row',
      justifyContent : "space-evenly",
      alignItems : 'center',
      alignSelf : "center",
      height : 50,
      width : '60%',
      borderRadius : 30,
      marginTop : 35,
      backgroundColor : "#ff3c3c",
      paddingHorizontal : 20
      
    },
    text : {
      color: 'white',
      textAlign: 'center',
      fontWeight: "500",
      fontSize : 17,
      fontFamily : 'Gotham',
      textTransform : 'uppercase'
    },
    faqOne : {
      marginVertical : 5
    },
  faqQuestion : {
  
    color : '#181818', 
    fontSize : 20,
     fontWeight : 'bold'
    },
  faqAnswer : {

  }
});