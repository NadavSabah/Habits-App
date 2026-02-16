import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from './i18n'
import './index.css'
import App from './App.tsx'
import { useLocaleStore } from './store/localeStore'

// Apply saved locale before first render
const savedLocale = useLocaleStore.getState().locale
void i18n.changeLanguage(savedLocale)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
