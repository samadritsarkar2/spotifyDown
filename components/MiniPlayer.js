import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

const MiniPlayer = () => {
   
    return (
        <>
            <View style={styles.box}>
               <View>
                   <Text>Song Name</Text>
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
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 43,
        paddingVertical : 10,
    }
})