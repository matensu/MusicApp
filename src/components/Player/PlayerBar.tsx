import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlayerBar = ({ onPress, track }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image 
        source={track?.artwork ? { uri: track.artwork } : require('../../assets/default-cover.png')} 
        style={styles.artwork}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {track?.title || 'Not Playing'}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track?.artist || 'No artist'}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="skip-previous" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="play-arrow" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="skip-next" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#404040',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginHorizontal: 5,
    padding: 5,
  },
});

export default PlayerBar;
