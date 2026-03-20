import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Vibration, ToastAndroid } from 'react-native';
import { colors, fonts, fontSize, spacing } from '../theme';
import { windowHeight } from '../common';

const TAB_CONFIG = {
  Home: {
    label: 'Home',
    icon: require('../assets/home.png'),
    iconFocused: require('../assets/homeFill.png'),
  },
  NewStack: {
    label: 'Download',
    icon: require('../assets/search.png'),
    iconFocused: require('../assets/searchFill.png'),
  },
  LibraryStack: {
    label: 'Library',
    icon: require('../assets/library.png'),
    iconFocused: require('../assets/libraryFill.png'),
  },
};

const VISIBLE_TABS = ['Home', 'NewStack', 'LibraryStack'];

const TabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) return null;

  return (
    <View style={styles.mainView}>
      {state.routes.map((route, index) => {
        if (!VISIBLE_TABS.includes(route.name)) return null;

        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            onLongPress={() => {
              Vibration.vibrate(200);
              ToastAndroid.show(config.label, ToastAndroid.SHORT);
              navigation.emit({ type: 'tabLongPress', target: route.key });
            }}
            style={styles.touchOpacity}>
            <View style={styles.iconAndLabel}>
              <Image style={styles.icon} source={isFocused ? config.iconFocused : config.icon} />
              <Text style={isFocused ? styles.labelFocused : styles.label}>{config.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.bg.secondary,
    flexDirection: 'row',
    height: windowHeight * 0.06,
    paddingVertical: windowHeight * 0.005,
    alignItems: 'center',
  },
  touchOpacity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconAndLabel: {
    flex: 0.95,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  icon: {
    flex: 1,
    aspectRatio: 1,
  },
  label: {
    color: colors.text.hint,
    fontSize: fontSize.sm,
  },
  labelFocused: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
  },
});
