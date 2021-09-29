import analytics from '@react-native-firebase/analytics';
/// import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import React, {useRef} from 'react';
import 'react-native-gesture-handler';
import {Provider as StoreProvider} from 'react-redux';
import codePush from 'react-native-code-push';

import Error from './src/components/Error';
import Home from './src/components/Home';
import MiniPlayer from './src/components/MiniPlayer';
import Playlist from './src/components/Playlist';
import LibraryStack from './src/navigation/LibraryStack';

import TabBar from './src/navigation/TabBar';
import store from './src/redux/store';
import NewStack from './src/navigation/NewStack';
import DownloadingHelper from './src/components/DownloadingHelper';

//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomNav = () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#181818',
    },
  };

  return (
    <StoreProvider store={store}>
      <NavigationContainer
        theme={MyTheme}
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async (state) => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
        }}>
        <Tab.Navigator
          tabBar={(props) => <TabBar {...props} />}
          initialRouteName="Home">
          <Tab.Screen options={{}} component={Home} name="Home"></Tab.Screen>
          <Tab.Screen component={NewStack} name="NewStack"></Tab.Screen>
          <Tab.Screen component={LibraryStack} name="LibraryStack"></Tab.Screen>
          <Tab.Screen
            component={Playlist}
            name="Playlist"
            options={
              {
                // unmountOnBlur: true,
              }
            }></Tab.Screen>
          <Tab.Screen
            component={Error}
            name="Error"
            options={{unmountOnBlur: true}}></Tab.Screen>
        </Tab.Navigator>
        <MiniPlayer />
        <DownloadingHelper />
      </NavigationContainer>
    </StoreProvider>
  );
};

export default codePush(BottomNav);

// appcenter codepush release-react -a samadritsarkar2/Spotify-Downloader
