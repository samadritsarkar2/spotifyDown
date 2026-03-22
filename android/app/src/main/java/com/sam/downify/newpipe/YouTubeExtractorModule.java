package com.sam.downify.newpipe;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.schabi.newpipe.extractor.InfoItem;
import org.schabi.newpipe.extractor.ListExtractor;
import org.schabi.newpipe.extractor.NewPipe;
import org.schabi.newpipe.extractor.ServiceList;
import org.schabi.newpipe.extractor.search.SearchExtractor;
import org.schabi.newpipe.extractor.search.SearchInfo;
import org.schabi.newpipe.extractor.stream.StreamInfoItem;

import com.yausername.youtubedl_android.YoutubeDL;
import com.yausername.youtubedl_android.YoutubeDLRequest;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class YouTubeExtractorModule extends ReactContextBaseJavaModule {
    private static final String TAG = "YouTubeExtractor";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private volatile boolean ytDlpUpdated = false;

    YouTubeExtractorModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "YouTubeExtractor";
    }

    /**
     * Search YouTube Music for a track matching the given title, artists, and duration.
     * Replicates the backend's /getDownloadLink endpoint.
     */
    @ReactMethod
    public void searchYTMusic(String title, ReadableArray artists, int durationMs, Promise promise) {
        executor.execute(() -> {
            try {
                // Build search query: "title artist1 artist2"
                StringBuilder query = new StringBuilder(title);
                List<String> artistNames = new ArrayList<>();
                for (int i = 0; i < artists.size(); i++) {
                    String artist = artists.getString(i);
                    artistNames.add(artist);
                    query.append(" ").append(artist);
                }

                Log.d(TAG, "searchYTMusic query: " + query);

                // Search YouTube Music (songs filter)
                List<String> contentFilter = Collections.singletonList("music_songs");
                SearchExtractor extractor = ServiceList.YouTube.getSearchExtractor(
                        query.toString(), contentFilter, "");
                extractor.fetchPage();

                ListExtractor.InfoItemsPage<InfoItem> page = extractor.getInitialPage();
                List<InfoItem> items = page.getItems();

                if (items.isEmpty()) {
                    // Fallback to regular YouTube search
                    extractor = ServiceList.YouTube.getSearchExtractor(query.toString());
                    extractor.fetchPage();
                    page = extractor.getInitialPage();
                    items = page.getItems();
                }

                // Find best match by scoring
                WritableMap bestMatch = null;
                double bestScore = -1;

                for (InfoItem item : items) {
                    if (!(item instanceof StreamInfoItem)) continue;
                    StreamInfoItem streamItem = (StreamInfoItem) item;

                    // Calculate accuracy score
                    double score = calculateAccuracy(
                            title, artistNames, durationMs,
                            streamItem.getName(),
                            streamItem.getUploaderName(),
                            streamItem.getDuration() * 1000 // seconds to ms
                    );

                    if (score > bestScore) {
                        bestScore = score;
                        WritableMap map = Arguments.createMap();
                        map.putString("videoId", extractVideoId(streamItem.getUrl()));
                        map.putString("title", streamItem.getName());
                        map.putDouble("duration", streamItem.getDuration());
                        map.putDouble("accuracy", score);
                        bestMatch = map;
                    }
                }

                if (bestMatch != null) {
                    Log.d(TAG, "Best match: " + bestMatch.getString("title") +
                            " (accuracy: " + bestMatch.getDouble("accuracy") + ")");
                    promise.resolve(bestMatch);
                } else {
                    promise.reject("NO_MATCH", "No matching video found on YouTube Music");
                }
            } catch (Exception e) {
                Log.e(TAG, "searchYTMusic error", e);
                promise.reject("SEARCH_ERROR", e.getMessage(), e);
            }
        });
    }

    /**
     * Search YouTube for videos matching a query.
     * Replicates the backend's /getCustomDownload endpoint.
     */
    @ReactMethod
    public void searchYouTube(String query, int limit, Promise promise) {
        executor.execute(() -> {
            try {
                Log.d(TAG, "searchYouTube query: " + query + ", limit: " + limit);

                SearchExtractor extractor = ServiceList.YouTube.getSearchExtractor(query);
                extractor.fetchPage();

                ListExtractor.InfoItemsPage<InfoItem> page = extractor.getInitialPage();
                List<InfoItem> items = page.getItems();

                WritableArray results = Arguments.createArray();
                int count = 0;

                for (InfoItem item : items) {
                    if (count >= limit) break;
                    if (!(item instanceof StreamInfoItem)) continue;
                    StreamInfoItem streamItem = (StreamInfoItem) item;

                    WritableMap map = Arguments.createMap();
                    String videoUrl = streamItem.getUrl();
                    String videoId = extractVideoId(videoUrl);

                    map.putString("videoId", videoId);
                    map.putString("title", streamItem.getName());
                    map.putString("url", videoUrl);

                    // Get thumbnail
                    try {
                        if (streamItem.getThumbnails() != null && !streamItem.getThumbnails().isEmpty()) {
                            map.putString("thumbnail", streamItem.getThumbnails().get(0).getUrl());
                        }
                    } catch (Exception e) {
                        map.putString("thumbnail", "");
                    }

                    long durationSecs = streamItem.getDuration();
                    map.putDouble("duration", durationSecs);

                    long mins = durationSecs / 60;
                    long secs = durationSecs % 60;
                    map.putString("duration_string", String.format("%d:%02d", mins, secs));

                    map.putDouble("videoViews", streamItem.getViewCount());

                    results.pushMap(map);
                    count++;
                }

                promise.resolve(results);
            } catch (Exception e) {
                Log.e(TAG, "searchYouTube error", e);
                promise.reject("SEARCH_ERROR", e.getMessage(), e);
            }
        });
    }



    /**
     * Update yt-dlp to the latest version.
     * Should be called on app startup or before first download.
     */
    @ReactMethod
    public void updateYtDlp(Promise promise) {
        executor.execute(() -> {
            try {
                Log.d(TAG, "Updating yt-dlp...");
                YoutubeDL.UpdateStatus status = YoutubeDL.getInstance().updateYoutubeDL(
                        getReactApplicationContext(), YoutubeDL.UpdateChannel._NIGHTLY);
                ytDlpUpdated = true;
                Log.d(TAG, "yt-dlp update status: " + status);
                promise.resolve(status.toString());
            } catch (Exception e) {
                Log.e(TAG, "yt-dlp update error", e);
                promise.reject("UPDATE_ERROR", e.getMessage(), e);
            }
        });
    }

    /**
     * Download audio for a YouTube video using yt-dlp.
     * Auto-updates yt-dlp on first use to ensure unthrottled downloads.
     * Emits 'downloadProgress' events to JS with {percent}.
     */
    @ReactMethod
    public void downloadAudio(String videoId, String filePath, Promise promise) {
        executor.execute(() -> {
            try {
                // Auto-update yt-dlp on first download
                if (!ytDlpUpdated) {
                    try {
                        Log.d(TAG, "Auto-updating yt-dlp before first download...");
                        YoutubeDL.getInstance().updateYoutubeDL(
                                getReactApplicationContext(), YoutubeDL.UpdateChannel._NIGHTLY);
                        ytDlpUpdated = true;
                        Log.d(TAG, "yt-dlp updated successfully");
                    } catch (Exception e) {
                        Log.w(TAG, "yt-dlp update failed, continuing with bundled version", e);
                    }
                }

                Log.d(TAG, "downloadAudio (yt-dlp) for: " + videoId + " -> " + filePath);

                String url = "https://www.youtube.com/watch?v=" + videoId;
                YoutubeDLRequest request = new YoutubeDLRequest(url);
                request.addOption("-f", "bestaudio");
                // Strip .mp3 from path — yt-dlp adds it based on --audio-format
                String outputPath = filePath.replaceAll("\\.mp3$", "");
                request.addOption("-o", outputPath + ".%(ext)s");
                request.addOption("--no-playlist");
                request.addOption("--extract-audio");
                request.addOption("--audio-format", "mp3");
                request.addOption("--no-update");

                YoutubeDL.getInstance().execute(request, null, (progress, etaInSeconds, line) -> {
                    WritableMap progressData = Arguments.createMap();
                    progressData.putDouble("percent", progress);
                    progressData.putDouble("eta", etaInSeconds);
                    sendEvent("downloadProgress", progressData);
                    return kotlin.Unit.INSTANCE;
                });

                // Check if file was created
                File outputFile = new File(filePath);
                if (!outputFile.exists()) {
                    // yt-dlp might have added an extension, search for it
                    File parent = outputFile.getParentFile();
                    String baseName = outputFile.getName().replace(".mp3", "");
                    File[] matches = parent.listFiles((dir, name) -> name.startsWith(baseName));
                    if (matches != null && matches.length > 0) {
                        outputFile = matches[0];
                    }
                }

                if (outputFile.exists()) {
                    Log.d(TAG, "Download complete: " + outputFile.length() + " bytes -> " + outputFile.getAbsolutePath());
                    WritableMap result = Arguments.createMap();
                    result.putString("path", outputFile.getAbsolutePath());
                    result.putDouble("size", outputFile.length());
                    promise.resolve(result);
                } else {
                    promise.reject("DOWNLOAD_ERROR", "File not found after download");
                }
            } catch (Exception e) {
                Log.e(TAG, "downloadAudio error", e);
                promise.reject("DOWNLOAD_ERROR", e.getMessage(), e);
            }
        });
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    /**
     * Calculate accuracy score for a YouTube result vs. expected track info.
     * Replicates the accuracy algorithm from YouTubeMusic.js in the backend.
     */
    private double calculateAccuracy(String expectedTitle, List<String> expectedArtists,
                                     int expectedDurationMs, String resultTitle,
                                     String resultUploader, long resultDurationMs) {
        double accuracy = 0;

        // 1. Title similarity (0-40)
        String normalizedExpected = normalizeText(expectedTitle);
        String normalizedResult = normalizeText(resultTitle);
        double titleSim = calculateSimilarity(normalizedExpected, normalizedResult);
        accuracy += titleSim * 40;

        // 2. Duration match (0-30)
        if (expectedDurationMs > 0 && resultDurationMs > 0) {
            double durationDelta = Math.abs(expectedDurationMs - resultDurationMs);
            double durationScore = Math.max(0, 1 - (durationDelta / expectedDurationMs));
            accuracy += durationScore * 30;
        } else {
            accuracy += 15; // neutral score if no duration info
        }

        // 3. Artist match (0-30)
        if (resultUploader != null && !expectedArtists.isEmpty()) {
            String normalizedUploader = normalizeText(resultUploader);
            double bestArtistMatch = 0;
            for (String artist : expectedArtists) {
                double sim = calculateSimilarity(normalizeText(artist), normalizedUploader);
                bestArtistMatch = Math.max(bestArtistMatch, sim);
            }
            accuracy += bestArtistMatch * 30;
        }

        return accuracy;
    }

    private String normalizeText(String text) {
        if (text == null) return "";
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private double calculateSimilarity(String a, String b) {
        if (a.isEmpty() || b.isEmpty()) return 0;
        String[] wordsA = a.split(" ");
        String[] wordsB = b.split(" ");
        int matches = 0;
        for (String wa : wordsA) {
            for (String wb : wordsB) {
                if (wa.equals(wb)) {
                    matches++;
                    break;
                }
            }
        }
        return (double) matches / Math.max(wordsA.length, wordsB.length);
    }

    /**
     * Extract the video ID from any YouTube URL format.
     * Handles youtube.com, music.youtube.com, youtu.be, etc.
     */
    private String extractVideoId(String url) {
        if (url == null) return "";
        // Match ?v=XXXXX or /XXXXX patterns from various YouTube URL formats
        Pattern pattern = Pattern.compile("(?:v=|youtu\\.be/)([a-zA-Z0-9_-]{11})");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        // If no match, return as-is (might already be just an ID)
        return url;
    }
}
