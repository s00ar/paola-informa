const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fetchFn = globalThis.fetch ? globalThis.fetch.bind(globalThis) : ((...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)));

admin.initializeApp();

const WEBHOOK_URL =
  process.env.WEBHOOK_URL || functions.config().webhook?.news_url || '';

async function postToWebhook(payload) {
  if (!WEBHOOK_URL) {
    functions.logger.warn('Skipping webhook call: WEBHOOK_URL not configured');
    return;
  }

  try {
    const response = await fetchFn(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Webhook responded with ${response.status}: ${text}`);
    }

    functions.logger.info('Webhook notification delivered');
  } catch (error) {
    functions.logger.error('Failed to deliver webhook notification', error);
    throw error;
  }
}

async function sendPushNotification(newsId, data, eventType) {
  const title = data.title || 'Nueva noticia disponible';
  const body = data.summary || 'Abre la app para ver los detalles.';

  const message = {
    topic: 'news',
    notification: {
      title,
      body,
    },
    data: {
      newsId,
      eventType,
      title,
      summary: data.summary || '',
      publishedAt: data.publishedAt?._seconds
        ? String(data.publishedAt._seconds)
        : '',
    },
  };

  try {
    await admin.messaging().send(message);
    functions.logger.info('Push notification sent', { newsId, eventType });
  } catch (error) {
    functions.logger.error('Failed to send push notification', error);
  }
}

exports.onNewsWrite = functions.firestore
  .document('news/{newsId}')
  .onWrite(async (change, context) => {
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;
    const { newsId } = context.params;

    let eventType = 'unknown';
    if (!before && after) {
      eventType = 'created';
    } else if (before && !after) {
      eventType = 'deleted';
    } else if (before && after) {
      eventType = 'updated';
    }

    const payload = {
      newsId,
      eventType,
      before,
      after,
      timestamp: new Date().toISOString(),
    };

    await postToWebhook(payload);

    if (eventType === 'created' || eventType === 'updated') {
      await sendPushNotification(newsId, after, eventType);
    }
  });