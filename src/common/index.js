import RNBackgroundDownloader from 'react-native-background-downloader';
import {Dimensions} from 'react-native';

export const DOWNLOAD_PATH = `${RNBackgroundDownloader.directories.documents}`;
export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;
