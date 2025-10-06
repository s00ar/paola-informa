import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  backText: {
    color: '#1b3a57',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1b3a57',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
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
  placeholder: {
    fontSize: 16,
    color: '#4b5b6b',
  },
  loader: {
    marginTop: 48,
  },
});

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) {
    return null;
  }
  return timestamp.toDate().toLocaleString();
};

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadNews = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'news', String(id)));
        if (!isMounted) {
          return;
        }

        if (!snapshot.exists()) {
          setNews(null);
        } else {
          setNews({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching news detail', err);
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
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.container]}>
        <ActivityIndicator style={styles.loader} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.container]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.error}>No se pudo cargar esta noticia.</Text>
        {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
      </View>
    );
  }

  if (!news) {
    return (
      <View style={[styles.screen, styles.container]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.placeholder}>La noticia no existe o fue eliminada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{news.title || 'Sin titulo'}</Text>
      {news.authorName || news.publishedAt ? (
        <Text style={styles.meta}>
          {news.authorName ? `Por ${news.authorName}` : ''}
          {news.authorName && news.publishedAt ? ' - ' : ''}
          {news.publishedAt ? formatDate(news.publishedAt) : ''}
        </Text>
      ) : null}

      {news.body ? (
        <Text style={styles.body}>{news.body}</Text>
      ) : (
        <Text style={styles.placeholder}>Esta noticia aun no tiene contenido detallado.</Text>
      )}
    </ScrollView>
  );
}