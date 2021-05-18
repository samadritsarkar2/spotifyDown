/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Routes from './Routes';
import TrackPlayer from "react-native-track-player";


AppRegistry.registerComponent(appName, () => Routes);


TrackPlayer.registerPlaybackService(()=> require("./service"));