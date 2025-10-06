import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e5c9a',
  },
  newsItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f1f4f8',
    borderRadius: 8,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b3a57',
  },
  newsSummary: {
    marginTop: 6,
    color: '#4b5b6b',
    lineHeight: 20,
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
});

export default function News() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'news'));
        if (!isMounted) {
          return;
        }

        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNews(items);
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching news', err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <Text>Cargando noticias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <Text style={styles.error}>No fue posible cargar las noticias.</Text>
        {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ultimas noticias</Text>

      {news.length === 0 ? (
        <Text style={styles.placeholder}>No hay noticias disponibles por ahora.</Text>
      ) : (
        news.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.newsItem}
            activeOpacity={0.85}
            onPress={() => router.push(`/news/${item.id}`)}
          >
            <Text style={styles.newsTitle}>{item.title || 'Sin titulo'}</Text>
            {item.summary ? (
              <Text style={styles.newsSummary}>{item.summary}</Text>
            ) : null}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}