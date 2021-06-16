import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';

const Error = ({navigation}) => {
  return (
    <>
      <View style={styles.mainView}>
        <View style={styles.topSection}>
          <Image
            source={require('../assets/Questions-bro.png')}
            style={styles.question}
          />
          <Text style={styles.heading}>Something went wrong!</Text>

          <Text style={{color: 'white'}}>
            Please, check the link and try again,
          </Text>
          <Text style={{color: 'white'}}>or, Server issue,</Text>
          <Text style={{color: 'white'}}>
            or, idk. Please try to restart the app.
          </Text>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              navigation.navigate('NewStack', {screen: 'New'});
            }}>
            <Text style={styles.text}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Error;

const styles = StyleSheet.create({
  mainView: {flex: 1, backgroundColor: '#181818', alignItems: 'center'},
  topSection: {
    flex: 0.6,
    alignItems: 'center',
    marginTop: '20%',
  },
  question: {
    height: 300,
    width: 300,
  },
  heading: {
    fontFamily: 'Gotham',
    fontSize: 35,
    color: 'white',
  },
  bottomSection: {
    flex: 0.4,
    justifyContent: 'flex-start',
  },
  submit: {
    justifyContent: 'center',
    height: 50,
    width: '60%',
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 25,
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 20,
    fontFamily: 'Gotham',
    textTransform: 'uppercase',
  },
});
