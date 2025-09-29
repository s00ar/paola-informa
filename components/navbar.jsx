import React from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
const router = useRouter();

const handleHome = () => router.replace('/');
const handleSearch = () => router.push('/search');
const handleHelp = () => router.push('/help');
return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleHome}>
            <Text style={styles.text}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleHelp}>
            <Text style={styles.text}>Ayuda</Text>
        </TouchableOpacity>
    </View>
    );
}

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