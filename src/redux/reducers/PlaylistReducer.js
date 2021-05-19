

export const playlist = (state = 0,  action) => {
    switch(action.type) {
        case 'NEW_PLAYLIST' : 
            return action.payload
        // case 'DOWNLOAD_ONE' : {
        //    const newState = state.map((item) => item.id === action.payload.id ? {...item, downloaded : true, path : action.path}  : item  )
        //    return newState;
        // }
        default :
            return state;
    }
}

export const downloadSong = (state = {}, action) => {
    switch(action.type) {
        case 'DOWNLOAD' : 
            return {
                ...state,
                downloaded : true,
                path : action.path
            }
        default : 
        return state;
    }
}


