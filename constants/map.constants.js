export const CENTER_REGION = {
  latitude: 39.3606,
  longitude: 16.0421,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

export const BUSINESS_TYPES = [
  { id: 'all', label: 'Todos', icon: 'layers-outline' },
  { id: 'pharmacy', label: 'Farmacias', icon: 'medkit-outline' },
  { id: 'tabacchi', label: 'Tabacchi', icon: 'cart-outline' },
  { id: 'doctor', label: 'Médicos', icon: 'person-outline' },
];

export const PLACES = [
  {
    id: 'farmacia-internazionale',
    name: 'Farmacia Internazionale',
    type: 'pharmacy',
    address: 'Via Nazionale 60, Paola',
    coordinate: { latitude: 39.36147, longitude: 16.04329 },
    url: 'https://www.google.com/maps/search/?api=1&query=Farmacia+Internazionale+Paola',
  },
  {
    id: 'farmacia-notarianni',
    name: 'Farmacia Notarianni',
    type: 'pharmacy',
    address: 'Corso G. Garibaldi 95, Paola',
    coordinate: { latitude: 39.36007, longitude: 16.03988 },
    url: 'https://www.google.com/maps/search/?api=1&query=Farmacia+Notarianni+Paola',
  },
  {
    id: 'tabacchi-giacco',
    name: 'Tabacchi Giacco',
    type: 'tabacchi',
    address: 'Via S. Agata 16, Paola',
    coordinate: { latitude: 39.36265, longitude: 16.04287 },
    url: 'https://www.google.com/maps/search/?api=1&query=Tabacchi+Giacco+Paola',
  },
  {
    id: 'studio-medico-cosenza',
    name: 'Studio Medico Cosenza',
    type: 'doctor',
    address: 'Via Basilio Di Martino 6, Paola',
    coordinate: { latitude: 39.3586, longitude: 16.0394 },
    url: 'https://www.google.com/maps/search/?api=1&query=Studio+Medico+Cosenza+Paola',
  },
];

export const WEB_EMBED_URL = 'https://maps.google.com/maps?q=Paola%20Italia&z=15&output=embed';
