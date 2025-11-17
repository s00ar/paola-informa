import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ConfigurationScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Configuración en progreso</Text>
        <Text style={styles.body}>
          Esta sección estará disponible próximamente. Mientras tanto, puedes seguir usando las
          demás pantallas de la app sin inconvenientes.
        </Text>
      </View>
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow: '0px 10px 26px rgba(13, 42, 82, 0.12)',
  },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f6f8fc',
    justifyContent: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    ...cardShadow,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b3a57',
  },
  body: {
    fontSize: 14,
    color: '#41566e',
    lineHeight: 20,
  },
});
