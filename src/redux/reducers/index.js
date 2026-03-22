import {combineReducers} from 'redux';
import {playlistReducer} from './PlaylistReducer';
import {playerReducer} from './playerReducer';
import {downloadsReducer} from './downloadsReducer';

const rootReducers = combineReducers({
  playlist: playlistReducer,
  downloadsReducer,
  player: playerReducer,
});

export default rootReducers;
