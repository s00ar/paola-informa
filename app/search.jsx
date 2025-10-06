import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Lista de funcionalidades de ejemplo
const FEATURES = [
    { id: '1', name: 'Noticias', url: '/news' },
    { id: '2', name: 'Calendario', url: '/calendar' },
    { id: '3', name: 'Contactos', url: '/contacts' },
    { id: '4', name: 'Notificaciones', url: '/notifications' },
    { id: '5', name: 'Configuración', url: '/settings' },
    { id: '6', name: 'Ayuda', url: '/help' },
];

export default function SearchFeatures() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(FEATURES);
    const router = useRouter();

    const handleSearch = (text) => {
        setQuery(text);
        const filtered = FEATURES.filter(f =>
            f.name.toLowerCase().includes(text.toLowerCase())
        );
        setResults(filtered);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(item.url)} // ← Navegación real
        >
        <Text style={styles.itemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Buscar funcionalidad..."
                value={query}
                onChangeText={handleSearch}
            />
            <FlatList
                data={results}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>No se encontraron funcionalidades.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    item: {
        padding: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    itemText: { fontSize: 16 },
    empty: { textAlign: 'center', color: '#888', marginTop: 20 },
});