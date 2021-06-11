import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Donations = () => {
  return (
    <>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View style={styles.header}>
          <Text style={styles.heading}>Support the Devs</Text>
          <Text style={styles.subHeading}>
            Spotify Downloader is Ad-free and to support us, you can donate any
            amount or from the options below.
          </Text>
          <Text style={[styles.subHeading]}>
            More updates and features are on its way.{'   '}Thank you for your
            support! You are awesome 🎉
          </Text>
        </View>
        <ScrollView style={styles.scroller}>
          <TouchableOpacity>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Tea</Text>
              <Text style={styles.optionSubText}>Rs. 10</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

export default Donations;

const styles = StyleSheet.create({
  header: {
    flex: 0.4,
    marginHorizontal: '1%',
  },
  heading: {
    color: '#1DB954',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: '5%',
  },
  subHeading: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  scroller: {
    flex: 0.7,
    marginTop: 15,
  },
  optionWrapper: {
    flex: 1,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'baseline',
    backgroundColor: '#111111',
    borderRadius: 10,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'GothamMedium',
  },
  optionSubText: {
    color: '#6C7A89',
    fontSize: 12,
    fontFamily: 'GothamMedium',
  },
});
