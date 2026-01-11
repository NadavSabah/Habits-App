/**
 * Push Notification Service
 * 
 * Handles push notification subscription, unsubscription, and permission requests.
 * Works with the browser Push API and Service Worker API.
 */

import api from './api';
import type { VapidKeyResponse, PushSubscriptionDto, PushUnsubscribeDto } from '../types';

/**
 * Get public VAPID key from the server
 * @returns Promise resolving to the public VAPID key
 */
export const getVapidKey = async (): Promise<string> => {
  const response = await api.get<VapidKeyResponse>('/notifications/vapid-key');
  return response.data.publicKey;
};

/**
 * Subscribe to push notifications
 * @param subscription - PushSubscription object from the browser Push API
 * @param habitId - Optional habit ID for habit-specific notifications
 * @returns Promise that resolves when subscription is successful
 */
export const subscribe = async (
  subscription: PushSubscription,
  habitId?: string
): Promise<void> => {
  // Convert PushSubscription to the format expected by the backend
  const subscriptionData = subscription.toJSON();
  
  const payload: PushSubscriptionDto = {
    endpoint: subscriptionData.endpoint!,
    keys: {
      p256dh: subscriptionData.keys!.p256dh,
      auth: subscriptionData.keys!.auth,
    },
  };

  if (habitId) {
    payload.habitId = habitId;
  }

  await api.post('/notifications/subscribe', payload);
};

/**
 * Unsubscribe from push notifications
 * @param endpoint - The subscription endpoint to unsubscribe from
 * @returns Promise that resolves when unsubscription is successful
 */
export const unsubscribe = async (endpoint: string): Promise<void> => {
  const payload: PushUnsubscribeDto = { endpoint };
  await api.post('/notifications/unsubscribe', payload);
};

/**
 * Request notification permission from the user
 * @returns Promise resolving to the permission result ('granted', 'denied', or 'default')
 */
export const requestPermission = async (): Promise<NotificationPermission> => {
  // Check if Notification API is available
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser');
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Subscribe to push notifications using the browser Push API
 * This function handles the full subscription flow:
 * 1. Gets VAPID key from server
 * 2. Gets service worker registration
 * 3. Subscribes to push notifications
 * @param habitId - Optional habit ID for habit-specific notifications
 * @returns Promise resolving to the PushSubscription object
 */
export const subscribeToPush = async (
  habitId?: string
): Promise<PushSubscription> => {
  // Check if service workers and push are supported
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser');
  }

  if (!('PushManager' in window)) {
    throw new Error('Push messaging is not supported in this browser');
  }

  // Get VAPID key from server
  const publicKey = await getVapidKey();

  // Convert VAPID key to Uint8Array format required by Push API
  const keyArray = urlBase64ToUint8Array(publicKey);
  
  // Create a new Uint8Array with explicit ArrayBuffer to satisfy TypeScript
  const applicationServerKey = new Uint8Array(keyArray.buffer.slice(0));

  // Get service worker registration
  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  // Send subscription to backend
  await subscribe(subscription, habitId);

  return subscription;
};

/**
 * Helper function to convert VAPID key from base64 URL format to Uint8Array
 * @param base64String - Base64 URL encoded string
 * @returns Uint8Array representation of the key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Check if push notifications are supported in the current browser
 * @returns true if push notifications are supported, false otherwise
 */
export const isPushSupported = (): boolean => {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
};

/**
 * Get current notification permission status
 * @returns Current permission status or null if not supported
 */
export const getPermissionStatus = (): NotificationPermission | null => {
  if (!('Notification' in window)) {
    return null;
  }
  return Notification.permission;
};

const pushNotificationService = {
  getVapidKey,
  subscribe,
  unsubscribe,
  requestPermission,
  subscribeToPush,
  isPushSupported,
  getPermissionStatus,
};

export default pushNotificationService;
