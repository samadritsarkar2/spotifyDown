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
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts, fontSize, spacing } from '../../theme';
import { SkeletonTrackList } from './SkeletonTrackRow';

// --- Constants (exported for wrappers that need them) ---
const { height: screenHeight } = Dimensions.get('screen');
export const HEADER_HEIGHT = screenHeight * 0.45;
const NAV_BAR_HEIGHT = (StatusBar.currentHeight || 0) + 56;
const HEADER_DELTA = HEADER_HEIGHT - NAV_BAR_HEIGHT;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// --- Static assets ---
const IMG_DEFAULT_PLAYLIST = require('../../assets/defaultPlaylist.png');
const IMG_BACK = require('../../assets/downArrow.png');

// --- Stable sub-components ---
const ItemSeparator = () => <View style={styles.separator} />;
const ListFooter = () => <View style={styles.listFooter} />;

/**
 * Shared Spotify-style collapsible header with parallax cover,
 * animated nav bar, and FlatList.
 *
 * Props:
 * - playlistName, playlistImage, trackCount, tracks
 * - loading (boolean) — shows full-screen skeleton
 * - headerControls (ReactNode) — injected into metadata block
 * - renderItem (function) — FlatList renderItem
 * - bottomSheet (ReactNode) — pre-built BottomSheetModal
 * - onGoBack (function)
 * - keyExtractor (function, optional)
 */
const CollapsibleTrackList = ({
  playlistName,
  playlistImage,
  trackCount,
  tracks,
  loading,
  headerControls,
  renderItem,
  bottomSheet,
  onGoBack,
  keyExtractor,
}) => {
  // --- Shared values ---
  const scrollY = useSharedValue(0);
  const metadataY = useSharedValue(HEADER_HEIGHT);

  // --- Scroll handler ---
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // --- Animated styles ---

  const coverAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT * 0.4],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }] };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [-64, 0, HEADER_DELTA],
      [0, 0.2, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

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
    const newY = e.nativeEvent.layout.y;
    if (metadataY.value !== newY) {
      metadataY.value = newY;
    }
  }, []);

  // --- Loading gate ---
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <SkeletonTrackList count={10} />
      </View>
    );
  }

  const defaultKeyExtractor = (item, index) =>
    item.id?.toString() || index.toString();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Cover image */}
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
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={11}
        removeClippedSubviews
        keyExtractor={keyExtractor || defaultKeyExtractor}
        ListHeaderComponent={
          <>
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
            <View style={styles.metadataBlock} onLayout={onMetadataLayout}>
              <Text style={styles.playlistTitle}>{playlistName}</Text>
              <Text style={styles.trackCountText}>{trackCount} songs</Text>
              {headerControls}
            </View>
          </>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={ListFooter}
      />

      {/* Nav bar */}
      <View style={styles.navBar}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.navBarBg, navBarBgStyle]} />
        <View style={styles.navBarContent}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onGoBack}
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

      {bottomSheet}
    </View>
  );
};

export default React.memo(CollapsibleTrackList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
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
  flatList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flatListContent: {
    flexGrow: 1,
  },
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
  separator: {
    height: spacing.xs,
    backgroundColor: colors.bg.primary,
  },
  listFooter: {
    height: screenHeight * 0.5,
    backgroundColor: colors.bg.primary,
  },
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
