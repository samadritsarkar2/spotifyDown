import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import KnowMore from './KnowMore.js';
import analytics from '@react-native-firebase/analytics';
import { IronSourceRewardedVideo } from '@wowmaking/react-native-iron-source';
import { commonStyles, colors, fonts, fontSize, spacing, radii } from '../theme';

const BetterKnowMore = React.memo(KnowMore);

const Library = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);

  useEffect(() => {
    const availableListener = IronSourceRewardedVideo.addEventListener(
      'ironSourceRewardedVideoAvailable',
      () => {},
    );
    const rewardedListener = IronSourceRewardedVideo.addEventListener(
      'ironSourceRewardedVideoAdRewarded',
      async () => {
        ToastAndroid.show(
          'Thanks for watching the Ad. It will help in the development of Project',
          ToastAndroid.LONG,
        );
        await analytics().logEvent('rewardedAd_shown');
      },
    );
    IronSourceRewardedVideo.initializeRewardedVideo();

    return () => {
      if (availableListener && availableListener.remove) availableListener.remove();
      if (rewardedListener && rewardedListener.remove) rewardedListener.remove();
    };
  }, []);

  const showAd = async () => {
    await analytics().logEvent('rewardedAd_clicked');
    IronSourceRewardedVideo.isRewardedVideoAvailable().then((available) => {
      if (available) {
        IronSourceRewardedVideo.showRewardedVideo();
      } else {
        ToastAndroid.show('Ad is not available right now. Thanks tho', ToastAndroid.SHORT);
      }
    });
  };

  const OPTIONS = [
    { icon: require('../assets/down.png'), label: 'Downloads', onPress: () => navigation.navigate('DownloadStack') },
    { icon: require('../assets/heart.png'), label: 'Saved Playlists', onPress: () => navigation.navigate('SavedPlaylists') },
    { icon: require('../assets/info.png'), label: 'Latest Updates', onPress: toggleModal },
    { icon: require('../assets/reward.png'), label: 'Watch a Rewarded Ad', subtitle: 'This will help in the development of this App', onPress: showAd },
  ];

  return (
    <View style={[commonStyles.screenContainer, { paddingHorizontal: spacing.sm }]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Library</Text>
      </View>
      <View style={styles.actions}>
        <ScrollView alwaysBounceVertical={true}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} onPress={opt.onPress}>
              <View style={styles.optionWrapper}>
                <Image source={opt.icon} style={styles.optionIcon} />
                <View>
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  {opt.subtitle && <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>}
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <BetterKnowMore isModalVisible={isModalVisible} toggleModal={toggleModal} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  header: {
    flex: 0.3,
    marginTop: '5%',
  },
  heading: {
    color: colors.accent.primary,
    fontFamily: fonts.heading,
    fontSize: fontSize.display + 14,
    alignSelf: 'center',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  optionWrapper: {
    flex: 1,
    margin: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radii.md,
  },
  optionIcon: {
    height: 25,
    width: 25,
    marginHorizontal: spacing.md,
  },
  optionLabel: {
    fontSize: fontSize.xl,
    color: colors.text.primary,
    fontFamily: fonts.heading,
  },
  optionSubtitle: {
    fontSize: 12,
    color: colors.text.hint,
    fontFamily: fonts.body,
  },
});
