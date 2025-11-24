import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import TrackPlayer, { 
  Event, 
  State, 
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Track
} from 'react-native-track-player';

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isReady: boolean;
  error: string | null;
  play: (track: Track) => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  position: number;
  duration: number;
  setupPlayer: () => Promise<boolean>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const isPlaying = playbackState === State.Playing || playbackState === State.Buffering;

  // Setup the player
  const setupPlayer = async () => {
    if (isInitialized.current) return true;
    
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SEEK_TO,
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
        ],
      });

      isInitialized.current = true;
      setIsReady(true);
      return true;
    } catch (e) {
      console.error('Error setting up player:', e);
      setError('Failed to initialize audio player');
      return false;
    }
  };

  // Initialize on mount
  useEffect(() => {
    setupPlayer();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  // Handle track changes
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.nextTrack !== undefined) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track || null);
    }
  });

  // Play a track
  const play = async (track: Track) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      setCurrentTrack(track);
      await TrackPlayer.play();
      setError(null);
    } catch (e) {
      console.error('Error playing track:', e);
      setError('Failed to play track');
    }
  };

  // Pause playback
  const pause = async () => {
    try {
      await TrackPlayer.pause();
    } catch (e) {
      console.error('Error pausing:', e);
      setError('Failed to pause playback');
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (e) {
      console.error('Error toggling playback:', e);
      setError('Failed to toggle playback');
    }
  };

  // Seek to position
  const seekTo = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (e) {
      console.error('Error seeking:', e);
      setError('Failed to seek');
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isReady,
        error,
        play,
        pause,
        togglePlayPause,
        seekTo,
        position,
        duration,
        setupPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};