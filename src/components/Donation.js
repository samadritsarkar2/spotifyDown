import React, {useState} from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {windowHeight} from '../common';

const Donations = () => {
  const [num, setNum] = useState('');

  const handlePress = (name, amount) => {
    let finalAmount = amount * 100;
    var options = {
      description: name,
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_y3Hb75HPXaG3us',
      amount: finalAmount,
      name: 'Samadrit Sarkar',
      //order_id: 'order_DslnoIgkIDL8Zt', //Replace this with an order_id created using Orders API.

      theme: {color: '#1DB954', backdrop_color: '#1DB954'},
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCustomAmount = () => {
    if (num !== '') {
      let finalVal = parseInt(num, 10);
      // console.log(finalVal, num);
      if (finalVal < 1) {
        Alert.alert('Please enter amount greater than or equal to Re. 1');
        setNum('');
      } else {
        handlePress('Custom', finalVal);
      }
    }
  };

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
          <TouchableOpacity onPress={() => handlePress('Tea', 10)}>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Tea{'  '}☕</Text>
              <Text style={styles.optionSubText}>Rs. 10</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('Pastry', 49)}>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Pastry{'  '}🍰</Text>
              <Text style={styles.optionSubText}>Rs. 49</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('Pizza', 149)}>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>Pizza {'  '}🍕</Text>
              <Text style={styles.optionSubText}>Rs. 149</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('56 bhog', 2000)}>
            <View style={styles.optionWrapper}>
              <Text style={styles.optionText}>56 bhog{'  '}🍱 </Text>
              <Text style={styles.optionSubText}>Rs. 2000</Text>
            </View>
          </TouchableOpacity>
          <View onPress={() => {}}>
            <View style={[styles.optionWrapper]}>
              <TextInput
                style={{
                  color: 'white',
                  width: '50%',
                  borderBottomColor: 'white',
                  borderBottomWidth: 1,
                  alignSelf: 'center',
                }}
                keyboardType={'number-pad'}
                returnKeyType={'done'}
                placeholder={'Enter Custom Amount'}
                placeholderTextColor={'#B3B3b3'}
                value={num}
                onChangeText={(val) => {
                  setNum(val);
                }}
                onSubmitEditing={() => handleCustomAmount()}
              />
              <TouchableOpacity
                style={[styles.optionText, {alignSelf: 'center'}]}
                onPress={() => handleCustomAmount()}>
                <Text style={[styles.optionText, {alignSelf: 'center'}]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
