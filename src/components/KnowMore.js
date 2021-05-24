import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Button,
    ScrollView,
    Linking
  } from 'react-native';
  import Modal from 'react-native-modal';



const KnowMore = ({isModalVisible, toggleModal}) => {

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
    )
}

export default KnowMore;

const styles = StyleSheet.create({
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
})