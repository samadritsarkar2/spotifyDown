import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Library from '../components/Library';
import Downloads from '../components/Downloads';
import SavedPlaylists from '../components/SavedPlaylists';

const Stack = createStackNavigator();

const LibraryStack = () => {
  return (
    <Stack.Navigator initialRouteName="Library" headerMode={'none'}>
      <Stack.Screen component={Library} name="Library" />
      <Stack.Screen component={SavedPlaylists} name="SavedPlaylists" />
      <Stack.Screen component={Downloads} name="Downloads" />
    </Stack.Navigator>
  );
};

export default LibraryStack;
