// src/redux/selectors.js

// Playlist Selectors
export const selectPlaylistState = (state) => state.playlist;
export const selectCurrentPlaylist = (state) => state.playlist.currentPlaylist;
export const selectDownloadQueue = (state) => state.playlist.downloadQueue;
export const selectCurrentDownloading = (state) => state.playlist.currentDownloading;
export const selectDownloadPercent = (state) => state.playlist.downloadPercent;
export const selectDownloadSize = (state) => state.playlist.downloadSize;
export const selectPlaylistLoading = (state) => state.playlist.loading;
export const selectCustomItemData = (state) => state.playlist.customItemData;

// Downloads Selectors
export const selectDownloadsState = (state) => state.downloadsReducer;
export const selectDownloadedData = (state) => state.downloadsReducer.data;
export const selectDownloadedPlaylists = (state) => state.downloadsReducer.playlists;
export const selectActivePlaylist = (state) => state.downloadsReducer.activePlaylist;
export const selectShufflePlaylist = (state) => state.downloadsReducer.shufflePlaylist;
export const selectIsPlaylistView = (state) => state.downloadsReducer.isPlaylistView;

// Player Selectors
export const selectPlayerState = (state) => state.player;
export const selectTrackInfo = (state) => state.player.trackInfo;
export const selectIsPlayerActive = (state) => state.player.isPlayerActive;
