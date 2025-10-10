import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const sub = req.body;
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert({ endpoint: sub.endpoint, subscription: sub })
    .select('endpoint')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true, endpoint: data?.endpoint });
}




