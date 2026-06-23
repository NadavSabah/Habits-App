import { useCallback, useEffect, useState } from 'react'
import pushNotificationService from '../services/pushNotificationService'
import type { UseNotificationsReturn } from '../types'

export function useNotifications(): UseNotificationsReturn {
  const isSupported = pushNotificationService.isPushSupported()
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPermission(pushNotificationService.getPermissionStatus())

    if (!isSupported) {
      return
    }

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((existingSubscription) => {
        setSubscription(existingSubscription)
      })
      .catch(() => {
        setSubscription(null)
      })
  }, [isSupported])

  const subscribe = useCallback(async (habitId?: string): Promise<void> => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported in this browser.')
    }

    setLoading(true)
    try {
      await pushNotificationService.requestPermission()
      const newPermission = pushNotificationService.getPermissionStatus()
      setPermission(newPermission)

      if (newPermission !== 'granted') {
        throw new Error('Permission denied. Enable notifications in your browser settings.')
      }

      const newSubscription = await pushNotificationService.subscribeToPush(habitId)
      setSubscription(newSubscription)
    } finally {
      setLoading(false)
    }
  }, [isSupported])

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      return
    }

    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const currentSubscription = await registration.pushManager.getSubscription()
      if (currentSubscription) {
        await currentSubscription.unsubscribe()
        await pushNotificationService.unsubscribe(currentSubscription.endpoint)
        setSubscription(null)
      }
    } finally {
      setLoading(false)
    }
  }, [isSupported])

  return {
    permission,
    subscription,
    loading,
    isSupported,
    subscribe,
    unsubscribe,
  }
}
