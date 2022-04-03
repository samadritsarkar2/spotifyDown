import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import New from '../components/New';
import Playlist from '../components/Playlist';
import CustomDownload from '../components/CustomDownload';

const Stack = createStackNavigator();

const NewStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="New"
      screenOptions={{
        headerShown: false,
        detachPreviousScreen: true,

        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen component={New} name="New" />
      <Stack.Screen component={Playlist} name={'Playlist'} />
      <Stack.Screen
        component={CustomDownload}
        name="CustomDownload"
        options={{
          // presentation: 'modal',
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
      />
    </Stack.Navigator>
  );
};

export default NewStack;
