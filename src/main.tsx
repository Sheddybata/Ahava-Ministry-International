
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeNotifications } from './services/notifications'
import { supabase } from './lib/supabaseClient'

// Register service worker for PWA (opt-in via VITE_ENABLE_SW)
if (import.meta.env.VITE_ENABLE_SW === 'true' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const version = Date.now().toString();
    navigator.serviceWorker.register(`/sw.js?v=${version}`)
      .then((registration) => {
        console.log('SW registered: ', registration);
        // Initialize web push notifications after SW is ready
        initializeNotifications().catch(console.error)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

async function hydrateAuth(): Promise<void> {
  try {
    const raw = localStorage.getItem('ff-auth-v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      const at = parsed?.access_token || parsed?.currentSession?.access_token;
      const rt = parsed?.refresh_token || parsed?.currentSession?.refresh_token;
      if (at && rt) {
        try { await (supabase.auth as any).setSession({ access_token: at, refresh_token: rt }); } catch {}
      }
    }
  } catch {}
  // Ensure we actually have a session; if not, try a refresh
  try {
    const s1 = await supabase.auth.getSession();
    if (!s1.session) {
      try { await (supabase.auth as any).refreshSession?.(); } catch {}
    }
  } catch {}
  await new Promise<void>((resolve) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      subscription.unsubscribe();
      resolve();
    });
  });
}

(async () => {
  await hydrateAuth();
  createRoot(document.getElementById('root')!).render(<App />);
})();
