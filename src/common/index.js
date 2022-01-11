import {Dimensions} from 'react-native';
import RNFS from 'react-native-fs';

export const DOWNLOAD_PATH = `${RNFS.ExternalDirectoryPath}`;
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
