import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SETTINGS_DOC_PATH = ['settings', 'general'];

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
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f6fb',
    borderWidth: 1,
    borderColor: '#d6e0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b3a57',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    color: '#3e4a59',
    flexShrink: 1,
  },
  value: {
    fontSize: 15,
    color: '#1b3a57',
    fontWeight: '500',
    marginLeft: 12,
    textAlign: 'right',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#1b3a57',
    marginBottom: 4,
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

const Settings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSettings = useCallback(async () => {
    setError(null);
    try {
      const snapshot = await getDoc(doc(db, ...SETTINGS_DOC_PATH));
      if (!snapshot.exists()) {
        setData(null);
        return;
      }

      setData(snapshot.data());
    } catch (err) {
      console.error('Error fetching settings', err);
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSettings();
  }, [fetchSettings]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.container]}>
        <Text>Cargando configuracion...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.container]}>
        <Text style={styles.error}>No se pudo cargar la configuracion.</Text>
        {error.message ? <Text style={styles.errorDetails}>{error.message}</Text> : null}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Configuracion de la aplicacion</Text>

      {data ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Version minima requerida</Text>
              <Text style={styles.value}>{data.appVersionRequired || 'No definida'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mensaje de mantenimiento</Text>
              <Text style={styles.value}>
                {data.maintenanceMessage ? data.maintenanceMessage : 'Sin mensajes'}
              </Text>
            </View>
          </View>

          {data.featureFlags ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Feature Flags</Text>
              <View style={styles.featureList}>
                {Object.entries(data.featureFlags).map(([key, value]) => (
                  <Text key={key} style={styles.featureItem}>
                    {key}: {value ? 'Activo' : 'Inactivo'}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}

          {data.updatedAt?.toDate ? (
            <Text style={styles.meta}>
              Ultima actualizacion: {data.updatedAt.toDate().toLocaleString()}
            </Text>
          ) : null}
        </>
      ) : (
        <Text style={styles.placeholder}>
          No hay configuraciones disponibles. Crea el documento "settings/general" en Firestore.
        </Text>
      )}
    </ScrollView>
  );
};

export default Settings;
