import TrackPlayer from "react-native-track-player"


export const addToPlayer = (queue) => {
    return {
        type : 'ADD_TO_PLAYER',
        payload : queue
    }
}


export const playOne = (track) => {
    return async dispatch => {

        let queue = await TrackPlayer.getQueue();
        if(queue.length === 0) 
        {
            await TrackPlayer.add(track);
            await TrackPlayer.play();
        }else {
            const alreadyExist= queue.some(item => item.id === track.id );
            if(alreadyExist ) {
                await TrackPlayer.skip(track.id);
                await TrackPlayer.play();
            } else {
                await TrackPlayer.add(track);
                await TrackPlayer.skip(track.id)
            }
        }
      
        dispatch(addToPlayer(track));
    }
}

export const addToQueue = track => {
    return async dispatch => {
        await TrackPlayer.add(track);
    }
}
