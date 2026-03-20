// Centralized API configuration
// Change these values to point to different backend servers

// For local development (Android emulator uses 10.0.2.2 to reach host localhost)
const MAIN_API = "http://10.0.2.2:3002";   // downifyBackend — Spotify redirect only

// For production
// const MAIN_API = "https://your-firebase-functions-url.cloudfunctions.net";

export const API_BASE = MAIN_API;

export const ENDPOINTS = {
    redirect: (id) => `${MAIN_API}/redirect?id=${id}`,
    // YouTube endpoints removed — now handled on-device via NewPipe Extractor
};
