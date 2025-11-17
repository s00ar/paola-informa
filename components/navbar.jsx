import React from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ onHomePress, onSearchPress, onMapPress, onHelpPress }) => {
  const router = useRouter();

  const handleHome = () => (onHomePress ? onHomePress() : router.replace('/'));
  const handleSearch = () => (onSearchPress ? onSearchPress() : router.push('/search'));
  const handleMap = () => (onMapPress ? onMapPress() : router.push('/map'));
  const handleHelp = () => (onHelpPress ? onHelpPress() : router.push('/help'));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleHome}>
        <Text style={styles.text}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleMap}>
        <Ionicons name="map-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleHelp}>
        <Text style={styles.text}>Ayuda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    button: {
        padding: 10,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
});

export default Navbar;
