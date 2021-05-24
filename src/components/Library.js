import React, {useState} from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SavedPlaylists from './SavedPlaylists';



const Library = ({navigation}) => {

    return(
        <>
        <View style={{flex : 1, backgroundColor : '#181818', paddingHorizontal : 10}}>
            <View style={styles.header}>
                <TouchableOpacity
                onPress={() => navigation.navigate("Downloads")}
                >
                <Text style={styles.heading}>Your Library</Text>
                </TouchableOpacity>
            </View>
                <View style={styles.actions}>
                    <ScrollView
                   
                    alwaysBounceVertical={true}
                    >
                            <View style={{}} ><Text style={styles.buttons}>Saved Playlists  </Text></View>
                            
                    </ScrollView>
                
                </View>
           


        
            </View>
        </>
    )
}



export default Library;

const styles = StyleSheet.create({
    header : {
        flex : 0.3,
        marginTop : '5%'
    },
    heading : {
        fontSize : 50,
        color : '#1DB954', 
        fontFamily : 'Gotham'
    },
    actions : {
        flex : 1,
        flexDirection : 'row',
        marginTop : 0,
        justifyContent : 'flex-start',
        
    },
    buttons : {
        fontSize : 25, 
        color : 'lightgray',
    },
    submit : {
        justifyContent : "center",
        borderRadius : 30,
        backgroundColor : "#1DB954",
        marginVertical : 20,
        padding : 20,
        height: 50,
        width : '70%',
        alignSelf : 'center'
        
        },
    buttonText : {
            color: 'white',
            textAlign: 'center',
            fontWeight: "500",
            fontSize : 17,
            fontFamily : 'Gotham',
            textTransform : 'uppercase'
    }
})