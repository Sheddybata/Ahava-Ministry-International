// Service Worker for FaithFlow PWA
const CACHE_NAME = 'faithflow-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/faithflow-logo.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      console.log('Opened cache');
      // Attempt to cache core URLs, but don't fail install if any single URL fails
      await Promise.allSettled(urlsToCache.map((u) => cache.add(u)));
    } catch (_) {
      // Ignore cache errors during install to avoid breaking page load
    }
  })());
  // Activate updated SW immediately
  self.skipWaiting();
});

// Fetch event - network first for assets to avoid stale caches
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Bypass SW for Supabase auth/storage and API routes to avoid interfering with login/API
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('supabase.in') || url.pathname.startsWith('/api/')) {
    return; // Let the request go to the network unmodified
  }
  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      // Clone and store a copy of successful GET requests
      if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (err) {
      // Fallback to cache if offline or fetch failed
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) return cacheResponse;
      // As last resort, return a generic response
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of uncontrolled clients right away
  self.clients.claim();
});

// Handle push events
self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'FaithFlow Announcement';
    const body = data.body || 'You have a new announcement';
    const icon = '/faithflow-logo.jpg';
    const url = data.url || '/';

    event.waitUntil((async () => {
      // Show system notification
      await self.registration.showNotification(title, {
        body,
        icon,
        data: { url },
        badge: icon
      });
      // Notify open clients to update in-app badge
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        client.postMessage({ type: 'NEW_NOTIFICATION' });
      }
    })());
  } catch (e) {
    // Fallback to a simple notification if payload is not JSON
    event.waitUntil((async () => {
      await self.registration.showNotification('FaithFlow', {
        body: 'New announcement',
        icon: '/faithflow-logo.jpg'
      });
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        client.postMessage({ type: 'NEW_NOTIFICATION' });
      }
    })());
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(url)) return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
