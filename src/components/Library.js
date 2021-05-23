import React, {useState} from 'react'
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import allActions from "../redux/actions/index";
import Spinner from "react-native-spinkit";
import SavedPlaylists from './SavedPlaylists';



const Library = ({navigation}) => {

    return(
        <>
        <View style={{flex : 1, backgroundColor : '#181818'}}>
            <View style={styles.header}>
                <TouchableOpacity
                onPress={() => navigation.navigate("Downloads")}
                >
                <Text style={styles.heading}>Your Library</Text>
                </TouchableOpacity>
                <View style={styles.actions}>
                    <View style={{}} ><Text style={styles.buttons}>Saved Playlists  </Text></View>
                </View>
            </View>

            <SavedPlaylists />
        
        </View>
        </>
    )
}



export default Library;

const styles = StyleSheet.create({
    header : {
        flex : 0.3,
        marginTop : 40,
        marginHorizontal : 20
    },
    library : {
        flex : 0.7,
       
        marginHorizontal : 10
    },
    heading : {
        fontSize : 50,
        color : '#1DB954', 
        fontFamily : 'Gotham'
    },
    actions : {
        flex : 0.7,
        flexDirection : 'row',
        marginTop : 0,
        justifyContent : 'flex-start',
        alignItems : 'flex-end'
    },
    buttons : {
        fontSize : 25, 
        color : 'lightgray',
    },
    listBox : {
        margin : 10,
        
    },
    listText : {
        fontSize : 25,
        color : 'white',
        fontWeight : '200'
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