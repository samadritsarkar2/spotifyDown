import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  spotifyGreenButton,
  spotifyGreenButtonText,
  windowHeight,
  windowWidth,
} from '../common';

const CustomModal = ({isModalVisible, toggleModal, title, text}) => {
  return (
    <>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}>
        <View style={styles.mainView}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.text}>{text}</Text>

          <TouchableOpacity
            onPress={toggleModal}
            style={[
              spotifyGreenButton,
              {
                width: '100%',
                borderRadius: 0,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                position: 'absolute',
                bottom: 0,
                right: 0,
              },
            ]}>
            <Text style={spotifyGreenButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  mainView: {
    height: windowHeight * 0.23,
    width: windowWidth * 0.9,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
  },
  title: {
    color: 'black',
    fontFamily: 'GothamMedium',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    alignSelf: 'center',
  },
  text: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 15,
    marginTop: 15,
    fontFamily: 'Roboto',
    fontWeight: '600',
    textAlign: 'center',
  },
});
