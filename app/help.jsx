import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const Help = () => (
  <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
    <Text style={styles.title}>Ayuda para Ciudadanos Ancianos</Text>
    <Text style={styles.paragraph}>
      Bienvenido a la aplicacion Paola Informa. Esta app esta disenada para ayudarte a mantenerte informado y seguro.
    </Text>
    <Text style={styles.subtitle}>Como utilizar la app?</Text>
    <Text style={styles.paragraph}>
      1. Navega por las diferentes secciones usando el menu principal.
      {'\n'}2. Si necesitas ayuda o informacion importante, visita la seccion de "Contactos".
    </Text>
    <Text style={styles.subtitle}>Contactos Importantes</Text>
    <Text style={styles.paragraph}>
      En la seccion "Contactos" encontraras los numeros de emergencia, como:
      {'\n'}- Emergencias
      {'\n'}- Bomberos
      {'\n'}- Policia
      {'\n'}Puedes llamar directamente desde la app tocando el numero que necesites.
    </Text>
    <Text style={styles.paragraph}>
      Si tienes dudas, pide ayuda a un familiar o persona de confianza para aprender a usar la aplicacion.
    </Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
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
    lineHeight: 22,
  },
});

export default Help;
