import React,  {useState, useEffect} from 'react';
import {
  Button,
  View,
  Text,
  Image,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import RNBackgroundDownloader from 'react-native-background-downloader';



const perm = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Required to download files",
        message:
          "Needs to save the mp3 files",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Storage");
      return true;
    } else {
      console.log("Storage permission denied");
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const App = ({navigation, route}) => {

 
  const [data, setData] = useState([]);
  const [playlistData, setPlaylistData] = useState();
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [visible,setVisible] = useState(false);
  const [index, setIndex] = useState(1);
 //  const { playlistInfo, tracks } = route.params
  useEffect(()=> {
    const { res } = route.params;
    setPlaylistData(res[0]);
  if(index == 1)
  {
    for(let i=1; i< res.length; i++)
    {
      // console.log(fetchData[i])
        setData((prev)=> [...prev, res[i]])
    }
    setIndex(index+1)
  }
  
   
   // setData(prev => [...prev, res.slice[1]])
  }, [playlistData])

 

const downloader = async (name, link) => {
  const req = perm();
  if(req){

  setVisible(true);

 // const downStream = RNFS.fs.writeStream(path);
  let task = RNBackgroundDownloader.download({
    id : name,
    url : link,
    destination : `${RNBackgroundDownloader.directories.documents}/${name}.mp3`
  }).begin((expectedBytes) => {
    console.log(`Going to download ${expectedBytes} bytes!`);
}).progress((percent) => {
    console.log(`Downloaded: ${percent * 100}%`);
    setDownloadPercent(percent*100);
}).done(() => {
    console.log('Download is done!');
    console.log(`${RNBackgroundDownloader.directories.documents}/${name}.mp3`);
    setVisible(false)
}).error((error) => {
    console.log('Download canceled due to error: ', error);
});
  }
}

const onRequestClose = () => null;

  return (
    <>
      {playlistData ? <View><Text>App Loading...</Text></View> : 
      <>
           <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}>
        <View style={styles.header}>
          <Text style={{color: 'white'}}>{playlistData.playlistId}</Text>
          <Image source={{uri : playlistData.playlistImg}} style={{height : 300, width : 300}} />
        </View>
        <ScrollView style={styles.scroller}>
          {data.map((item, index)=> {
            return (
             <View key={index} style={styles.list}>
             <View style={{flex : 0.7}}>
               <Text style={{color: 'white',fontSize : 20}}>
                  {item.name} 
                 </Text>
                <Text style={{color: 'white'}} >
                     {item.album}
                 </Text>
             </View>
           <TouchableOpacity style={{flex : 0.3, alignItems : 'flex-end', justifyContent : 'center'}} onPress={() => downloader(item.name, item.link)}>
             <Image source={require('./assets/down.png')} style={{height: 25, width : 25}} />
           </TouchableOpacity>

     </View>
            )
          })}
             
          </ScrollView>
        <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
        animationType="slide"
        onBackdropPress={onRequestClose}
        >
          <View style={styles.modalContainer} >
            <ActivityIndicator size={'large'} color={'#1DB954'} />
            <Text style={styles.modalHeading}>Downloading, please wait...</Text>
          </View>
        </Modal>
      </View>

      </>
      }
         </>
  );
};


export default App;

const styles = StyleSheet.create({
  header : {
    flex : 0.4,
    marginVertical : 10
  },
   scroller : {
     flex : 0.7,
     margin : 10,
     width : '90%',
     paddingHorizontal : 5,
     marginBottom : 20,
     
   }, list : {
    flex : 1, flexDirection : 'row',
     marginVertical : 10, 
    
   },
   modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  modalHeading: {
    fontSize: 15,
    color : '#1DB954',
    marginBottom: 15,
  },
})