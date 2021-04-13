import 'react-native-gesture-handler';

import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as StoreProvider } from "react-redux";
import store from "./redux/store";
import Home from "./components/Home"
import App from './App';
import New from './components/New';
import Library from './components/Library';
import Playlist from './components/Playlist';

import TabBar from "./components/TabBar";
import Error from './components/Error';
// import {SvgUri} from "react-native-svg"

// import HomeLogo  from "./assets/home.svg";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const Routes = () => {

//     return (
//         <StoreProvider store={store}>
//         <NavigationContainer>
//             <Stack.Navigator
//             initialRoutName="Home"
//             screenOptions={{
//                 headerShown : false,
                
//             }}
//             >
//                 <Stack.Screen name="Home" component={Home} ></Stack.Screen>
//                 <Stack.Screen name="App" component={App} ></Stack.Screen>
//                 <Stack.Screen name="New" component={New}></Stack.Screen>
//                 <Stack.Screen name="Playlist" component={Playlist}></Stack.Screen>
//                 <Stack.Screen name="Library" component={Library}></Stack.Screen>
//                 {/* <Stack.Screen name="User" component={User}
//                 options ={{
//                     transitionSpec : {
//                         open : TransitionSpecs.ScaleFromCenterAndroidSpec,
//                         close : TransitionSpecs.TransitionIOSSpec
//                     }
//                 }}
//                 ></Stack.Screen> */}
//             </Stack.Navigator>
//         </NavigationContainer>
//         </StoreProvider>
//     )
// }


const BottomNav = () => {
    return (
        <StoreProvider store={store}>
            <NavigationContainer>
                <Tab.Navigator
                    tabBar={ props => <TabBar {...props} /> }
                    initialRouteName="Home"
                    >
                        <Tab.Screen options={{}} component={Home} name='Home' ></Tab.Screen>
                        <Tab.Screen component={New} name='New' ></Tab.Screen>
                        <Tab.Screen component={Library} name='Library' ></Tab.Screen>
                        <Tab.Screen component={Playlist} name="Playlist" ></Tab.Screen>
                        <Tab.Screen component={Error} name="Error" options={{unmountOnBlur : true}} ></Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </StoreProvider>
    )
}


export default BottomNav;

