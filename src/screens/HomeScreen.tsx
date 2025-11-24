import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to MusicApp</Text>
      {/* Recently played section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        {/* Will be populated with recently played tracks */}
      </View>
      
      {/* Your playlists section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Playlists</Text>
        {/* Will be populated with user's playlists */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
});

export default HomeScreen;
