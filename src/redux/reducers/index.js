import {combineReducers} from "redux";
import {playlist ,  downloadSong} from "./PlaylistReducer";
import {playerReducer} from "./playerReducer"

const rootReducers = combineReducers({
    playlist,
    downloadSong,
    player : playerReducer
});

export default rootReducers;