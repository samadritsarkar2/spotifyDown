import React from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { colors } from '../../theme';

const LoadingScreen = ({ type = '9CubeGrid', size = 72 }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Spinner size={size} type={type} color={colors.text.primary} />
  </View>
);

export default LoadingScreen;
