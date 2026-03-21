import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, spacing, radii } from '../../theme';

const SkeletonTrackRow = () => {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);
  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[{
      flexDirection: 'row',
      height: 60,
      marginVertical: spacing.xs,
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
    }, pulse]}>
      <View style={{
        width: 50,
        height: 50,
        borderRadius: radii.sm,
        backgroundColor: colors.bg.elevated,
      }} />
      <View style={{ flex: 1, marginLeft: spacing.md, justifyContent: 'center' }}>
        <View style={{
          width: '75%',
          height: 14,
          borderRadius: 4,
          backgroundColor: colors.bg.elevated,
        }} />
        <View style={{
          width: '50%',
          height: 10,
          borderRadius: 4,
          backgroundColor: colors.bg.elevated,
          marginTop: spacing.sm,
        }} />
      </View>
    </Animated.View>
  );
};

export const SkeletonTrackList = ({ count = 8 }) => (
  <View style={{ paddingHorizontal: spacing.sm, marginTop: spacing.md }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonTrackRow key={i} />
    ))}
  </View>
);

export default SkeletonTrackRow;
