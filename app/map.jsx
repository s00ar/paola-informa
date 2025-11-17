import React from 'react';
import { Platform } from 'react-native';

import NativeMap from './map.native';

let CachedWebMap;

function loadWebMap() {
  if (CachedWebMap || typeof window === 'undefined') {
    return CachedWebMap;
  }

  CachedWebMap = require('./map.web').default;
  return CachedWebMap;
}

export default function MapScreen(props) {
  if (Platform.OS === 'web') {
    const WebMap = loadWebMap();
    if (!WebMap) {
      return null;
    }

    return <WebMap {...props} />;
  }

  return <NativeMap {...props} />;
}
