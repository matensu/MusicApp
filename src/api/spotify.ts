import axios from 'axios';

// Spotify API configuration
export const SPOTIFY_CONFIG = {
  CLIENT_ID: 'YOUR_SPOTIFY_CLIENT_ID',
  REDIRECT_URI: 'yourapp://callback',
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  API_BASE_URL: 'https://api.spotify.com/v1',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-position',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'streaming',
  ].join(' '),
};

// Create axios instance for Spotify API
const spotifyApi = axios.create({
  baseURL: SPOTIFY_CONFIG.API_BASE_URL,
});

// Add request interceptor to include auth token
spotifyApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token management
const TOKEN_KEY = 'spotify_access_token';

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAccessToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Authentication
export const getAuthorizationUrl = (): string => {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: 'token',
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    scope: SPOTIFY_CONFIG.SCOPES,
    show_dialog: 'true',
  });

  return `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
};

export const extractTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  
  if (accessToken) {
    setAccessToken(accessToken);
    // Remove token from URL
    window.history.pushState({}, document.title, window.location.pathname);
  }
  
  return accessToken;
};

// User API
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await spotifyApi.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Track API
export const searchTracks = async (query: string, limit = 10): Promise<any[]> => {
  try {
    const response = await spotifyApi.get('/search', {
      params: {
        q: query,
        type: 'track',
        limit,
      },
    });
    return response.data.tracks?.items || [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

export const getTrack = async (trackId: string): Promise<any> => {
  try {
    const response = await spotifyApi.get(`/tracks/${trackId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }
};

// Playback API
export const getPlaybackState = async (): Promise<any> => {
  try {
    const response = await spotifyApi.get('/me/player');
    return response.data;
  } catch (error) {
    console.error('Error getting playback state:', error);
    throw error;
  }
};

export const playTrack = async (trackUri: string, deviceId?: string): Promise<void> => {
  try {
    await spotifyApi.put('/me/player/play' + (deviceId ? `?device_id=${deviceId}` : ''), {
      uris: [trackUri],
    });
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
};

export const pausePlayback = async (deviceId?: string): Promise<void> => {
  try {
    await spotifyApi.put('/me/player/pause' + (deviceId ? `?device_id=${deviceId}` : ''));
  } catch (error) {
    console.error('Error pausing playback:', error);
    throw error;
  }
};

// Playlist API
export const getUserPlaylists = async (limit = 20): Promise<any[]> => {
  try {
    const response = await spotifyApi.get('/me/playlists', {
      params: { limit },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return [];
  }
};

export const getPlaylistTracks = async (playlistId: string): Promise<any[]> => {
  try {
    const response = await spotifyApi.get(`/playlists/${playlistId}/tracks`);
    return response.data.items.map((item: any) => item.track);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
};

// Player controls
export const skipToNext = async (deviceId?: string): Promise<void> => {
  try {
    await spotifyApi.post('/me/player/next' + (deviceId ? `?device_id=${deviceId}` : ''));
  } catch (error) {
    console.error('Error skipping to next track:', error);
    throw error;
  }
};

export const skipToPrevious = async (deviceId?: string): Promise<void> => {
  try {
    await spotifyApi.post('/me/player/previous' + (deviceId ? `?device_id=${deviceId}` : ''));
  } catch (error) {
    console.error('Error skipping to previous track:', error);
    throw error;
  }
};

export const setVolume = async (volume: number, deviceId?: string): Promise<void> => {
  try {
    await spotifyApi.put(
      '/me/player/volume' + (deviceId ? `?device_id=${deviceId}` : ''),
      null,
      { params: { volume_percent: Math.min(100, Math.max(0, volume)) } }
    );
  } catch (error) {
    console.error('Error setting volume:', error);
    throw error;
  }
};
