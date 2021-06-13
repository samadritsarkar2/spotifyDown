import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import New from '../components/New';
import Playlist from '../components/Playlist';

const Stack = createStackNavigator();

const NewStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="New"
      headerMode={'none'}
      screenOptions={{
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen component={New} name="New" />
      <Stack.Screen component={Playlist} name="Playlist" />
    </Stack.Navigator>
  );
};

export default NewStack;
