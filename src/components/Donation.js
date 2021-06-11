import React from 'react';

import {Image, StyleSheet, Text, View} from 'react-native';

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
          <Text style={styles.subHeading}>
            More updates and features are on its way. You are awesome 🎉
          </Text>
        </View>
      </View>
    </>
  );
};

export default Donations;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
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
});
