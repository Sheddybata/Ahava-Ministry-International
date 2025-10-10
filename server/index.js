import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webpush from 'web-push';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for demo; replace with DB in production
const subscriptions = new Map(); // key: userId (or anon), value: PushSubscription JSON

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn('VAPID keys are not set. Generate and set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.');
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY || 'x', VAPID_PRIVATE_KEY || 'y');

// Subscribe endpoint
app.post('/api/notifications/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
  // Simple demo user bucket: all under 'all'
  subscriptions.set(subscription.endpoint, subscription);
  return res.json({ ok: true });
});

// Test push endpoint
app.post('/api/notifications/test', async (req, res) => {
  try {
    // If no VAPID configured, simulate success in local dev
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.json({ ok: true, simulated: true, reason: 'Missing VAPID keys' });
    }
    if (subscriptions.size === 0) {
      return res.json({ ok: true, delivered: 0, note: 'No subscribers yet' });
    }
    const payload = JSON.stringify({ title: 'FaithFlow Test', body: 'This is a test notification', url: '/' });
    const sends = [];
    for (const sub of subscriptions.values()) {
      sends.push(webpush.sendNotification(sub, payload).catch(() => {}));
    }
    await Promise.all(sends);
    res.json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: true, simulated: true, reason: 'Error sending in dev' });
  }
});

// Facilitator announcements
app.post('/api/announcements', async (req, res) => {
  const { title, message, link } = req.body || {};
  if (!title || !message) return res.status(400).json({ error: 'Missing title or message' });
  const payload = JSON.stringify({ title, body: message, url: link || '/' });
  try {
    // If no VAPID configured, simulate success so UI flow works in dev
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.json({ ok: true, simulated: true, reason: 'Missing VAPID keys' });
    }
    if (subscriptions.size === 0) {
      return res.json({ ok: true, delivered: 0, note: 'No subscribers yet' });
    }
    const results = await Promise.allSettled(
      Array.from(subscriptions.values()).map((sub) => webpush.sendNotification(sub, payload))
    );
    const failed = results.filter(r => r.status === 'rejected').length;
    res.json({ ok: true, delivered: results.length - failed, failed });
  } catch (e) {
    res.status(200).json({ ok: true, simulated: true, reason: 'Error sending in dev' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


