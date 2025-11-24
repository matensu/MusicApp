import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import TrackPlayer from 'react-native-track-player';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

const { width } = Dimensions.get('window');
const TRACK_ART_SIZE = width * 0.7;

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Mock track data - in a real app, this would come from your state management or API
  const track = {
    id: route.params?.trackId || '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverArt: 'https://i.scdn.co/image/ab67616d00001e02e6f407c7f3a0ec98845e4431',
  };

  // Animation for the album art
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    // Start rotation animation
    const startRotation = () => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    // Pause rotation
    const pauseRotation = () => {
      spinValue.stopAnimation();
    };

    if (isPlaying) {
      startRotation();
    } else {
      pauseRotation();
    }

    return () => spinValue.stopAnimation();
  }, [isPlaying, spinValue]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual play/pause functionality
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      {/* Album Art */}
      <View style={styles.artworkContainer}>
        <Animated.Image 
          source={{ uri: track.coverArt }} 
          style={[styles.artwork, { transform: [{ rotate: spin }] }]} 
        />
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration || 1}
          value={currentTime}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#535353"
          thumbTintColor="#1DB954"
          onSlidingComplete={(value) => {
            setCurrentTime(value);
            // TODO: Implement seek functionality
          }}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="shuffle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="play-skip-back" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={togglePlayPause}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={40} 
            color="black" 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="play-skip-forward" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isFavorite ? '#1DB954' : 'white'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  artwork: {
    width: TRACK_ART_SIZE,
    height: TRACK_ART_SIZE,
    borderRadius: TRACK_ART_SIZE / 2,
    backgroundColor: '#282828',
  },
  trackInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  trackTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
