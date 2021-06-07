import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import KnowMore from './KnowMore.js';
import SavedPlaylists from './SavedPlaylists';

const Library = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const BetterKnowMore = React.memo(KnowMore);
  useEffect(() => {
    // console.log("rendered")
  }, []);
  return (
    <>
      <View
        style={{flex: 1, backgroundColor: '#181818', paddingHorizontal: 10}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Your Library</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <ScrollView alwaysBounceVertical={true}>
            <TouchableOpacity onPress={() => navigation.navigate('Downloads')}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/down.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Downloads </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('SavedPlaylists')}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/heart.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Saved</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleModal}>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/info.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Know More</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.optionWrapper}>
                <Image
                  source={require('../assets/heart.png')}
                  style={styles.optionIcon}
                />
                <Text style={styles.buttons}>Buy Me a Coffee </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <BetterKnowMore
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
          />
        </View>
      </View>
    </>
  );
};

export default Library;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
    marginTop: '5%',
  },
  heading: {
    color: '#1DB954',
    fontFamily: 'GothamMedium',
    fontSize: 50,
    alignSelf: 'center',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 0,
    justifyContent: 'flex-start',
  },
  buttons: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Gotham',
  },
  optionWrapper: {
    flex: 1,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#111111',
    borderRadius: 10,
  },
  optionIcon: {
    height: 25,
    width: 25,
    marginHorizontal: 10,
  },
});
