import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Downloads from '../components/Downloads';
import TracksView from '../components/TracksView';

const Stack = createStackNavigator();

const DownloadStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Downloads"
      screenOptions={{
        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {backgroundColor: '#181818', elevation: 0},
        headerTitleAlign: 'center',
        headerTitleStyle: {color: 'white', fontFamily: 'OpenSans-SemiBold'},
        headerTintColor: 'white',
      }}>
      <Stack.Screen component={Downloads} name="Downloads" />
      <Stack.Screen component={TracksView} name="TracksView" />
    </Stack.Navigator>
  );
};

export default DownloadStack;
