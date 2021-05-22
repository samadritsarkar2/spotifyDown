import TrackPlayer from "react-native-track-player"


export const addToPlayer = (queue) => {
    return {
        type : 'ADD_TO_PLAYER',
        payload : queue
    }
}




export const playOne = (track) => {
    return async dispatch => {
        await TrackPlayer.add(track);
        dispatch(addToPlayer(track));
    }
}
