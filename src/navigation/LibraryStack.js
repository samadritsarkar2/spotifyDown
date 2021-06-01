import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Library from '../components/Library';
import Downloads from '../components/Downloads';
import SavedPlaylists from '../components/SavedPlaylists';

const Stack = createStackNavigator();

const LibraryStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Library"
      headerMode={'none'}
      mode={'modal'}
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: 'transparent'},
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'extend',
            }),
          },
        }),
      }}>
      <Stack.Screen component={Library} name="Library" />
      <Stack.Screen component={SavedPlaylists} name="SavedPlaylists" />
      <Stack.Screen component={Downloads} name="Downloads" />
    </Stack.Navigator>
  );
};

export default LibraryStack;
