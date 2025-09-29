import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const ANIMATED_LOGO = require('../assets/images/animated-logo.gif');

export default function Splash() {
  return (
    <View style={styles.root}>
      <Image source={ANIMATED_LOGO} style={styles.logo} contentFit="contain" transition={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B2E4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 410,
    height: 340,
  },
});