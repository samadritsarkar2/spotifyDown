import React, { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Vibration,
  Linking,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal';
import { windowWidth, windowHeight, bottomGap } from '../common';
import { colors, fonts, fontSize as themeFontSize, spacing, radii, commonStyles } from '../theme';
import Spinner from 'react-native-spinkit';
import TextTicker from 'react-native-text-ticker';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePlaylist } from '../hooks/usePlaylist';
import { SkeletonTrackList } from './shared/SkeletonTrackRow';

const Playlist = ({ navigation, route }) => {
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

  return (
    <>
      {loading ? (
        <View style={[styles.wholeScreen, { alignItems: 'stretch' }]}>
          <SkeletonTrackList count={10} />
        </View>
      ) : (
        <>
          <View style={styles.wholeScreen}>
            <View style={styles.playlistHeader}>
              <View
                style={{
                  flex: 0.9,
                  flexDirection: 'column',
                }}>
                <View style={{ alignSelf: 'center', height: '100%', aspectRatio: 1 }}>
                  <Image
                    source={responseInfo.image ? { uri: responseInfo.image } : require('../assets/defaultPlaylist.png')}
                    style={{ height: '100%', width: '100%', borderRadius: radii.md }}
                  />
                  <LinearGradient
                    colors={['transparent', colors.bg.primary]}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, borderBottomLeftRadius: radii.md, borderBottomRightRadius: radii.md }}
                  />
                </View>
                <View
                  style={{
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextTicker
                    style={[styles.playlistId, {}]}
                    duration={10000}
                    scroll={false}
                    repeatSpacer={150}
                    marqueeDelay={2000}>
                    {responseInfo.name}
                  </TextTicker>
                </View>
              </View>
              <View
                style={{
                  flex: 0.3,
                  marginTop: 50,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',

                }}>
                <TouchableOpacity
                  style={styles.downloadAllButton}
                  onPress={() => {
                    handleDownloadAll();
                  }}>
                  <Text style={styles.downloadAllButtonText}>Download All</Text>
                </TouchableOpacity>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      savePlaylist();
                    }}
                    onLongPress={() => {
                      Snackbar.show({
                        text: 'Save this playlist in Library',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'red',
                      });
                    }}>
                    {responseInfo.saved ? (
                      <Image
                        source={require('../assets/red-heart.png')}
                        style={{ height: 30, width: 30 }}
                      />
                    ) : (
                      <Image
                        source={require('../assets/heart.png')}
                        style={{ height: 30, width: 30 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <FlatList
              data={tracks}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.scroller}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              ItemSeparatorComponent={() => <View style={commonStyles.listSeparator} />}
              ListFooterComponent={<View style={{ height: windowHeight * 0.062 }} />}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).duration(300)} style={styles.list}>
                  <TouchableOpacity style={{ flex: 1 }}>
                    <View style={styles.itemWrapper}>
                      <Image
                        style={styles.trackArtwork}
                        source={{ uri: `${item.artwork}` }}
                      />
                      <View style={styles.trackDetails}>
                        <Text style={styles.trackTitle}>{item.title}</Text>
                        <Text style={styles.trackInfo}>
                          {item?.artist[0].name} - {item.album}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {item.downloaded ? (
                    <TouchableOpacity
                      style={{
                        marginHorizontal: 5,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                      onPress={() => {}}>
                      <Image
                        source={require('../assets/check.png')}
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 30 / 2,
                          backgroundColor: colors.accent.primary,
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        marginHorizontal: 5,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                      onPress={() => handleDownload(item)}>
                      {currentDownloading.includes(item) ? (
                        <Spinner
                          style={{ marginBottom: 7, justifyContent: 'center' }}
                          size={30}
                          type={'Circle'}
                          color={'#FFF'}
                        />
                      ) : (
                        <Image
                          source={require('../assets/down.png')}
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 30 / 2,
                            justifyContent: 'center',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={{
                      marginHorizontal: 5,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      setSelected(item);
                      Vibration.vibrate(50);
                      setIsVisible(true);
                    }}>
                    <Image
                      source={require('../assets/more.png')}
                      style={{
                        height: 30,
                        width: 30,
                        justifyContent: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          </View>
        </>
      )}
      <Modal
        isVisible={isVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => setIsVisible(false)}
        onBackButtonPress={() => setIsVisible(false)}
        swipeDirection={['down']}
        propagateSwipe={true}
        useNativeDriver={true}
        deviceWidth={windowWidth}
        style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View style={styles.customModalOverlay}>
          <TouchableOpacity
            style={styles.trackOptionTouchable}
            onPress={() => {
              handleCustomDownload();
            }}>
            <Image
              source={require('../assets/down.png')}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.trackOptionText}>
              Manually choose Youtube video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.trackOptionTouchable}
            onPress={() => {
              setIsVisible(false);
            }}>
            <Image
              source={require('../assets/cancel.png')}
              style={{ width: 22, height: 22 }}
            />
            <Text style={styles.trackOptionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default Playlist;

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.primary,
  },
  container: {
    flex: 1,
    top: 30,
  },
  header: {
    marginTop: spacing.xl,
    fontSize: themeFontSize.xxl + 2,
    textAlign: 'center',
    color: colors.text.primary,
  },
  playlistId: {
    color: colors.text.primary,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: themeFontSize.xl + 5,
    fontFamily: fonts.heading,
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: windowHeight * 0.055,
  },
  trackDetails: {
    flex: 9,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  trackArtwork: {
    flex: 1,
    marginRight: spacing.sm,
    height: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
    padding: spacing.sm,
  },
  trackTitle: {
    color: colors.text.primary,
    fontSize: themeFontSize.lg,
    fontFamily: fonts.body,
  },
  trackInfo: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontFamily: fonts.heading,
  },
  downloadAllButton: {
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.accent.primary,
    marginVertical: spacing.xl,
    height: windowHeight * 0.05,
    width: windowWidth * 0.3,
    alignSelf: 'center',
  },
  downloadAllButtonText: {
    color: colors.text.primary,
    alignSelf: 'center',
    fontFamily: fonts.heading,
    fontSize: themeFontSize.lg,
  },
  playlistHeader: {
    flex: 0.5,
    marginVertical: spacing.md,
    marginTop: spacing.lg,
    justifyContent: 'space-evenly',
    width: '90%',
  },
  scroller: {
    flex: 0.7,
    margin: spacing.sm,
    width: '96%',
    marginBottom: 0,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customModalOverlay: {
    ...commonStyles.bottomSheetContainer,
    width: windowWidth,
  },
  trackOptionTouchable: {
    ...commonStyles.bottomSheetOption,
  },
  trackOptionText: {
    ...commonStyles.bottomSheetOptionText,
  },
});
