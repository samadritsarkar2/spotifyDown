import {addNew, downloadOne} from './playlistActions';
import {addToPlayer, playOne, addToQueue, shufflePlay, addPlaylistToQueue} from './playerActions';
import {deleteTrack, handleUnorganized} from './downloadsActions';

const allActions = {
  addNew,
  downloadOne,
  addToPlayer,
  playOne,
  addPlaylistToQueue,
  shufflePlay,
  addToQueue,
  handleUnorganized,
  deleteTrack,
};

export default allActions;
