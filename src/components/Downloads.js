import React, { useEffect, useState } from "react";
import {Text, View} from "react-native";
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from "rn-fetch-blob";

const Downloads = () => {

    const [arr, setArr] = useState([])

    const getFileName = async () => {
      let x = await RNFetchBlob.fs.lstat(RNBackgroundDownloader.directories.documents);
      console.log(RNBackgroundDownloader.directories.documents)
      setArr(x);
    }

    useEffect(() => {
        getFileName();
    }, [])

    return (
        <>
            <View>
                <Text>Downloads Page</Text>
                
                <Text>{JSON.stringify(arr)}</Text>
            </View>
        </>
    )
}

export default Downloads;