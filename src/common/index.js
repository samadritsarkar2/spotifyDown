import RNBackgroundDownloader from 'react-native-background-downloader';
import {Dimensions} from 'react-native';
import AdMob from '@react-native-admob/admob';

export const DOWNLOAD_PATH = `${RNBackgroundDownloader.directories.documents}`;
export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;

export const spotifyGreenButton = {
  justifyContent: 'center',
  height: 50,
  width: '60%',
  borderRadius: 30,
  alignSelf: 'center',
  marginTop: 25,
  backgroundColor: '#1DB954',
  paddingHorizontal: 20,
};

export const spotifyGreenButtonText = {
  color: 'white',
  textAlign: 'center',
  fontWeight: '500',
  fontSize: 17,
  fontFamily: 'GothamMedium',
  fontWeight: '700',
  textTransform: 'uppercase',
};

const config = {
  maxAdContentRating: 'T',
  tagForChildDirectedTreatment: false,
  tagForUnderAgeConsent: false,
};

export const initAdMob = async (callback) => {
  await AdMob.initialize()
    .then((value) => {
      AdMob.setRequestConfiguration(config);
      //console.info(value);
    })
    .catch((e) => console.error('Admob initialize error : ', e));

  if (callback) {
    return callback();
  }
};
