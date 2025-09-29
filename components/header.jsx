import { ScrollView, View, Image, StyleSheet } from 'react-native';

const LOGO = require('../assets/images/logo.png');

const AppHeader = () => (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>
    </View>
);

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 264,
    height: 100,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 10,
  },
});

export default AppHeader;