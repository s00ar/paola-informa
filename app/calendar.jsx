import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'react-native';

const placeholderEvents = [
    { id: '1', title: 'Evento 1', date: '2024-07-01', description: 'Descripción del evento 1' },
    { id: '2', title: 'Evento 2', date: '2024-07-05', description: 'Descripción del evento 2' },
    { id: '3', title: 'Evento 3', date: '2024-07-10', description: 'Descripción del evento 3' },
];

const Calendar = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Calendario de Eventos</Text>
            <FlatList
                data={placeholderEvents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.eventItem}
                        onPress={() => setSelectedEvent(item)}
                    >
                        <Text style={styles.eventTitle}>{item.title}</Text>
                        <Text style={styles.eventDate}>{item.date}</Text>
                    </TouchableOpacity>
                )}
            />
            {selectedEvent && (
                <View style={styles.eventDetail}>
                    <Text style={styles.detailTitle}>{selectedEvent.title}</Text>
                    <Text>{selectedEvent.date}</Text>
                    <Text>{selectedEvent.description}</Text>
                    <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeButton}>
                        <Text style={styles.closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    eventItem: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
    eventTitle: { fontSize: 18 },
    eventDate: { color: '#888' },
    eventDetail: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 8, marginTop: 20 },
    detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    closeButton: { marginTop: 10, alignSelf: 'flex-end' },
    closeText: { color: '#007AFF' },
});
const CalendarAccessButton = ({ onPress }) => (
    <TouchableOpacity style={styles.calendarButton} onPress={onPress}>
        <Image
            source={require('../assets/images/calendario-residuos.jpg')}
            style={styles.calendarImage}
            resizeMode="contain"
        />
        <Text style={styles.calendarButtonText}>Ver calendario de recolección</Text>
    </TouchableOpacity>
);

// Add these styles to your styles object
styles.calendarButton = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
};
styles.calendarImage = {
    width: 40,
    height: 40,
    marginRight: 10,
};
styles.calendarButtonText = {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
};

// Add this state and handler to your Calendar component
const [showRecolectionCalendar, setShowRecolectionCalendar] = useState(false);

// Add this above the header inside your Calendar component's return
<CalendarAccessButton onPress={() => setShowRecolectionCalendar(true)} />

// Add this below everything else in your Calendar component's return
{showRecolectionCalendar && (
    <View style={styles.eventDetail}>
        <Image
            source={require('../assets/images/calendario-residuos.jpg')}
            style={{ width: '100%', height: 300, borderRadius: 8 }}
            resizeMode="contain"
        />
        <TouchableOpacity onPress={() => setShowRecolectionCalendar(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
    </View>
)}
export default Calendar;