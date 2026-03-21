import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
import { IronSource } from '@wowmaking/react-native-iron-source';
import { LogBox } from 'react-native';
import { commonStyles, colors, fonts, fontSize, spacing } from '../theme';
import PressableScale from './shared/PressableScale';

LogBox.ignoreLogs([
  'Require cycle:',
  '`new NativeEventEmitter()` ',
  'EventEmitter.removeListener',
]);

const Home = ({ navigation }) => {
  useEffect(() => {
    IronSource.initializeIronSource('118aa3d25', 'downify', {
      validateIntegration: true,
    }).catch(() => {});
  }, []);

  return (
    <View style={commonStyles.screenContainer}>
      <StatusBar backgroundColor={colors.bg.primary} />
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image source={require('../assets/homeLogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.header}>
          Downify<Text style={{ fontSize: fontSize.md }}>v1.98</Text>
        </Text>
      </View>
      <View style={styles.inputBox}>
        <PressableScale onPress={() => navigation.navigate('NewStack', { screen: 'New' })}>
          <View style={commonStyles.primaryButton}>
            <Text style={commonStyles.primaryButtonText}>Download</Text>
          </View>
        </PressableScale>
        <PressableScale onPress={() => navigation.navigate('LibraryStack', { screen: 'Library' })}>
          <View style={commonStyles.primaryButton}>
            <Text style={commonStyles.primaryButtonText}>Your Library</Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    marginTop: '7%',
  },
  logoWrapper: {
    flex: 0.4,
    marginBottom: 0,
  },
  logo: {
    height: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  header: {
    flex: 0.4,
    marginTop: spacing.md,
    fontSize: fontSize.display,
    textAlign: 'center',
    color: colors.text.primary,
    fontFamily: fonts.heading,
  },
  inputBox: {
    flex: 0.5,
    marginVertical: spacing.xl,
  },
});
