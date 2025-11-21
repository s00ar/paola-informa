// Simple seeder to load demo data into Firestore using anonymous auth.
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
  collection,
} = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.+)\s*$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error('Missing Firebase env vars. Check .env before seeding.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sampleNews = [
  {
    id: 'bienvenida',
    title: 'Bienvenida a la app',
    summary: 'Conoce las funciones principales y atentos a próximas novedades.',
    body: 'Arrancamos con noticias, calendario y notificaciones en tiempo real. Gracias por ser parte.',
    categoryName: 'Comunidad',
    categoryColor: '#1D4ED8',
    publishedAt: serverTimestamp(),
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento programado',
    summary: 'Habrá ventana de mantenimiento el sábado a las 22:00.',
    body: 'Durante 30 minutos podrías notar intermitencias. Te avisaremos cuando termine.',
    categoryName: 'Infraestructura',
    categoryColor: '#F59E0B',
    publishedAt: serverTimestamp(),
  },
];

const sampleIncidents = [
  {
    id: 'servicio-lento',
    title: 'Demora en transacciones',
    description: 'Algunos usuarios reportan lentitud al pagar. Estamos investigando.',
    severity: 'warning',
    updatedAt: serverTimestamp(),
  },
  {
    id: 'servicio-normal',
    title: 'Servicio restablecido',
    description: 'Operaciones funcionando normalmente.',
    severity: 'info',
    updatedAt: serverTimestamp(),
  },
];

const sampleCalendar = [
  {
    id: 'visita-tecnica',
    title: 'Visita técnica',
    description: 'Revisión preventiva de equipos.',
    date: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  },
  {
    id: 'capacitacion',
    title: 'Capacitación de producto',
    description: 'Sesion virtual de 45 minutos.',
    date: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
  },
];

const sampleNotifications = [
  {
    id: 'recordatorio-pago',
    title: 'Recordatorio de pago',
    body: 'Tu depósito se acreditará hoy. Revisa tu panel.',
    scheduledAt: Timestamp.fromDate(new Date(Date.now() + 2 * 60 * 60 * 1000)),
  },
  {
    id: 'novedades',
    title: 'Novedades de la semana',
    body: 'Lee las mejoras recientes en la sección de noticias.',
    scheduledAt: serverTimestamp(),
  },
];

async function seedCollection(name, items) {
  for (const item of items) {
    const { id, ...rest } = item;
    await setDoc(doc(collection(db, name), id), rest, { merge: true });
  }
  console.log(`Seeded ${items.length} documents into ${name}`);
}

(async () => {
  await signInAnonymously(auth);
  console.log('Signed in anonymously');

  await seedCollection('news', sampleNews);
  await seedCollection('incidents', sampleIncidents);
  await seedCollection('calendarEvents', sampleCalendar);
  await seedCollection('notifications', sampleNotifications);

  console.log('Firestore seed completed.');
  process.exit(0);
})().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
