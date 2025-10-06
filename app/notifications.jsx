import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

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
    color: '#2e5c9a',
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f3f6fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d6e0f0',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b3a57',
  },
  itemBody: {
    marginTop: 6,
    fontSize: 15,
    color: '#3e4a59',
    lineHeight: 21,
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: '#5c6c7d',
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
    fontSize: 12,
    color: '#8b0000',
    marginTop: 4,
  },
});

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(notificationsRef, orderBy('scheduledAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!isMounted) {
          return;
        }

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(data);
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching notifications', err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.container]}>
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.container]}>
        <Text style={styles.error}>No se pudieron cargar las notificaciones.</Text>
        {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {items.length === 0 ? (
        <Text style={styles.placeholder}>No hay notificaciones por ahora.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title || 'Sin titulo'}</Text>
            {item.body ? <Text style={styles.itemBody}>{item.body}</Text> : null}
            {item.scheduledAt?.toDate ? (
              <Text style={styles.meta}>
                Programada para {item.scheduledAt.toDate().toLocaleString()}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Notifications;
