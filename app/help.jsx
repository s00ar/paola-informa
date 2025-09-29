import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const Help = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ayuda para Ciudadanos Ancianos</Text>
        <Text style={styles.paragraph}>
            Bienvenido a la aplicación Paola Informa. Esta app está diseñada para ayudarte a mantenerte informado y seguro.
        </Text>
        <Text style={styles.subtitle}>¿Cómo utilizar la app?</Text>
        <Text style={styles.paragraph}>
            1. Navega por las diferentes secciones usando el menú principal.
            {"\n"}2. Si necesitas ayuda o información importante, visita la sección de "Contactos".
        </Text>
        <Text style={styles.subtitle}>Contactos Importantes</Text>
        <Text style={styles.paragraph}>
            En la sección "Contactos" encontrarás los números de emergencia, como:
            {"\n"}- Emergencias
            {"\n"}- Bomberos
            {"\n"}- Policía
            {"\n"}Puedes llamar directamente desde la app tocando el número que necesites.
        </Text>
        <Text style={styles.paragraph}>
            Si tienes dudas, pide ayuda a un familiar o persona de confianza para aprender a usar la aplicación.
        </Text>
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2e5c9a',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#2e5c9a',
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 12,
        color: '#333',
    },
});

export default Help;