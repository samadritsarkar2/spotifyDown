import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native";


const MiniPlayer = () => {
   
    return (
        <>
            <View style={styles.box}>
               <View style={styles.playerView}>
                   <Text style={{color : 'white'}} >Song Name</Text>
                   <TouchableOpacity>
                   <Image 
                       source={require("../assets/previous.png")} 
                        style={styles.playerIcons}
                       />
                   </TouchableOpacity>
                   <TouchableOpacity>
                       <Image 
                       source={require("../assets/play-button.png")} 
                        style={[styles.playerIcons, {width : 30, height : 30}]}
                       />
                   </TouchableOpacity>
                   <TouchableOpacity>
                   <Image 
                       source={require("../assets/next.png")} 
                        style={styles.playerIcons}
                       />
                   </TouchableOpacity>
               </View>
            </View>
        </>
    )
}

export default MiniPlayer;

const styles = StyleSheet.create({
    box : {
        position: 'absolute',
        width: '100%',
        height: 47,
      
        justifyContent: 'center',
        bottom: 43,
        paddingVertical : 10,
        backgroundColor : '#212326',
         marginBottom : 2
    },
    playerView : {
        flex : 1,
        flexDirection : 'row',
        
    },
    playerIcons : {width : 25, 
        height : 25,
         marginHorizontal : 10
        }
})