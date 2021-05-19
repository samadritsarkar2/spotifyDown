import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

const ProgressBar = ({progress, backgroundColor = '#fff'}) => {
  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.quad,
    }).start();
  }, [progress]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  return (
    <View style={[styles.progressBar, {backgroundColor}]}>
      <Animated.View
        style={([StyleSheet.absoluteFill], {backgroundColor: '#008080', width})}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
});