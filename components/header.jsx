import React, { useState } from 'react';
import { ScrollView, View, Image, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const LOGO = require('../assets/images/logo.png');

const MENULIST = [
  { name: 'Inicio', icon: 'home-outline', route: '/' },
  { name: 'Noticias', icon: 'newspaper', route: '/news' },
  { name: 'Mapa', icon: 'map-outline', route: '/map' },
  { name: 'Calendario', icon: 'calendar-outline', route: '/calendar' },
  { name: 'Contactos', icon: 'people-outline', route: '/contacts' },
  { name: 'Buscar', icon: 'search-outline', route: '/search' },
  { name: 'Notificaciones', icon: 'notifications-outline', route: '/notifications' },
  { name: 'Configuraci\u00f3n', icon: 'settings-outline', route: '/settings' },
  { name: 'Ayuda', icon: 'help-circle-outline', route: '/help' },
];

function MenuItem({ name, icon, route, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={() => onPress(route)}>
      <Ionicons name={icon} size={20} color="#1b3a57" style={styles.menuIcon} />
      <Text style={styles.menuText}>{name}</Text>
    </TouchableOpacity>
  );
}

const AppHeader = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (route) => {
    setMenuOpen(false);
    if (route === '/') {
      router.replace(route);
    } else {
      router.push(route);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={isMenuOpen ? 'Cerrar men\u00fa' : 'Abrir men\u00fa'}
              onPress={() => setMenuOpen((prev) => !prev)}
              style={styles.menuButton}
            >
              <Ionicons
                name={isMenuOpen ? 'close' : 'menu'}
                size={28}
                color="#1b3a57"
              />
            </TouchableOpacity>
          </View>
        </View>
        {isMenuOpen ? (
          <View style={styles.menuList}>
            {MENULIST.map((item) => (
              <MenuItem
                key={item.route}
                name={item.name}
                icon={item.icon}
                route={item.route}
                onPress={handleNavigate}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const menuShadow = Platform.select({
  web: {
    boxShadow: '0px 8px 20px rgba(15, 53, 94, 0.12)',
  },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  header: {
    backgroundColor: '#fff',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 264,
    height: 100,
  },
  menuButton: {
    padding: 8,
  },
  menuList: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f3f6fb',
    ...menuShadow,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#1b3a57',
    fontWeight: '500',
  },
});

export default AppHeader;
