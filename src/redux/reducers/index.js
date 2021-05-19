import {combineReducers} from "redux";
import {playlist ,  downloadSong} from "./PlaylistReducer";

const rootReducers = combineReducers({
    playlist,
    downloadSong
})

export default rootReducers;