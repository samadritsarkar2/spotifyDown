/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Routes from './Routes';
import TrackPlayer from 'react-native-track-player';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent('downify', () => Routes);

TrackPlayer.registerPlaybackService(() => require('./service'));
