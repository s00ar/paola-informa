import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

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
    } catch (err) {
      console.error('Error loading latest news', err);
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
  };

  const handleOpenArticle = (id) => {
    router.push(`/news/${id}`);
  };

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

        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <View>
            <Text style={styles.error}>No fue posible cargar las noticias.</Text>
            {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
          </View>
        ) : (
          <View style={styles.cardsWrapper}>
            {alerts.length === 0 ? (
              <Text style={styles.placeholder}>Aun no hay noticias disponibles.</Text>
            ) : (
              alerts.map((alert) => (
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
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

