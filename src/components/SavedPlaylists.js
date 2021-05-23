import React, {useState} from 'react'
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import allActions from "../redux/actions/index";
import Spinner from "react-native-spinkit";


const SavedPlaylists = () => {
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(()=> {
       setLoading(true);
       retriveSaved();
           
       // retriveDownloaded();
   }, [])
   )


    const retriveSaved = async () => {
        try {
            const storedValue = await AsyncStorage.getItem(`@saved_playlists`);

            const retrieved = await JSON.parse(storedValue);
            //console.log(storedValue, retrieved)
            setSaved(retrieved);
            setLoading(false);
        } catch (error) {
            console.log("Coulnot retrieve saved Playlists", error);
            setLoading(false);
            setError(true);
        }
    }

    const handleClick = async (id) => {
        dispatch(allActions.addNew(id));
        navigation.navigate('Playlist');
    }

    return (
      <>
        <View style={styles.library}>
          {loading ? (
            <View>
              <Spinner
                style={{marginBottom: 7, alignSelf: 'center'}}
                size={35}
                type={'Circle'}
                color={'#FFF'}
              />
            </View>
          ) : (
            <>
              <ScrollView>
                {saved == null ? (
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: 'red', fontSize: 20}}>
                      Nothing saved yet
                    </Text>
                    <Text style={{color: 'white', fontSize: 20}}>
                      Try adding one{' '}
                    </Text>
                    <TouchableOpacity
                      style={styles.submit}
                      onPress={() => {
                        navigation.navigate('New');
                      }}>
                      <Text style={styles.buttonText}>Enter new Playlist</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    {saved?.map((item, index) => (
                      <View key={index} style={styles.listBox}>
                        <TouchableOpacity onPress={() => handleClick(item.id)}>
                          <Text style={styles.listText}>
                            {' '}
                            {item.playlistId}{' '}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </>
    );
}


export default SavedPlaylists;



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