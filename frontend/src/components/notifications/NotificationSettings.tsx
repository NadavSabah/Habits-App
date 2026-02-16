/**
 * Notification Settings Component
 *
 * Manages push notification permission, subscription, and unsubscribe.
 * Shows permission status and Subscribe / Unsubscribe actions.
 */

import { useState, useEffect } from 'react';
import pushNotificationService from '../../services/pushNotificationService';
import { useHabitStore } from '../../store/habitStore';
import { Button } from '../common/Button';

export function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const habits = useHabitStore((state) => state.habits);

  useEffect(() => {
    const permissionStatus = pushNotificationService.getPermissionStatus();
    setPermission(permissionStatus ?? null);

    if (!pushNotificationService.isPushSupported()) {
      return;
    }
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        setIsSubscribed(!!subscription);
      })
      .catch(() => {
        setIsSubscribed(false);
      });
  }, []);

  const handleSubscribe = async () => {
    if (!pushNotificationService.isPushSupported()) {
      setError('Push notifications are not supported in this browser.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await pushNotificationService.requestPermission();
      const newPermission = pushNotificationService.getPermissionStatus();
      setPermission(newPermission ?? null);
      if (newPermission !== 'granted') {
        setError('Permission denied. Enable notifications in your browser settings.');
        setLoading(false);
        return;
      }
      await pushNotificationService.subscribeToPush();
      setIsSubscribed(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe to notifications.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!pushNotificationService.isPushSupported()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await pushNotificationService.unsubscribe(subscription.endpoint);
        setIsSubscribed(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!pushNotificationService.isPushSupported()) {
    return (
      <section className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-heading)]">
          Push notifications
        </h3>
        <p className="text-sm text-[var(--color-text)]">
          Push notifications are not supported in this browser.
        </p>
      </section>
    );
  }

  const permissionLabel =
    permission === 'granted'
      ? 'Allowed'
      : permission === 'denied'
        ? 'Blocked'
        : permission === 'default'
          ? 'Not set'
          : 'Unknown';

  return (
    <section className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-heading)]">
        Push notifications
      </h3>
      <p className="mb-4 text-sm text-[var(--color-text)]">
        Permission: <span className="font-medium">{permissionLabel}</span>
      </p>
      {error != null && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {!isSubscribed ? (
          <Button
            type="button"
            variant="primary"
            disabled={loading || permission === 'denied'}
            onClick={handleSubscribe}
          >
            {loading ? 'Subscribing…' : 'Subscribe'}
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={handleUnsubscribe}
          >
            {loading ? 'Unsubscribing…' : 'Unsubscribe'}
          </Button>
        )}
      </div>
      {habits.length > 0 && (
        <p className="mt-4 text-xs text-[var(--color-text)] opacity-80">
          Habit-specific reminder toggles can be configured when viewing a habit.
        </p>
      )}
    </section>
  );
}
