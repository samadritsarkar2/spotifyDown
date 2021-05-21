
import {DOWNLOAD_PATH} from '../common';
import RNFetchBlob from 'rn-fetch-blob';

export const isExist = async (single) => {

    const filepath = `${DOWNLOAD_PATH}/${single.title}.mp3`
    const exists = await RNFetchBlob.fs.exists(filepath);
    if (exists) {
        const stats = await RNFetchBlob.fs.stat(filepath);
        
        if(stats.size === 0) 
        { 
            RNFetchBlob.fs.unlink(filepath)
            return false;
        }
          else 
          return true
        
      } else {
        return false;
      }
}