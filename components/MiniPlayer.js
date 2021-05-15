import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native";


const MiniPlayer = () => {
   
    return (
        <>
            <View style={styles.box}>
               <View style={styles.playerView}>
                   <View style={styles.trackInfo} >
                   <Text style={{color : 'white'}} >Song Name</Text>
                   </View>

                   <View style={styles.playerControls} >
                        <TouchableOpacity>
                        <Image 
                            source={require("../assets/previous.png")} 
                                style={styles.playerIcons}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image 
                            source={require("../assets/play-button.png")} 
                                style={[styles.playerIcons]}
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
         marginBottom : 1
    },
    playerView : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    trackInfo : {
        marginStart : 10,
        alignSelf : 'center'
    },
    playerControls : {
        flexDirection : 'row',
          marginEnd : 20,
          alignSelf : 'center'
      
    },
    playerIcons : {width : 25, 
        height : 25,
        marginHorizontal : 7
        },
    
})