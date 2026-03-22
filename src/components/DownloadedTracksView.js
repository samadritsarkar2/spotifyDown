import { useNavigation } from '@react-navigation/core';
import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import allActions from '../redux/actions';
import { commonStyles, colors, spacing } from '../theme';
import { useDownloadedTracks } from '../hooks/useDownloadedTracks';
import TrackRow from './shared/TrackRow';
import BottomSheetModal, { ModalOption } from './shared/BottomSheetModal';
import CollapsibleTrackList from './shared/CollapsibleTrackList';

const IMG_SHUFFLE = require('../assets/shuffle.png');
const IMG_PLAY = require('../assets/play.png');
const IMG_MORE = require('../assets/more.png');
const IMG_ADD_TO = require('../assets/addTo.png');
const IMG_BIN = require('../assets/bin.png');

// --- Memo'd track item ---
const DownloadedTrackItem = React.memo(({ item, index, onPress, onLongPress }) => {
  const content = (
    <TrackRow
      artwork={item.artwork}
      title={item.title}
      subtitle={`${item.artist} - ${item.album}`}
      scrollTitle
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      rightElement={
        <TouchableOpacity
          style={commonStyles.moreButton}
          onPress={() => onLongPress(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Image source={IMG_MORE} style={commonStyles.moreIcon} />
        </TouchableOpacity>
      }
    />
  );

  if (index < 10) {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(300)}
        style={commonStyles.trackItemBg}>
        {content}
      </Animated.View>
    );
  }

  return <View style={commonStyles.trackItemBg}>{content}</View>;
});

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

  const tracks = data[activePlaylist]?.tracks || [];
  const playlistName = data[activePlaylist]?.info?.name || '';
  const playlistImage = data[activePlaylist]?.info?.image;

  const onTrackPress = useCallback((item) => {
    dispatch(allActions.playOne(item));
  }, [dispatch]);

  const onGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <DownloadedTrackItem
      item={item}
      index={index}
      onPress={onTrackPress}
      onLongPress={handleLongPress}
    />
  ), [onTrackPress, handleLongPress]);

  const headerControls = (
    <View style={commonStyles.controlsRow}>
      <TouchableOpacity
        style={styles.shuffleBtn}
        onPress={() => dispatch(allActions.shufflePlay(activePlaylist))}>
        <Image source={IMG_SHUFFLE} style={styles.shuffleIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.playFab}
        onPress={() => dispatch(allActions.addPlaylistToQueue(activePlaylist))}>
        <Image source={IMG_PLAY} style={styles.playFabImg} />
      </TouchableOpacity>
    </View>
  );

  const bottomSheet = (
    <BottomSheetModal visible={isVisible} onClose={() => setIsVisible(false)}>
      <ModalOption
        icon={IMG_ADD_TO}
        label="Add to Queue"
        onPress={() => handleAddToQueue(selected)}
      />
      <ModalOption
        icon={IMG_BIN}
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
  );

  return (
    <CollapsibleTrackList
      playlistName={playlistName}
      playlistImage={playlistImage}
      trackCount={tracks.length}
      tracks={tracks}
      loading={false}
      headerControls={headerControls}
      renderItem={renderItem}
      bottomSheet={bottomSheet}
      onGoBack={onGoBack}
    />
  );
};

export default TracksView;

const styles = StyleSheet.create({
  shuffleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleIcon: {
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
});
