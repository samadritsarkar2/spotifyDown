import { Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import { commonStyles } from '../theme';

// Path & dimensions (non-style exports)
export const DOWNLOAD_PATH = `${RNFS.ExternalDirectoryPath}`;
export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;
export const bottomGap = 0.115;

// Font names (kept for files still referencing these)
export const GothamRoundedBook = 'GothamRoundedBook';
export const GothamRoundedMedium = 'GothamRoundedMedium';

// Legacy button styles — maps to theme for backward compat
// New code should import from '../theme' directly
export const spotifyGreenButton = commonStyles.primaryButton;
export const spotifyGreenButtonText = commonStyles.primaryButtonText;
