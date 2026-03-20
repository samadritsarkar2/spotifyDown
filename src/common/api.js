// Centralized API configuration
// API_BASE_URL is read from .env file (see .env.example)
// Falls back to emulator localhost if not set

import { API_BASE_URL } from '@env';

const MAIN_API = API_BASE_URL || "http://10.0.2.2:3002";

export const API_BASE = MAIN_API;

export const ENDPOINTS = {
    redirect: (id) => `${MAIN_API}/redirect?id=${id}`,
    // YouTube endpoints removed — now handled on-device via NewPipe Extractor
};
