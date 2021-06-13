import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Library from '../components/Library';
import Downloads from '../components/Downloads';
import SavedPlaylists from '../components/SavedPlaylists';
import Donations from '../components/Donation';

const Stack = createStackNavigator();

const LibraryStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Library"
      headerMode={'none'}
      screenOptions={{
        detachPreviousScreen: true,
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen component={Library} name="Library" />
      <Stack.Screen component={SavedPlaylists} name="SavedPlaylists" />
      <Stack.Screen component={Downloads} name="Downloads" options={{}} />
      <Stack.Screen component={Donations} name="Donations" />
    </Stack.Navigator>
  );
};

export default LibraryStack;
