import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Library from '../components/Library';

import SavedPlaylists from '../components/SavedPlaylists';
import Downloads from '../components/Downloads';
import DownloadStack from './DownloadStack';
import Donations from '../components/Donation';

const Stack = createStackNavigator();

const LibraryStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Library"
      headerMode={'none'}
      screenOptions={{
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen component={Library} name="Library" />
      <Stack.Screen component={SavedPlaylists} name="SavedPlaylists" />
      <Stack.Screen
        component={DownloadStack}
        name="Downloads"
        options={{headerTitle: 'Downloads', headerBackground: {}}}
      />
      <Stack.Screen component={Donations} name="Donations" />
    </Stack.Navigator>
  );
};

export default LibraryStack;
