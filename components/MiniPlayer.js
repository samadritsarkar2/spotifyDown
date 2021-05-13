import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native";


const MiniPlayer = () => {
   
    return (
        <>
            <View style={styles.box}>
               <View style={styles.playerView}>
                   <Text style={{color : 'white'}} >Song Name</Text>
                   <TouchableOpacity>
                       <Text>Play/Pause</Text>
                   </TouchableOpacity>
                   <TouchableOpacity>
                       <Text>Next</Text>
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
        
    }
})