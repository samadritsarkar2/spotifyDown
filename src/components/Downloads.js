import React, { useEffect, useState } from "react";
import {Text, View} from "react-native";
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from "rn-fetch-blob";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { isExist } from "../utils";

const Downloads = () => {

    const [arr, setArr] = useState([])

    const getFileName = async () => {
     // let x = await RNFetchBlob.fs.lstat(RNBackgroundDownloader.directories.documents);
    //  console.log(RNBackgroundDownloader.directories.documents)

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
        }
    })


      setArr(prevList);
    }

    useEffect(() => {
        getFileName();
    }, [])

    return (
        <>
            <View>
                <Text>Downloads Page</Text>
                
                {arr.map((item)=> 
                    (<Text>{item.title}</Text>)
                )
                }
            </View>
        </>
    )
}

export default Downloads;