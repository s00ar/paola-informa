import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
const cardShadow = Platform.select({
  web: {
    boxShadow: '0px 8px 20px rgba(15, 38, 80, 0.12)',
  },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
});
const CACHE_KEYS = {
  alerts: 'pi_cached_alerts',
  incidents: 'pi_cached_incidents',
  events: 'pi_cached_events',
};
const INCIDENT_COLORS = {
  critical: '#DC2626',
  warning: '#F59E0B',
  info: '#2563EB',
};
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
    ...cardShadow,
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
  incidentsWrapper: {
    marginBottom: 16,
    gap: 10,
  },
  eventsWrapper: {
    marginBottom: 16,
    gap: 10,
  },
  incidentCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#eef2ff',
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  incidentTimestamp: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 12,
  },
  incidentDescription: {
    marginTop: 6,
    color: '#0B2E4B',
    fontSize: 14,
  },
  cacheNote: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },
  placeholder: {
    fontSize: 16,
    color: '#4b5b6b',
  },
  error: {
    fontSize: 16,
    color: '#d9534f',
  },
  errorDetails: {
    marginTop: 4,
    fontSize: 12,
    color: '#8b0000',
  },
  loader: {
    marginTop: 32,
  },
});
const randomColor = () => {
  const colors = ['#2AA96B', '#0B7A63', '#C1352B', '#2e5c9a', '#b76e79'];
  return colors[Math.floor(Math.random() * colors.length)];
};
export default function HomeScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [incidentsError, setIncidentsError] = useState(null);
  const [alertsFromCache, setAlertsFromCache] = useState(false);
  const [incidentsFromCache, setIncidentsFromCache] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsFromCache, setEventsFromCache] = useState(false);
  const [eventsError, setEventsError] = useState(null);
  const incidentsListenerRef = useRef(null);
  const eventsListenerRef = useRef(null);
  const loadCachedData = async () => {
    try {
      const [alertsRaw, incidentsRaw, eventsRaw] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.alerts),
        AsyncStorage.getItem(CACHE_KEYS.incidents),
        AsyncStorage.getItem(CACHE_KEYS.events),
      ]);
      if (alertsRaw) {
        setAlerts(JSON.parse(alertsRaw));
        setAlertsFromCache(true);
      }
      if (incidentsRaw) {
        setIncidents(JSON.parse(incidentsRaw));
        setIncidentsFromCache(true);
      }
      if (eventsRaw) {
        setEvents(JSON.parse(eventsRaw));
        setEventsFromCache(true);
      }
    } catch (err) {
      console.error('Error reading cached data', err);
    }
  };
  const loadAlerts = async () => {
    setError(null);
    try {
      const newsRef = collection(db, 'news');
      const newsQuery = query(newsRef, orderBy('publishedAt', 'desc'), limit(3));
      const snapshot = await getDocs(newsQuery);
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const publishedAt = docData.publishedAt?.toDate?.()
          ? docData.publishedAt.toDate()
          : null;
        return {
          id: doc.id,
          title: docData.title || 'Sin titulo',
          datetime: publishedAt ? publishedAt.toLocaleString() : 'Sin fecha',
          category: docData.categoryName || 'Noticias',
          categoryColor: docData.categoryColor || randomColor(),
        };
      });
      setAlerts(data);
      setAlertsFromCache(false);
      await AsyncStorage.setItem(CACHE_KEYS.alerts, JSON.stringify(data));
    } catch (err) {
      console.error('Error loading latest news', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const incidentsQuery = query(collection(db, 'incidents'), orderBy('updatedAt', 'desc'));
  const eventsQuery = query(collection(db, 'events'), orderBy('scheduledAt', 'desc'));
  const attachIncidentsListener = () => {
    setIncidentsError(null);
    const unsubscribe = onSnapshot(
      incidentsQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            title: docData.title || 'Aviso de servicio',
            description: docData.description || 'Revisa los detalles en tu comercio.',
            severity: docData.severity || 'info',
            timestamp: docData.updatedAt?.toDate?.()
              ? docData.updatedAt.toDate().toLocaleString()
              : '',
          };
        });
        setIncidents(data);
        setIncidentsFromCache(snapshot.metadata.fromCache);
        if (!snapshot.metadata.fromCache) {
          AsyncStorage.setItem(CACHE_KEYS.incidents, JSON.stringify(data)).catch((err) =>
            console.error('Error caching incidents', err)
          );
        }
      },
      async (err) => {
        console.error('Error loading incidents', err);
        setIncidentsError(err);
        const incidentsRaw = await AsyncStorage.getItem(CACHE_KEYS.incidents);
        if (incidentsRaw) {
          setIncidents(JSON.parse(incidentsRaw));
          setIncidentsFromCache(true);
        }
      }
    );
    incidentsListenerRef.current = unsubscribe;
  };
  const refreshIncidentsOnce = async () => {
    try {
      const snapshot = await getDocs(incidentsQuery);
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          title: docData.title || 'Aviso de servicio',
          description: docData.description || 'Revisa los detalles en tu comercio.',
          severity: docData.severity || 'info',
          timestamp: docData.updatedAt?.toDate?.()
            ? docData.updatedAt.toDate().toLocaleString()
            : '',
        };
      });
      setIncidents(data);
      setIncidentsFromCache(false);
      await AsyncStorage.setItem(CACHE_KEYS.incidents, JSON.stringify(data));
    } catch (err) {
      console.error('Error refreshing incidents', err);
      setIncidentsError(err);
    }
  };
  const attachEventsListener = () => {
    setEventsError(null);
    const unsubscribe = onSnapshot(
      eventsQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            title: docData.name || 'Evento',
            description: docData.description || '',
            scheduledAt: docData.scheduledAt?.toDate?.()
              ? docData.scheduledAt.toDate().toLocaleString()
              : '',
          };
        });
        setEvents(data);
        setEventsFromCache(snapshot.metadata.fromCache);
        if (!snapshot.metadata.fromCache) {
          AsyncStorage.setItem(CACHE_KEYS.events, JSON.stringify(data)).catch((err) =>
            console.error('Error caching events', err)
          );
        }
      },
      async (err) => {
        console.error('Error loading events', err);
        setEventsError(err);
        const eventsRaw = await AsyncStorage.getItem(CACHE_KEYS.events);
        if (eventsRaw) {
          setEvents(JSON.parse(eventsRaw));
          setEventsFromCache(true);
        }
      }
    );
    eventsListenerRef.current = unsubscribe;
  };
  const refreshEventsOnce = async () => {
    try {
      const snapshot = await getDocs(eventsQuery);
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          title: docData.name || 'Evento',
          description: docData.description || '',
          scheduledAt: docData.scheduledAt?.toDate?.()
            ? docData.scheduledAt.toDate().toLocaleString()
            : '',
        };
      });
      setEvents(data);
      setEventsFromCache(false);
      await AsyncStorage.setItem(CACHE_KEYS.events, JSON.stringify(data));
    } catch (err) {
      console.error('Error refreshing events', err);
      setEventsError(err);
    }
  };
  useEffect(() => {
    loadCachedData();
    loadAlerts();
    attachIncidentsListener();
    attachEventsListener();
    return () => {
      if (incidentsListenerRef.current) {
        incidentsListenerRef.current();
      }
      if (eventsListenerRef.current) {
        eventsListenerRef.current();
      }
    };
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadAlerts(), refreshIncidentsOnce(), refreshEventsOnce()]);
    } finally {
      setRefreshing(false);
    }
  };
  const handleOpenArticle = (id) => {
    router.push(`/news/${id}`);
  };
  const getIncidentColor = (severity) => INCIDENT_COLORS[severity] || INCIDENT_COLORS.info;
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Inicio</Text>
        </View>
        {incidents.length > 0 ? (
          <View style={styles.incidentsWrapper}>
            {incidents.map((incident) => (
              <View
                key={incident.id}
                style={[
                  styles.incidentCard,
                  { backgroundColor: `${getIncidentColor(incident.severity)}1A`, borderColor: getIncidentColor(incident.severity) },
                ]}
              >
                <Text style={[styles.incidentTitle, { color: getIncidentColor(incident.severity) }]}>
                  {incident.title}
                </Text>
                {incident.timestamp ? <Text style={styles.incidentTimestamp}>{incident.timestamp}</Text> : null}
                <Text style={styles.incidentDescription}>{incident.description}</Text>
              </View>
            ))}
            {incidentsFromCache ? (
              <Text style={styles.cacheNote}>Mostrando avisos almacenados para modo offline.</Text>
            ) : null}
          </View>
        ) : incidentsError ? (
          <Text style={styles.placeholder}>No se pudieron cargar las incidencias.</Text>
        ) : null}
        {events.length > 0 ? (
          <View style={styles.eventsWrapper}>
            <Text style={styles.cardTitle}>Próximos eventos</Text>
            {events.map((event) => (
              <View key={event.id} style={styles.incidentCard}>
                <Text style={styles.incidentTitle}>{event.title}</Text>
                {event.scheduledAt ? <Text style={styles.incidentTimestamp}>{event.scheduledAt}</Text> : null}
                <Text style={styles.incidentDescription}>{event.description}</Text>
              </View>
            ))}
            {eventsFromCache ? (
              <Text style={styles.cacheNote}>Mostrando eventos almacenados para modo offline.</Text>
            ) : null}
          </View>
        ) : eventsError ? (
          <Text style={styles.placeholder}>No se pudieron cargar los eventos.</Text>
        ) : null}
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : alerts.length > 0 ? (
          <View style={styles.cardsWrapper}>
            {alertsFromCache ? (
              <Text style={styles.cacheNote}>Mostrando noticias guardadas para modo offline.</Text>
            ) : null}
            {alerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={styles.card}
                onPress={() => handleOpenArticle(alert.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.categoryPill, { backgroundColor: alert.categoryColor }]}>
                  <Text style={styles.categoryLabel}>{alert.category}</Text>
                </View>
                <Text style={styles.cardTitle}>{alert.title}</Text>
                <Text style={styles.cardDatetime}>{alert.datetime}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : error ? (
          <View>
            <Text style={styles.error}>No fue posible cargar las noticias.</Text>
            {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
          </View>
        ) : (
          <View>
            <Text style={styles.placeholder}>Aun no hay noticias disponibles.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
