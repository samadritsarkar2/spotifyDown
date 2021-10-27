import {combineReducers} from 'redux';
import {playlist} from './PlaylistReducer';
import {playerReducer} from './playerReducer';
import {downloadsReducer} from './downloadsReducer';
const rootReducers = combineReducers({
  playlist,
  downloadsReducer,
  player: playerReducer,
});

export default rootReducers;
