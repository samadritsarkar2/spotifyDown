import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, FlatList } from 'react-native';
import allActions from '../redux/actions';
import { windowHeight } from '../common';
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

  return (
    <View style={[commonStyles.screenContainer, { paddingHorizontal: spacing.sm + 4, marginTop: spacing.sm }]}>
      <FlatList
        data={data[activePlaylist].tracks}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => dispatch(allActions.addPlaylistToQueue(activePlaylist))}
              delayLongPress={100}>
              <Image source={require('../assets/play.png')} style={styles.playButtonImg} />
              <Text style={styles.playButtonText}> Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => dispatch(allActions.shufflePlay(activePlaylist))}
              delayLongPress={100}>
              <Image source={require('../assets/shuffle.png')} style={styles.playButtonImg} />
              <Text style={styles.playButtonText}> Shuffle Play</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={<View style={commonStyles.listFooterGap} />}
        renderItem={({ item }) => (
          <TrackRow
            artwork={item.artwork}
            title={item.title}
            subtitle={`${item.artist} - ${item.album}`}
            scrollTitle
            onPress={() => dispatch(allActions.playOne(item))}
            onLongPress={() => handleLongPress(item)}
            rightElement={
              <TouchableOpacity style={styles.moreButton} onPress={() => handleLongPress(item)}>
                <Image source={require('../assets/more.png')} style={commonStyles.iconButton} />
              </TouchableOpacity>
            }
          />
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
  headerRow: {
    flex: 1,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  playButton: {
    ...commonStyles.primaryButton,
    flexDirection: 'row',
    width: '44%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 0,
  },
  playButtonImg: { height: 25, width: 25 },
  playButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: fontSize.lg,
    textTransform: 'capitalize',
  },
  moreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
});
