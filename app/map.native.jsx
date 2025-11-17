import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BUSINESS_TYPES, CENTER_REGION, PLACES, WEB_EMBED_URL } from '../constants/map.constants';

let MapView;
let Marker;
let Callout;

if (Platform.OS !== 'web') {
  const Maps = eval('require')('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Callout = Maps.Callout;
}

export default function MapScreen() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState(PLACES[0]?.id ?? null);
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  const filteredPlaces = useMemo(() => {
    if (selectedType === 'all') {
      return PLACES;
    }
    return PLACES.filter((place) => place.type === selectedType);
  }, [selectedType]);

  useEffect(() => {
    if (filteredPlaces.length === 0) {
      if (selectedPlaceId !== null) {
        setSelectedPlaceId(null);
      }
      return;
    }

    if (!selectedPlaceId || !filteredPlaces.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(filteredPlaces[0].id);
    }
  }, [filteredPlaces, selectedPlaceId]);

  useEffect(() => {
    if (!MapView || !selectedPlaceId) {
      return undefined;
    }

    const place = PLACES.find((item) => item.id === selectedPlaceId);
    if (!place) {
      return undefined;
    }

    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(
        {
          ...place.coordinate,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        350,
      );
    }

    const marker = markerRefs.current[selectedPlaceId];
    let timeoutId;
    if (marker?.showCallout) {
      timeoutId = setTimeout(() => {
        marker.showCallout();
      }, 120);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedPlaceId]);

  const handleOpenInMaps = useCallback((place) => {
    if (!place?.url) {
      return;
    }

    Linking.openURL(place.url).catch(() => {
      Alert.alert(
        'No se pudo abrir Google Maps',
        `Copia y pega este enlace en tu navegador:\n${place.url}`,
      );
    });
  }, []);

  const handleSelectPlace = useCallback(
    (place) => {
      if (!place) {
        return;
      }

      if (place.id !== selectedPlaceId) {
        setSelectedPlaceId(place.id);
      }

      if (!MapView) {
        handleOpenInMaps(place);
      }
    },
    [handleOpenInMaps, selectedPlaceId],
  );

  const renderFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {BUSINESS_TYPES.map((type) => {
        const isActive = type.id === selectedType;
        return (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => setSelectedType(type.id)}
          >
            <Ionicons
              name={type.icon}
              size={16}
              color={isActive ? '#fff' : '#1b3a57'}
              style={styles.filterIcon}
            />
            <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderCards = () => (
    <ScrollView style={styles.cardList} contentContainerStyle={styles.cardListContent}>
      {filteredPlaces.map((place) => {
        const isActive = place.id === selectedPlaceId;

        return (
          <TouchableOpacity
            key={place.id}
            style={[styles.card, isActive && styles.cardActive]}
            onPress={() => handleSelectPlace(place)}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{place.name}</Text>
              <TouchableOpacity
                onPress={() => handleOpenInMaps(place)}
                style={styles.cardAction}
                activeOpacity={0.7}
              >
                <Ionicons name="open-outline" size={18} color="#1b3a57" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardSubtitle}>{place.address}</Text>
            <Text style={styles.cardLink} onPress={() => handleOpenInMaps(place)}>
              Abrir en Google Maps
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const mapSection =
    !MapView || !Marker || !Callout ? (
      React.createElement('iframe', {
        key: 'web-map',
        src: WEB_EMBED_URL,
        style: styles.webMap,
        allowFullScreen: true,
        loading: 'lazy',
        referrerPolicy: 'no-referrer-when-downgrade',
        title: 'Mapa de Paola',
      })
    ) : (
      <MapView ref={mapRef} style={styles.map} initialRegion={CENTER_REGION}>
        {filteredPlaces.map((place) => {
          const isActive = place.id === selectedPlaceId;

          return (
            <Marker
              key={place.id}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[place.id] = ref;
                } else {
                  delete markerRefs.current[place.id];
                }
              }}
              coordinate={place.coordinate}
              title={place.name}
              description={place.address}
              pinColor={isActive ? '#1b3a57' : '#d9534f'}
              onPress={() => handleSelectPlace(place)}
            >
              <Callout onPress={() => handleOpenInMaps(place)}>
                <View style={styles.callout}>
                  <Text style={styles.placeTitle}>{place.name}</Text>
                  <Text style={styles.placeSubtitle}>{place.address}</Text>
                  <Text style={styles.calloutLink}>Abrir en Google Maps</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    );

  return (
    <View style={styles.screen}>
      <View style={styles.mapSection}>{mapSection}</View>
      <View style={styles.panel}>
        {!MapView && (
          <Text style={styles.webNotice}>
            El mapa interactivo completo está disponible en las apps móviles. Usa los filtros para
            abrir ubicaciones directamente en Google Maps.
          </Text>
        )}
        {renderFilters()}
        {renderCards()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  mapSection: {
    flex: 3,
    backgroundColor: '#dbe6f4',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  panel: {
    flex: 2,
    backgroundColor: '#f6f8fc',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
  },
  webMap: {
    width: '100%',
    height: '100%',
    border: 0,
    borderRadius: 16,
  },
  filterRow: {
    gap: 12,
    paddingRight: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f0f4fa',
  },
  filterChipActive: {
    backgroundColor: '#1b3a57',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterLabel: {
    fontSize: 14,
    color: '#1b3a57',
    fontWeight: '500',
  },
  filterLabelActive: {
    color: '#fff',
  },
  cardList: {
    flex: 1,
  },
  cardListContent: {
    gap: 12,
    paddingBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffffee',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardActive: {
    borderWidth: 2,
    borderColor: '#1b3a57',
    backgroundColor: '#ffffff',
  },
  cardAction: {
    padding: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b3a57',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#41566e',
    marginBottom: 8,
  },
  cardLink: {
    fontSize: 13,
    color: '#1b3a57',
    fontWeight: '500',
  },
  callout: {
    maxWidth: 220,
  },
  placeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeSubtitle: {
    fontSize: 12,
    color: '#41566e',
    marginBottom: 6,
  },
  calloutLink: {
    fontSize: 12,
    color: '#1b3a57',
    fontWeight: '500',
  },
  webNotice: {
    fontSize: 14,
    color: '#1b3a57',
  },
});
