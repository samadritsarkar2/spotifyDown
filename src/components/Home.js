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
  Linking
} from 'react-native';

import Snackbar from "react-native-snackbar"
import Modal from 'react-native-modal';





const App = ({navigation, route}) => {
    const [id, setId] = useState('');
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);


    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const handleLink = async (link) => {
        try {
          Linking.openURL(link);
        } catch (error) {
          Snackbar.show({
            text:
              'Something  Went Wrong',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
        }
    }

    return (
      <>
        <View style={{flex: 1, backgroundColor: '#181818', justifyContent : 'center'}}>
          <StatusBar backgroundColor={'#282828'} />
          <View style={styles.container}>
                  <View style={styles.logoWrapper}> 
                    <Image
                      source={require('../../assets/homeLogo.png')}
                      style={styles.logo}></Image>
                  </View>
                <Text style={styles.header}>Spotify Downloader</Text>
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
                <Image source={require('../../assets/info.png')} style={{height : 30, width : 30, }} />
                  <Text style={styles.text}>Know More</Text>
                </TouchableOpacity>
          </View>
        </View>
        <Modal isVisible={isModalVisible} >
                  <View style={{flex: 1, justifyContent : 'center', alignItems : 'center' }}>

                    <View style={{backgroundColor : 'white', height : '70%', width : '95%', borderRadius : 10}}>

                      <Text style={{alignSelf : 'center', fontFamily : 'Gotham', fontSize : 35}} >FAQ</Text>

                      <ScrollView showsVerticalScrollIndicator={false} style={{margin : 10,}} >
                        
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>How to use?</Text>
                            <Text style={styles.faqAnswer}> 1. Copy the link of the playlist you want to download </Text>
                            <Text style={styles.faqAnswer}> 2. Paste the link in Add New screen. Now, you can download the tracks. </Text>
                            <Text style={styles.faqAnswer}> 3. You can save the Playlist in Library for later. </Text>
                        </View>

                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>How it Works?</Text>
                            <Text style={styles.faqAnswer} >The app searches the songs in your playlist in Youtube and downloads the first result. 
                              I will try to make a detailed System Design doc soon.</Text>
                              <Text 
                              onPress={() => handleLink("https://github.com/samadritsarkar2/spotifydown")} 
                              style={{alignSelf : 'center', fontSize : 15, marginTop : 5, color : '#0588BC'}}>
                                {'<GithubRepo here />'}
                                </Text>
                        </View>
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>Upcoming Features?</Text>
                            <Text style={styles.faqAnswer} >I plan to add in-app Music Player and <Text style={{color : '#1DB954'}}>Spotify</Text> login, so that no need of copy-pasting playlist links and few more.
                               Also, I know I suck in UI design :( Will improve on that!
                                </Text>
                        </View>
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>Tech Stack?</Text>
                            <Text style={styles.faqAnswer} >React Native + Node.Js (Backend server)</Text>
                        </View>
                        <View style={styles.faqOne} >
                            <Text style={styles.faqQuestion}>Dev?</Text>
                            <Text style={styles.faqAnswer, {fontWeight : 'bold'}} >@samadritsarkar2 - 
                              <Text style={{color : '#0588BC'}} onPress={() => handleLink("https://github.com/samadritsarkar2")} > Github, </Text>
                              <Text style={{color : '#0588BC'}} onPress={() => handleLink("https://instagram.com/samadritsarkar2")} >Insta, </Text>
                              <Text style={{color : '#0588BC'}} onPress={() => handleLink("https://twitter.com/samadritsarkar2")} >Twitter. </Text>
                            </Text>  
                        </View>

                      </ScrollView>
                      <Button title="Close" color={'#1DB954'} onPress={toggleModal} />
                    </View>
                  </View>
            </Modal>
      </>
    );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
   marginTop : '7%',
  },
  logoWrapper : {
    flex : 0.5,
    marginBottom : 0,

  },
  logo: {
    height: '100%',
    aspectRatio : 1/1,
    alignSelf : 'center',
  },
  header: {
      flex : 0.4,
      marginTop : 15,
      fontSize : 33,
      fontWeight : 'bold',
      textAlign : 'center',
    color: 'white',
    fontFamily : 'Montserrat',
   },
  inputBox : {
      flex : 0.5,
      marginVertical : 20
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
      marginTop : 25,
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
      fontSize : 14,
  }
});