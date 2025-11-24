import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { SPOTIFY_CONFIG } from '../../api/spotify';

type Track = {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // This would be replaced with actual data fetching
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setTracks([
        // Mock data - replace with actual API call
        {
          id: '1',
          name: 'Track 1',
          artists: [{ name: 'Artist 1' }],
          album: { images: [{ url: 'https://via.placeholder.com/150' }] },
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => navigation.navigate('Player', { trackId: item.id })}
    >
      <Image 
        source={{ uri: item.album.images[0]?.url || 'https://via.placeholder.com/50' }} 
        style={styles.trackImage}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.artists.map(artist => artist.name).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Played</Text>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    color: '#B3B3B3',
    fontSize: 14,
  },
});
