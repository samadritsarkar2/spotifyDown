import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, spacing, radii } from '../../theme';
import { windowHeight } from '../../common';

const SkeletonPlaylistCard = () => {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);
  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[{
      flexDirection: 'row',
      height: windowHeight * 0.08,
      marginVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      backgroundColor: colors.bg.card,
      borderRadius: radii.md,
    }, pulse]}>
      <View style={{ width: 55, height: 55, borderRadius: radii.sm, backgroundColor: colors.bg.elevated }} />
      <View style={{ flex: 1, marginLeft: spacing.md, justifyContent: 'center' }}>
        <View style={{ width: '60%', height: 16, borderRadius: 4, backgroundColor: colors.bg.elevated }} />
        <View style={{ width: '30%', height: 12, borderRadius: 4, backgroundColor: colors.bg.elevated, marginTop: spacing.sm }} />
      </View>
    </Animated.View>
  );
};

export const SkeletonPlaylistList = ({ count = 4 }) => (
  <View style={{ paddingHorizontal: spacing.sm + 4 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPlaylistCard key={i} />
    ))}
  </View>
);

export default SkeletonPlaylistCard;
