import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALERTS = [
  {
    id: '1',
    category: 'Recogida de residuos',
    categoryColor: '#2AA96B',
    title: 'Calendario de recolección',
    datetime: '10 abril 2024, 15:00',
  },
  {
    id: '2',
    category: 'Obras',
    categoryColor: '#0B7A63',
    title: 'Obras de tráfico',
    datetime: '26 abril 2024, 15:00',
  },
  {
    id: '3',
    category: 'Servicios',
    categoryColor: '#C1352B',
    title: 'Interrupción de corriente',
    datetime: '20 abril 2024, 15:00',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Inicio</Text>
        </View>

        <View style={styles.cardsWrapper}>
          {ALERTS.map((alert) => (
            <View key={alert.id} style={styles.card}>
              <View style={[styles.categoryPill, { backgroundColor: alert.categoryColor }]}>
                <Text style={styles.categoryLabel}>{alert.category}</Text>
              </View>
              <Text style={styles.cardTitle}>{alert.title}</Text>
              <Text style={styles.cardDatetime}>{alert.datetime}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
  },
  brandPrimary: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B2E4B',
    letterSpacing: 1,
  },
  brandSecondary: {
    fontSize: 22,
    fontWeight: '600',
    color: '#C1352B',
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B2E4B',
    marginTop: 24,
  },
  cardsWrapper: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  categoryLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  cardTitle: {
    color: '#0B2E4B',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDatetime: {
    color: '#6B7280',
    fontSize: 13,
  },
});
