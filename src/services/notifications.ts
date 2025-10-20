export interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function initializeNotifications(): Promise<void> {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker.ready;

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
  if (!vapidPublicKey) {
    console.warn('VITE_VAPID_PUBLIC_KEY not set; skipping push subscription.');
    return;
  }

  const existing = await registration.pushManager.getSubscription();
  if (existing) return;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  });

  const payload: PushSubscriptionPayload = subscription.toJSON() as PushSubscriptionPayload;

  try {
    // Store subscription in localStorage for now
    localStorage.setItem('push_subscription', JSON.stringify(payload));
    console.log('Push subscription stored locally');
  } catch (error) {
    console.error('Failed to store push subscription', error);
  }
}

export async function sendTestNotification(): Promise<void> {
  try {
    // Simulate test notification for now
    console.log('Test notification requested (simulated)');
  } catch (error) {
    console.error('Failed to request test notification', error);
  }
}



