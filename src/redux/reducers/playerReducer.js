const initialState = {
    trackInfo : {
        title : '',
        artists : '',
        album : '',
        duration : 0,
        artwork : '',
        positionString : '',
        durationString : '',
    },
     isPlayerActive : false
}


export const playerReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_TRACK_INFO': 
            return {
                ...state,
                trackInfo : {
                    ...state.trackInfo,
                    ...action.payload.trackInfo
                }
            }

        case 'CLEAR_TRACK_INFO':
            return {
                ...state,
                trackInfo : {
                    title : '',
                    artist : '',
                    album : '',
                    duration : 0,
                    artwork : '',
                    positionString : '',
                    durationString : '',
                }
            }
        
        case 'SET_POSITION_STRING' :
            return {
                ...state,
                trackInfo : {
                    ...state.trackInfo,
                    positionString : action.payload.positionString
                }
            }
            case 'SET_DURATION_STRING' :
                return {
                    ...state,
                    trackInfo : {
                        ...state.trackInfo,
                        durationString : action.payload.durationString
                    }
                }
        
        case 'SET_PLAYER_ACTIVE' : 
            return {
                ...state,
                isPlayerActive : true
            }
        case 'SET_PLAYER_CLOSED' : 
            return {
                ...state,
                isPlayerActive : false
            }
        default:
            return state;
    }
}