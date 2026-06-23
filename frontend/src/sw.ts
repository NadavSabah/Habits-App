/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope
declare const __WB_MANIFEST: Array<{ url: string; revision?: string }>

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

const DEFAULT_ICON = '/icons/icon-192x192.png'

function onMessage(event: ExtendableMessageEvent): void {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
}

function onPush(event: PushEvent): void {
  let data: { title: string; body: string; icon: string; url: string; tag?: string } = {
    title: 'Habits Tracker',
    body: '',
    icon: DEFAULT_ICON,
    url: '/',
  }
  if (event.data) {
    try {
      const parsed = event.data.json() as Partial<typeof data>
      data = { ...data, ...parsed }
    } catch (_error) {
      data.body = event.data.text() ?? data.body
    }
  }
  const options: NotificationOptions & { renotify?: boolean } = {
    body: data.body,
    icon: data.icon ?? DEFAULT_ICON,
    badge: data.icon ?? DEFAULT_ICON,
    data: { url: data.url ?? '/' },
    tag: data.tag ?? 'habits-notification',
    renotify: true,
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
}

function onNotificationClick(event: NotificationEvent): void {
  event.notification.close()
  const url = (event.notification.data?.url as string) ?? '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
}

self.addEventListener('message', onMessage)
self.addEventListener('push', onPush)
self.addEventListener('notificationclick', onNotificationClick)
