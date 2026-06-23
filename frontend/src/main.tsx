import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from './i18n'
import './index.css'
import App from './App'
import { useLocaleStore } from './store/localeStore'
import { useAuthStore } from './store/authStore'

// Apply saved locale before first render
const savedLocale = useLocaleStore.getState().locale
void i18n.changeLanguage(savedLocale)

// Check authentication on mount (validates token with server if present)
void useAuthStore.getState().checkAuth()

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' })
          }
        })
      })
    })
    .catch(() => {})
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true
      window.location.reload()
    }
  })
}

registerServiceWorker()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
