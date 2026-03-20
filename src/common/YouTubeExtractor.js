import { NativeModules, NativeEventEmitter } from 'react-native';
const { YouTubeExtractor } = NativeModules;

// Event emitter for download progress
const eventEmitter = new NativeEventEmitter(YouTubeExtractor);

// Search YouTube Music for best-match videoId given Spotify track info
export const findYTMusicMatch = (title, artists, durationMs) =>
    YouTubeExtractor.searchYTMusic(title, artists, durationMs);

// Search YouTube for manual video selection
export const searchYouTube = (query, limit = 15) =>
    YouTubeExtractor.searchYouTube(query, limit);

// Download audio using yt-dlp (handles deobfuscation + unthrottled download)
// onProgress callback receives {percent, eta}
export const downloadAudio = (videoId, filePath, onProgress) => {
    let subscription;
    if (onProgress) {
        subscription = eventEmitter.addListener('downloadProgress', onProgress);
    }
    return YouTubeExtractor.downloadAudio(videoId, filePath)
        .finally(() => {
            if (subscription) subscription.remove();
        });
};
