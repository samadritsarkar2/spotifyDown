import React, { useEffect, useState } from "react";
import {Text, TouchableOpacity, View, Vibration} from "react-native";
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
            <View style ={{flex : 1,}}>
                <Text>Downloads Page</Text>
                <View
                style={{
                    flex : 1,
                    justifyContent : 'center',
                    alignItems : 'center',
                    
                }}
                >
                
                {arr.map((item, index)=> 
                    (<TouchableOpacity
                    key={index}
                        onPress={() => {dispatch(allActions.playOne(item))}}
                        onLongPress={() => handleLongPress(item)}
                    >
                    <Text>{item.title}</Text>
                    </TouchableOpacity>
                    )
                )
                }
                <Text> { JSON.stringify(queue) } </Text>
                </View>
            </View>
        </>
    )
}

export default Downloads;