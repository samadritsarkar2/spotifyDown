import {addNew, downloadOne} from './playlistActions';
import {addToPlayer, playOne, addToQueue, shufflePlay} from './playerActions';
import {deleteTrack, handleUnorganized} from './downloadsActions';

const allActions = {
  addNew,
  downloadOne,
  addToPlayer,
  playOne,
  shufflePlay,
  addToQueue,
  handleUnorganized,
  deleteTrack,
};

export default allActions;
