import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {windowHeight} from '../common';

const Donations = () => {
  return (
    <>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View style={styles.header}>
          <Text style={styles.heading}>Support the Devs</Text>
          <Text style={styles.subHeading}>
            Spotify Downloader is Ad-free app with more updates and features on
            its way.
          </Text>
          <Text style={[styles.subHeading]}>
            To support us, you can donate any amount or from the options below.
            Thank you for your support! You are awesome 🎉
          </Text>
        </View>

        <ScrollView style={styles.scroller}>
          <TouchableOpacity>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Tea{'  '}☕</Text>
              <Text style={styles.optionSubText}>Rs. 10</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Pastry{'  '}🍰</Text>
              <Text style={styles.optionSubText}>Rs. 49</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Pizza {'  '}🍕</Text>
              <Text style={styles.optionSubText}>Rs. 149</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>56 bhog{'  '}🍱 </Text>
              <Text style={styles.optionSubText}>Rs. 2000</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Custom</Text>
              <Text style={styles.optionSubText}>Rs. 2000</Text>
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
    marginTop: windowHeight * 0.05,
  },
  optionWrapper: {
    flex: 1,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
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
    fontSize: 15,
    fontFamily: 'GothamMedium',
  },
});
