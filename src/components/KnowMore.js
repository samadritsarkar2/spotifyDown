import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';

const KnowMore = ({isModalVisible, toggleModal}) => {
  const handleLink = async (link) => {
    try {
      Linking.openURL(link);
    } catch (error) {
      Snackbar.show({
        text: 'Something  Went Wrong',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              height: '70%',
              width: '95%',
              borderRadius: 10,
            }}>
            <Text
              style={{alignSelf: 'center', fontFamily: 'GothamRoundedMedium', fontSize: 35}}>
              Latest Updates
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{margin: 10}}>
              {/* // Changelog  */}
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Changelog v1.98</Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} Completely changed the{' '}
                  <Text style={{fontWeight: 'bold'}}>Backend</Text>.
                  Changed how the tracks were downloaded and sourced, significantly decreasing errors.
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} Added{' '}
                  <Text style={{fontWeight: 'bold'}}>Player</Text>.
                  Tap on the mini-player while a track is playing to reveal the sleek-clean Player screen, inspired from Spotify's design.
                  With this, the <Text style={{fontWeight: 'bold'}}>seek feature</Text> is unlocked.
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'}
                  <Text style={{fontWeight: 'bold'}}>{' '}Faster Downloads</Text>
                  {' '}Downloads are at least 69% faster than previous versions. Report to me if you face any issue.
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} 
                  <Text style={{fontWeight: 'bold'}}>{' '} UI Changes :</Text>
                  {' '}Many major and minor changes are done. Fonts, color, little tweaks and better animations.
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} 
                  <Text style={{fontWeight: 'bold'}}>{' '} Downloaded Playlists Screen :</Text>
                    {'\n'}Now displays the no. of tracks downloaded.
                    {'\n'}Long tap on it, to open it up in search.
                </Text>
              </View>
           
              {/* // ISSUES  */}
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Issues :(</Text>
                <Text style={styles.faqAnswer}>
                {'\u25CF'} While some tracks are downloading, do not open another new playlist in search. Then, it will mark the track of previous
                    playlist as the track of current playlist.
                </Text>
                <Text style={styles.faqAnswer}>
                {'\u25CF'} Since, YT music is the new source for downloads, few tracks are not found properly there. So, it may not 
                give error as "Unable to Scrap from YT music". Try the custom downloader.
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} If you encounter anything else, feel free to report
                  an issue or DM me in any social media. I will definitely work on it.
                </Text>
              </View>

              {/* // How to use  */}

              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>How to use?</Text>
                <Text style={styles.faqAnswer}>
                  {' '}
                  1. Copy the link of the Playlist/Album(now supported) you want
                  to download{' '}
                </Text>
                <Text style={styles.faqAnswer}>
                  {' '}
                  2. Paste the link in Search screen.
                </Text>
                <Text style={styles.faqAnswer}>
                  {' '}
                  3. You can save the Playlist in Library for later.
                </Text>
                <Text style={styles.faqAnswer}>
                  {' '}
                  4. Downloaded tracks will be in Downloads Folder. Single tap to
                  Play or Long tap to Add to Queue.
                </Text>
              </View>

              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>How it Works?</Text>
                <Text style={styles.faqAnswer}>
                  The app searches the songs in your playlist or albums in
                  Youtube/Music and downloads the most accurate result. I will try to make a
                  detailed System Design doc soon. For more info :{' '}
                  <Text
                    onPress={() =>
                      handleLink(
                        'https://github.com/samadritsarkar2/spotifydown',
                      )
                    }
                    style={{
                      fontSize: 15,

                      color: '#0588BC',
                    }}>
                    {'<GithubRepo here />'}
                  </Text>
                </Text>
              </View>
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Tech Stack?</Text>
                <Text style={styles.faqAnswer}>
                  React Native + Node.Js (Backend server)
                </Text>
              </View>
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Dev?</Text>
                <Text style={(styles.faqAnswer, {fontWeight: 'bold'})}>
                  @samadritsarkar2 -
                  <Text
                    style={{color: '#0588BC'}}
                    onPress={() =>
                      handleLink('https://github.com/samadritsarkar2')
                    }>
                    {' '}
                    Github,{'   '}
                  </Text>
                  <Text
                    style={{color: '#0588BC'}}
                    onPress={() =>
                      handleLink('https://instagram.com/samadritsarkar2')
                    }>
                    Insta,{'  '}
                  </Text>
                  <Text
                    style={{color: '#0588BC'}}
                    onPress={() =>
                      handleLink('https://twitter.com/samadritsarkar2')
                    }>
                    Twitter.{' '}
                  </Text>
                </Text>
              </View>
            </ScrollView>
            <Button title="Close" color={'#1DB954'} onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default KnowMore;

const styles = StyleSheet.create({
 
  faqOne: {
    marginVertical: 5,
  },
  faqQuestion: {
    color: '#181818',
    fontSize: 20,
    fontWeight: 'bold',
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily : 'GothamRoundedBook'
  },
});
