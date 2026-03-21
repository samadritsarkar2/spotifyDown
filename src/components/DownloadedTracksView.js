import { useNavigation } from '@react-navigation/core';
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import allActions from '../redux/actions';
import { colors, fonts, fontSize, spacing } from '../theme';
import { useDownloadedTracks } from '../hooks/useDownloadedTracks';
import TrackRow from './shared/TrackRow';
import BottomSheetModal, { ModalOption } from './shared/BottomSheetModal';

// --- Constants ---
const { height: screenHeight } = Dimensions.get('screen');
const HEADER_HEIGHT = screenHeight * 0.45;
const NAV_BAR_HEIGHT = (StatusBar.currentHeight || 0) + 56;
const HEADER_DELTA = HEADER_HEIGHT - NAV_BAR_HEIGHT;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// --- Static assets (cached at module level) ---
const IMG_DEFAULT_PLAYLIST = require('../assets/defaultPlaylist.png');
const IMG_SHUFFLE = require('../assets/shuffle.png');
const IMG_PLAY = require('../assets/play.png');
const IMG_MORE = require('../assets/more.png');
const IMG_BACK = require('../assets/downArrow.png');
const IMG_ADD_TO = require('../assets/addTo.png');
const IMG_BIN = require('../assets/bin.png');

// --- Stable sub-components (avoid re-creation per render) ---
const ItemSeparator = () => <View style={styles.separator} />;
const ListFooter = () => <View style={styles.listFooter} />;

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
  const trackCount = tracks.length;
  const playlistName = data[activePlaylist]?.info?.name || '';
  const playlistImage = data[activePlaylist]?.info?.image;

  // --- Shared values ---
  const scrollY = useSharedValue(0);
  const metadataY = useSharedValue(HEADER_HEIGHT); // refined by onLayout

  // --- Scroll handler ---
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // --- Animated styles ---

  // Cover: parallax drift (moves up at 40% of scroll speed)
  const coverAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT * 0.4],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }] };
  });

  // Cover: darkening overlay
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [-64, 0, HEADER_DELTA],
      [0, 0.2, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // Nav bar background — opaque just before the metadata reaches the nav bar
  const navBarBgStyle = useAnimatedStyle(() => {
    const threshold = metadataY.value - NAV_BAR_HEIGHT;
    const opacity = interpolate(
      scrollY.value,
      [threshold - 40, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // Nav bar title — only after inline title is fully behind the nav bar
  const navTitleStyle = useAnimatedStyle(() => {
    const threshold = metadataY.value - NAV_BAR_HEIGHT;
    const opacity = interpolate(
      scrollY.value,
      [threshold + 30, threshold + 50],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // Gradient: animated height
  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0],
      [0, HEADER_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const onMetadataLayout = useCallback((e) => {
    metadataY.value = e.nativeEvent.layout.y;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Cover image (absolute, behind everything) */}
      <Animated.View style={[styles.coverContainer, coverAnimatedStyle]}>
        <Image
          source={playlistImage ? { uri: playlistImage } : IMG_DEFAULT_PLAYLIST}
          style={styles.coverImage}
        />
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.coverOverlay, overlayAnimatedStyle]}
        />
      </Animated.View>

      {/* Scrollable content */}
      <AnimatedFlatList
        data={tracks}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListHeaderComponent={
          <>
            {/* Transparent poster spacer — cover shows through */}
            <View style={styles.posterSpacer}>
              <Animated.View style={[styles.gradientContainer, gradientAnimatedStyle]}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.2)', colors.bg.primary]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0.3 }}
                  end={{ x: 0, y: 1 }}
                />
              </Animated.View>
            </View>

            {/* Metadata + Controls — single opaque block */}
            <View style={styles.metadataBlock} onLayout={onMetadataLayout}>
              <Text style={styles.playlistTitle}>{playlistName}</Text>
              <Text style={styles.trackCountText}>{trackCount} songs</Text>
              <View style={styles.controlsRow}>
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
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 10) * 50).duration(300)}
            style={styles.trackItemBg}>
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
                  <Image source={IMG_MORE} style={styles.moreIcon} />
                </TouchableOpacity>
              }
            />
          </Animated.View>
        )}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={ListFooter}
      />

      {/* Nav bar (absolute, on top of everything) */}
      <View style={styles.navBar}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.navBarBg, navBarBgStyle]} />
        <View style={styles.navBarContent}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={IMG_BACK} style={styles.backIcon} />
          </TouchableOpacity>
          <Animated.Text
            style={[styles.navTitle, navTitleStyle]}
            numberOfLines={1}>
            {playlistName}
          </Animated.Text>
          <View style={styles.navButton} />
        </View>
      </View>

      {/* Bottom Sheet Modal */}
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
    </View>
  );
};

export default TracksView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },

  // Cover
  coverContainer: {
    ...StyleSheet.absoluteFillObject,
    height: HEADER_HEIGHT + 100,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  coverOverlay: {
    backgroundColor: 'black',
  },

  // FlatList
  flatList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flatListContent: {
    flexGrow: 1,
  },

  // Poster spacer
  posterSpacer: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },

  // Metadata + Controls as one seamless block
  metadataBlock: {
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  playlistTitle: {
    color: colors.text.primary,
    fontSize: fontSize.xl,
    fontFamily: fonts.heading,
  },
  trackCountText: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    marginTop: spacing.xs,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
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

  // Track items
  trackItemBg: {
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.md,
  },
  separator: {
    height: spacing.xs,
    backgroundColor: colors.bg.primary,
  },
  moreButton: {
    padding: spacing.sm,
  },
  moreIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text.secondary,
  },
  listFooter: {
    height: screenHeight * 0.5,
    backgroundColor: colors.bg.primary,
  },

  // Nav bar
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAV_BAR_HEIGHT,
    paddingTop: StatusBar.currentHeight || 0,
  },
  navBarBg: {
    backgroundColor: colors.bg.primary,
  },
  navBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text.primary,
    transform: [{ rotate: '90deg' }],
  },
  navTitle: {
    flex: 1,
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontFamily: fonts.heading,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
});
