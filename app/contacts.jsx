import React from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CONTACTS = [
  { label: 'Emergencias', value: '+39 0982 123456' },
  { label: 'Ayuntamiento de Paola', value: '+39 0982 789000' },
  { label: 'Correo', value: 'info@paolainforma.it', isEmail: true },
];

function handleContactPress(item) {
  if (!item?.value) {
    return;
  }
  const url = item.isEmail ? `mailto:${item.value}` : `tel:${item.value}`;
  Linking.openURL(url).catch(() => {});
}

export default function ContactsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contactos Rápidos</Text>
      <View style={styles.list}>
        {CONTACTS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleContactPress(item)}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow: '0px 8px 20px rgba(15, 42, 78, 0.12)',
  },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#f6f8fc',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1b3a57',
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    ...cardShadow,
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: '#41566e',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b3a57',
  },
});
