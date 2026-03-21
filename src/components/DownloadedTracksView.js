import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import allActions from '../redux/actions';
import { commonStyles, colors, fonts, fontSize, spacing, radii } from '../theme';
import { useDownloadedTracks } from '../hooks/useDownloadedTracks';
import TrackRow from './shared/TrackRow';
import BottomSheetModal, { ModalOption } from './shared/BottomSheetModal';

const TracksView = () => {
  const navigation = useNavigation();
  const {
    selected,
    setSelected,
    isVisible,
    setIsVisible,
    data,
    activePlaylist,
    confirmTracks,
    handleLongPress,
    handleAddToQueue,
    dispatch,
  } = useDownloadedTracks(navigation);

  const trackCount = data[activePlaylist]?.tracks?.length || 0;

  return (
    <View style={[commonStyles.screenContainer, { paddingHorizontal: spacing.md }]}>
      <FlatList
        data={data[activePlaylist].tracks}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.trackCount}>{trackCount} songs</Text>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => dispatch(allActions.shufflePlay(activePlaylist))}>
                <Image source={require('../assets/shuffle.png')} style={styles.iconBtnImg} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playFab}
                onPress={() => dispatch(allActions.addPlaylistToQueue(activePlaylist))}>
                <Image source={require('../assets/play.png')} style={styles.playFabImg} />
              </TouchableOpacity>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        ListFooterComponent={<View style={commonStyles.listFooterGap} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).duration(300)}>
            <TrackRow
              artwork={item.artwork}
              title={item.title}
              subtitle={`${item.artist} - ${item.album}`}
              scrollTitle
              onPress={() => dispatch(allActions.playOne(item))}
              onLongPress={() => handleLongPress(item)}
              rightElement={
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => handleLongPress(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Image source={require('../assets/more.png')} style={{ width: 20, height: 20, tintColor: colors.text.secondary }} />
                </TouchableOpacity>
              }
            />
          </Animated.View>
        )}
      />
      <BottomSheetModal visible={isVisible} onClose={() => setIsVisible(false)}>
        <ModalOption
          icon={require('../assets/addTo.png')}
          label="Add to Queue"
          onPress={() => handleAddToQueue(selected)}
        />
        <ModalOption
          icon={require('../assets/bin.png')}
          label="Delete"
          onPress={() => {
            dispatch(allActions.deleteTrack(selected));
            setTimeout(() => {
              confirmTracks();
              setSelected(null);
              setIsVisible(false);
            }, 100);
          }}
        />
      </BottomSheetModal>
    </View>
  );
};

export default TracksView;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  trackCount: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnImg: {
    width: 24,
    height: 24,
    tintColor: colors.accent.primary,
  },
  playFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  playFabImg: {
    width: 22,
    height: 22,
    tintColor: colors.bg.primary,
    marginLeft: 2,
  },
  moreButton: {
    padding: spacing.sm,
  },
});
