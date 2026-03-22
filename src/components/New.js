import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import allActions from '../redux/actions/index';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
var parse = require('url-parse');
import analytics from '@react-native-firebase/analytics';
import { commonStyles, colors, fonts, fontSize, spacing, radii } from '../theme';
import PressableScale from './shared/PressableScale';

const New = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchApi = async () => {
    setLoading(true);
    let URL = parse(url);
    let pathArr = URL.pathname.split('/');

    let playlistIndex = pathArr.indexOf('playlist');
    let albumIndex = pathArr.indexOf('album');
    let finalIndex;

    if (albumIndex === -1 && playlistIndex !== -1) {
      finalIndex = playlistIndex;
    } else if (playlistIndex === -1 && albumIndex !== -1) {
      finalIndex = albumIndex;
    } else {
      finalIndex = -1;
    }

    let URlID = pathArr[finalIndex + 1];
    if (
      URL.host !== 'open.spotify.com' ||
      (pathArr[finalIndex] !== 'playlist' && pathArr[finalIndex] !== 'album')
    ) {
      setLoading(false);
      Alert.alert(
        'Link not supported',
        "Provide link in the format 'open.spotify.com/playlist'",
        [{ text: 'OK' }],
        { cancelable: true },
      );
    } else {
      dispatch(allActions.addNew(URlID));
      setLoading(false);
      await analytics().logEvent('new_playlist', { id: URlID });
      navigation.navigate('Playlist');
    }
  };

  return (
    <View style={commonStyles.screenContainer}>
      <StatusBar backgroundColor={colors.bg.primary} />
      <View style={styles.container}>
        <Image source={require('../assets/Headphone-amico.png')} style={styles.logo} />
      </View>
      <View style={styles.inputBox}>
        <View style={styles.searchBar}>
          <Image
            source={require('../assets/magnifying-glass.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="Enter Spotify Album/Playlist Link"
            placeholderTextColor={colors.text.hint}
          />
          {url ? (
            <TouchableOpacity onPress={() => setUrl('')}>
              <Image
                source={require('../assets/close.png')}
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <PressableScale onPress={fetchApi}>
          <View style={commonStyles.primaryButton}>
            <Text style={commonStyles.primaryButtonText}>Submit</Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
};

export default New;

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    marginTop: spacing.xl,
  },
  logo: {
    height: '85%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  inputBox: {
    flex: 0.6,
    marginTop: spacing.xs,
  },
  searchBar: {
    backgroundColor: colors.bg.elevated,
    marginHorizontal: spacing.xl,
    width: '85%',
    height: 52,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm + 4,
  },
  searchIcon: {
    height: 22,
    width: 22,
    marginRight: spacing.sm,
    tintColor: colors.text.hint,
  },
  clearIcon: {
    height: 20,
    width: 20,
    marginLeft: spacing.sm,
    tintColor: colors.text.hint,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
  },
});
