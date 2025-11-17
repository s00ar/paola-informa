import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BUSINESS_TYPES, CENTER_REGION, PLACES } from '../constants/map.constants';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const BASE_ICON_PROPS = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -32],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
};
const LEAFLET_MAP_STYLE = { width: '100%', height: '100%' };

let LeafletLib;
let ReactLeafletLib;

function loadLeafletModules() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!ReactLeafletLib) {
    ReactLeafletLib = require('react-leaflet');
  }

  if (!LeafletLib) {
    const leafletModule = require('leaflet');
    LeafletLib = leafletModule?.default ?? leafletModule;
  }

  return ReactLeafletLib;
}

function buildMarkerIcons(leafletInstance) {
  if (!leafletInstance) {
    return null;
  }

  return {
    default: leafletInstance.icon({
      ...BASE_ICON_PROPS,
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    }),
    active: leafletInstance.icon({
      ...BASE_ICON_PROPS,
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    }),
  };
}

function useLeafletStyles() {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const existing = document.querySelector('link[data-leaflet-css="true"]');
    if (existing) {
      return undefined;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = 'anonymous';
    link.setAttribute('data-leaflet-css', 'true');

    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);
}

function MapFocusController({ coordinate, useMapHook }) {
  const map = useMapHook();

  useEffect(() => {
    if (!coordinate) {
      map.setView([CENTER_REGION.latitude, CENTER_REGION.longitude], 14);
      return;
    }

    map.flyTo([coordinate.latitude, coordinate.longitude], 16, { duration: 0.4 });
  }, [coordinate, map]);

  return null;
}

const POINTER_EVENTS_TO_STOP = [
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointercancel',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
];

function LeafletMap({ filteredPlaces, selectedPlaceId, onSelectPlace, onOpenInMaps }) {
  useLeafletStyles();
  const markerRefs = useRef({});
  const mapHostRef = useRef(null);
  const leafletModules = loadLeafletModules();
  const leafletInstance = LeafletLib;
  const markerIcons = useMemo(() => buildMarkerIcons(leafletInstance), [leafletInstance]);

  const selectedPlace = useMemo(
    () => filteredPlaces.find((place) => place.id === selectedPlaceId) ?? null,
    [filteredPlaces, selectedPlaceId],
  );

  useEffect(() => {
    const allowed = new Set(filteredPlaces.map((place) => place.id));
    Object.keys(markerRefs.current).forEach((id) => {
      if (!allowed.has(id)) {
        delete markerRefs.current[id];
      }
    });
  }, [filteredPlaces]);

  useEffect(() => {
    if (!selectedPlaceId) {
      return;
    }

    const marker = markerRefs.current[selectedPlaceId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPlaceId]);

  useEffect(() => {
    // Leaflet stops some start events internally, so block bubbling to RN Web to avoid touch-bank warnings
    const node = mapHostRef.current;
    if (!node) {
      return undefined;
    }

    const stopPropagation = (event) => {
      event.stopPropagation();
    };

    POINTER_EVENTS_TO_STOP.forEach((eventName) => {
      node.addEventListener(eventName, stopPropagation);
    });

    return () => {
      POINTER_EVENTS_TO_STOP.forEach((eventName) => {
        node.removeEventListener(eventName, stopPropagation);
      });
    };
  }, []);

  if (!leafletModules || !leafletInstance || !markerIcons) {
    return (
      <View ref={mapHostRef} style={styles.mapHost}>
        <Text>El mapa se cargará cuando el navegador esté disponible.</Text>
      </View>
    );
  }

  const { MapContainer, Marker, Popup, TileLayer, useMap } = leafletModules;

  return (
    <View ref={mapHostRef} style={styles.mapHost}>
      <MapContainer
        center={[CENTER_REGION.latitude, CENTER_REGION.longitude]}
        zoom={14}
        scrollWheelZoom
        style={LEAFLET_MAP_STYLE}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <MapFocusController coordinate={selectedPlace?.coordinate} useMapHook={useMap} />
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinate.latitude, place.coordinate.longitude]}
            icon={place.id === selectedPlaceId ? markerIcons.active : markerIcons.default}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[place.id] = ref;
              } else {
                delete markerRefs.current[place.id];
              }
            }}
            eventHandlers={{
              click: () => onSelectPlace(place),
            }}
          >
            <Popup>
              <View style={styles.callout}>
                <Text style={styles.placeTitle}>{place.name}</Text>
                <Text style={styles.placeSubtitle}>{place.address}</Text>
                <Text style={styles.calloutLink} onPress={() => onOpenInMaps(place)}>
                  Abrir en Google Maps
                </Text>
              </View>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </View>
  );
}

export default function MapScreen() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState(PLACES[0]?.id ?? null);

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
    },
    [selectedPlaceId],
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
            activeOpacity={0.8}
            onPress={() => handleSelectPlace(place)}
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

  return (
    <View style={styles.screen}>
      <View style={styles.mapSection}>
        <LeafletMap
          filteredPlaces={filteredPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={handleSelectPlace}
          onOpenInMaps={handleOpenInMaps}
        />
      </View>
      <View style={styles.panel}>
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
  mapHost: {
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
    boxShadow: '0px 10px 28px rgba(15, 38, 80, 0.16)',
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
});
