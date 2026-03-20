import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { commonStyles, colors, fonts, fontSize, spacing } from '../theme';
import EmptyState from './shared/EmptyState';

const Error = ({ navigation }) => (
  <View style={commonStyles.screenContainer}>
    <View style={styles.topSection}>
      <Image source={require('../assets/Questions-bro.png')} style={styles.question} />
      <Text style={styles.heading}>Something went wrong!</Text>
      <Text style={styles.body}>Please make sure the playlist is public and accessible,</Text>
      <Text style={styles.body}>or there may be a server issue.</Text>
      <Text style={styles.body}>Try restarting the app.</Text>
    </View>
    <View style={styles.bottomSection}>
      <EmptyState
        actionLabel="Go Back"
        onAction={() => navigation.navigate('NewStack', { screen: 'New' })}
      />
    </View>
  </View>
);

export default Error;

const styles = StyleSheet.create({
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
    fontFamily: fonts.heading,
    fontSize: fontSize.display,
    color: colors.text.primary,
  },
  body: {
    color: colors.text.secondary,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
  },
  bottomSection: {
    flex: 0.4,
    justifyContent: 'flex-start',
  },
});
