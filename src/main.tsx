
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeNotifications } from './services/notifications'

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

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
