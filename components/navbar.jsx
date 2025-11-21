import React from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ onHomePress, onCalendarPress, onMapPress }) => {
  const router = useRouter();

  const handleHome = () => (onHomePress ? onHomePress() : router.replace('/'));
  const handleCalendar = () =>
    onCalendarPress ? onCalendarPress() : router.push('/calendar');
  const handleMap = () => (onMapPress ? onMapPress() : router.push('/map'));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleHome}>
        <Ionicons name="home" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCalendar}>
        <Ionicons name="calendar-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleMap}>
        <Ionicons name="map-outline" size={24} color="black" />
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
});

export default Navbar;
