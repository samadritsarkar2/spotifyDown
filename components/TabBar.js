import React from "react"
import { Text, View, TouchableOpacity, Image, StyleSheet, Vibration, ToastAndroid } from 'react-native';


const TabBar = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
      return null;
    }

  const renderSwitch = (name,label,isFocused) => {
    switch (name) {
      case 'Home':
         return (  <>
            { isFocused ? 
                <Image style={styles.icons, styles.iconsFocused} source={require('../assets/homeFill.png')} />
                    : 
                 <Image style={styles.icons} source={require('../assets/home.png')} />

            }
          </>
        )
      case 'New' : 
          return ( <>
          { isFocused ? 
                <Image style={styles.icons} source={require('../assets/plusFill.png')} />
             : 
             <Image style={styles.icons} source={require('../assets/plus.png')} />

          }
                
            </>)
        case 'Library' : 
          return (
              <>
                {isFocused ? 
                    <Image style={styles.icons} source={require('../assets/squareFIll.png')} />
                    : 
                    <Image style={styles.icons} source={require('../assets/square.png')} />
                }
              </>
          )
      default:
        return ( <Text style={{ color: isFocused ? '#673ab7' : 'white' }}>
        {label}
         </Text>)

    }
  }
    return (
      <View style={styles.mainView}>
        {state.routes.map((route, index) => {

          if((route.name !== 'Home') && (route.name !== 'New') && (route.name !== 'Library')  ) {
            return ;
          } 

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
  
          const onLongPress = (name) => {
            Vibration.vibrate(200);
            ToastAndroid.show(
                `${name}`,
                ToastAndroid.SHORT
            )
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={() => onLongPress(route.name)}
              style={{ flex: 1, alignItems : 'center' }}
              key={index}
            > 
              {
                renderSwitch(route.name, label, isFocused)
              }
            
            </TouchableOpacity>
          );
        })}
      </View>
    );
}

export default TabBar;

const styles = StyleSheet.create({
    mainView : { 
        backgroundColor : '#212326',
        flexDirection: 'row',
         height : 40,
         alignItems : 'center',
        paddingVertical : 23
        },

    icons : {
        height : 30,
         width: 30,  
        },
    iconsFocused : {
      height : 30,
      width : 30,
    }
    
})