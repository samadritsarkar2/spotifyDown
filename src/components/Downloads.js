import React, { useEffect, useState } from "react";
import {Text, Image, TouchableOpacity, View, Vibration, StyleSheet, ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../redux/actions/index";
import { isExist } from "../utils";


const Downloads = () => {
    const dispatch = useDispatch();
    const queue = useSelector(state => state.player)

    const [arr, setArr] = useState([])

    const getFileName = async () => {


    const storedValue = await AsyncStorage.getItem(`@downloads`);
    const prevList = await JSON.parse(storedValue);
    
    prevList.map(async (item) => {
        const exist = await isExist(item);
       // console.log(exist, item.title)
        if(exist === false){
            const updatedList = prevList.filter(file => file.id != item.id);
            await AsyncStorage.setItem(
                `@downloads`,
                JSON.stringify(updatedList),
              );
              setArr(updatedList);
            //dispatch(allActions.addToPlayer(prevList));
    }
    })

    // console.log(queue)
        setArr(prevList)
      
    }

    useEffect(() => {
        getFileName();
    }, [])

    const handleLongPress = (item) => {
        Vibration.vibrate(100);
        dispatch(allActions.addToQueue(item));
    }

    return (
        <>
            <View
          style={{flex: 1, backgroundColor: '#181818', paddingHorizontal: 10}}>
                <View style={styles.header}>
                    <View>
                    <Text style={styles.heading}>Downloads</Text>
                    </View>
                </View>
                <View
                style={{
                    flex : 1,
                    justifyContent : 'center',
              
                    marginHorizontal : '1%'
                }}
                >
                <ScrollView
                showsVerticalScrollIndicator={false}
                >
                
                {arr.map((item, index)=> 
                    (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {dispatch(allActions.playOne(item))}}
                        onLongPress={() => handleLongPress(item)}
                    >
                    <View
                    style={styles.itemWrapper}
                    >
                        <View
                        style={{flex : 0.2, }}
                        >
                        <Image style={styles.trackArtwork}source={{uri : `${item.artwork}`, }} />
                        </View>
                        <View
                        style={{flex : 0.8, flexDirection : 'column'}}
                        >
                            <Text style={styles.trackTitle}>{item.title}</Text>
                            <Text style={{color : 'gray'}}>{item.artist} - {item.album}</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                    )
                )
                }
             
                </ScrollView>
                </View>
            </View>
        </>
    )
}

export default Downloads;

const styles = StyleSheet.create({
    header : {
        flex : 0.3,
        marginTop : '5%',
        marginHorizontal : '1%'
    },
    heading : {
        fontSize : 50,
        color : '#1DB954', 
        fontFamily : 'Roboto'
    },
    itemWrapper : {
        flex : 1,
        flexDirection : "row",
        marginVertical : 7,
        paddingHorizontal : '1%',
        paddingVertical : '3%',
        

    },
    trackTitle : {
        color : 'white',
        fontSize : 20,
        alignSelf : 'flex-start',
        backgroundColor : 'red'
    },
    trackArtwork : {
        marginRight : 20,
        height : '70%',
        width : '70%',
        alignSelf : 'center'
    }
})