import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE as string);

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT as string,
  process.env.VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { title, message, link } = req.body || {};
  if (!title || !message) return res.status(400).json({ error: 'Missing title or message' });

  // Save announcement
  const { error: insertError } = await supabase.from('announcements').insert({ title, message, link: link || null });
  if (insertError) return res.status(500).json({ error: insertError.message });

  // Fetch subscriptions
  const { data, error } = await supabase.from('push_subscriptions').select('subscription');
  if (error) return res.status(500).json({ error: error.message });

  const payload = JSON.stringify({ title, body: message, url: link || '/' });
  const sends = (data || []).map((row: any) => webpush.sendNotification(row.subscription, payload).catch(() => {}));
  await Promise.all(sends);
  return res.json({ ok: true, delivered: data?.length || 0 });
}




