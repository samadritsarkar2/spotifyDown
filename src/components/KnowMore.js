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
              style={{alignSelf: 'center', fontFamily: 'Gotham', fontSize: 35}}>
              FAQ
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{margin: 10}}>
              {/* // Changelog  */}
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Changelog v1.95</Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} Added{' '}
                  <Text style={{fontWeight: 'bold'}}>Custom Downloader</Text> .
                  Long press or tap the more icon while downloading the tracks,
                  to manually select the YT Video. This update hopefully fixes a
                  lot of issues with Downify.
                </Text>
              </View>
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Changelog v1.90</Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} Added Download Queue
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} Improved the way Downloads are handled
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} Now, same track can be downloaded in multiple
                  playlists
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} UI changes and few bug fixes
                </Text>
              </View>
              {/* // ISSUES  */}
              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>Issues :(</Text>
                <Text style={{textDecorationLine: 'line-through'}}>
                  {'\u25CF'} Due to youtube policies, few songs are not
                  downloadable.
                </Text>
                <Text style={{textDecorationLine: 'line-through'}}>
                  {'\u25CF'} Sometimes, other versions of the song is downloaded
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} The above issues can be avoided by using the{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    NEW Custom Downloader feature
                  </Text>{' '}
                  and choosing some other YT video of the same track.
                </Text>
                <Text style={styles.faqAnswer}>
                  {'\u25CF'} If you encounter anything else, feel free to report
                  an issue or DM me. I will definetly work on it.
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
                  2. Paste the link in Add New screen.
                </Text>
                <Text style={styles.faqAnswer}>
                  {' '}
                  3. You can save the Playlist in Library for later.
                </Text>
                <Text style={styles.faqAnswer}>
                  {' '}
                  4. Downloaded tracks will be in Download Folder. Single tap to
                  Play or Long tap to Add to Queue.
                </Text>
              </View>

              <View style={styles.faqOne}>
                <Text style={styles.faqQuestion}>How it Works?</Text>
                <Text style={styles.faqAnswer}>
                  The app searches the songs in your playlist or albums in
                  Youtube and downloads the first result. I will try to make a
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
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 17,
    fontFamily: 'Gotham',
    textTransform: 'uppercase',
  },
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
  },
});
