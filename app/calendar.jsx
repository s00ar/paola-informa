import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase';

const RECOLECCION_IMAGE = require('../assets/images/calendario-residuos.jpg');
const CACHE_KEY = 'pi_cached_calendar_events';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsFromCache, setEventsFromCache] = useState(false);
  const [error, setError] = useState(null);

  const loadCachedEvents = async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        setEvents(JSON.parse(raw));
        setEventsFromCache(true);
      }
    } catch (err) {
      console.error('Error reading cached calendar', err);
    }
  };

  const loadEvents = async () => {
    setEventsFromCache(false);
    setError(null);
    try {
      const collectionRef = collection(db, 'calendarEvents');
      const calendarQuery = query(collectionRef, orderBy('date', 'asc'));
      const snapshot = await getDocs(calendarQuery);

      const mapped = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Sin título',
          date: data.date?.toDate?.() ? data.date.toDate().toLocaleDateString() : 'Sin fecha',
          description: data.description || 'Sin descripción',
        };
      });

      setEvents(mapped);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
    } catch (err) {
      console.error('Error loading calendar events', err);
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCachedEvents();
    loadEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Calendario de recolección</Text>

        <Image source={RECOLECCION_IMAGE} style={styles.recolectionImage} resizeMode="contain" />

        <Text style={styles.subheader}>Próximos eventos</Text>
        {error ? (
          <View>
            <Text style={styles.error}>No se pudieron cargar los eventos.</Text>
            {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
            {eventsFromCache ? <Text style={styles.cacheNote}>Mostrando datos guardados para modo offline.</Text> : null}
          </View>
        ) : null}
        {loading ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : events.length === 0 ? (
          <Text style={styles.placeholder}>Aún no hay eventos de calendario.</Text>
        ) : (
          <>
            {eventsFromCache ? <Text style={styles.cacheNote}>Mostrando datos guardados para modo offline.</Text> : null}
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.eventItem} onPress={() => setSelectedEvent(item)}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDate}>{item.date}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {selectedEvent ? (
          <View style={styles.eventDetail}>
            <Text style={styles.detailTitle}>{selectedEvent.title}</Text>
            <Text style={styles.eventDate}>{selectedEvent.date}</Text>
            <Text style={styles.eventDescription}>{selectedEvent.description}</Text>
            <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0B2E4B',
  },
  subheader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2E4B',
    marginTop: 12,
  },
  recolectionImage: {
    width: '100%',
    height: 260,
    borderRadius: 14,
  },
  eventItem: {
    paddingVertical: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2E4B',
  },
  eventDate: {
    color: '#6B7280',
    marginTop: 4,
  },
  placeholder: {
    color: '#6B7280',
    marginTop: 8,
  },
  error: {
    color: '#DC2626',
    fontSize: 15,
    marginTop: 6,
  },
  errorDetails: {
    color: '#7F1D1D',
    fontSize: 12,
    marginTop: 2,
  },
  cacheNote: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  eventDetail: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f6fb',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2E4B',
    marginBottom: 8,
  },
  eventDescription: {
    color: '#374151',
    marginBottom: 12,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
  },
});
