import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Vibration } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Spinner from 'react-native-spinkit';
import { commonStyles, colors, spacing } from '../theme';
import { usePlaylist } from '../hooks/usePlaylist';
import TrackRow from './shared/TrackRow';
import BottomSheetModal, { ModalOption } from './shared/BottomSheetModal';
import CollapsibleTrackList from './shared/CollapsibleTrackList';

const IMG_DOWN = require('../assets/down.png');
const IMG_CHECK = require('../assets/check.png');
const IMG_MORE = require('../assets/more.png');
const IMG_HEART = require('../assets/heart.png');
const IMG_HEART_RED = require('../assets/red-heart.png');
const IMG_CANCEL = require('../assets/cancel.png');

// --- Memo'd track item ---
const PlaylistTrackItem = React.memo(({
  item,
  index,
  currentDownloading,
  onDownload,
  onMore,
}) => {
  const isDownloading = currentDownloading.some((d) => d.id === item.id);
  const artistName = item.artist?.[0]?.name || '';

  return (
    <View style={commonStyles.trackItemBg}>
      <TrackRow
        artwork={item.artwork}
        title={item.title}
        subtitle={`${artistName} - ${item.album}`}
        rightElement={
          <View style={styles.rightActions}>
            {item.downloaded ? (
              <Image source={IMG_CHECK} style={styles.checkIcon} />
            ) : (
              <TouchableOpacity onPress={() => onDownload(item)}>
                {isDownloading ? (
                  <Spinner size={26} type="Circle" color={colors.text.primary} />
                ) : (
                  <Image source={IMG_DOWN} style={styles.downloadIcon} />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={commonStyles.moreButton}
              onPress={() => onMore(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Image source={IMG_MORE} style={commonStyles.moreIcon} />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
});

const Playlist = ({ navigation }) => {
  const isFocused = useIsFocused();
  const {
    selected,
    setSelected,
    isVisible,
    setIsVisible,
    responseInfo,
    tracks,
    loading,
    currentDownloading,
    handleDownload,
    handleDownloadAll,
    savePlaylist,
    handleCustomDownload,
  } = usePlaylist(navigation, isFocused);

  const onMore = useCallback((item) => {
    setSelected(item);
    Vibration.vibrate(50);
    setIsVisible(true);
  }, []);

  const onGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const renderItem = useCallback(({ item, index }) => (
    <PlaylistTrackItem
      item={item}
      index={index}
      currentDownloading={currentDownloading}
      onDownload={handleDownload}
      onMore={onMore}
    />
  ), [currentDownloading, handleDownload, onMore]);

  const headerControls = (
    <View style={commonStyles.controlsRow}>
      <TouchableOpacity style={styles.downloadAllBtn} onPress={handleDownloadAll}>
        <Image source={IMG_DOWN} style={styles.downloadAllIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={savePlaylist}>
        <Image
          source={responseInfo?.saved ? IMG_HEART_RED : IMG_HEART}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </View>
  );

  const bottomSheet = (
    <BottomSheetModal visible={isVisible} onClose={() => setIsVisible(false)}>
      <ModalOption
        icon={IMG_DOWN}
        label="Manually choose Youtube video"
        onPress={handleCustomDownload}
      />
      <ModalOption
        icon={IMG_CANCEL}
        label="Cancel"
        onPress={() => setIsVisible(false)}
      />
    </BottomSheetModal>
  );

  return (
    <CollapsibleTrackList
      playlistName={responseInfo?.name || ''}
      playlistImage={responseInfo?.image}
      trackCount={tracks?.length || 0}
      tracks={tracks || []}
      loading={loading}
      headerControls={headerControls}
      renderItem={renderItem}
      bottomSheet={bottomSheet}
      onGoBack={onGoBack}
    />
  );
};

export default Playlist;

const styles = StyleSheet.create({
  downloadAllBtn: {
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
  downloadAllIcon: {
    width: 22,
    height: 22,
    tintColor: colors.bg.primary,
  },
  heartIcon: {
    width: 30,
    height: 30,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent.primary,
  },
  downloadIcon: {
    width: 26,
    height: 26,
  },
});
