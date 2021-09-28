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
      // headerMode={'none'}
      screenOptions={{
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        component={Library}
        name="Library"
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={SavedPlaylists}
        name="SavedPlaylists"
        options={{
          headerTitle: 'Saved Playlists',
          headerStyle: {backgroundColor: '#181818', elevation: 0},
          headerTintColor: 'white',
          headerTitleStyle: {color: 'white', fontFamily: 'OpenSans-SemiBold'},
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={DownloadStack}
        name="Downloads"
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={Donations}
        name="Donations"
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default LibraryStack;
