import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import New from '../components/New';

const Stack = createStackNavigator();

const NewStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="New"
      headerMode={'none'}
      screenOptions={{
        detachPreviousScreen: true,

        cardOverlayEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen component={New} name="New" />
    </Stack.Navigator>
  );
};

export default NewStack;
