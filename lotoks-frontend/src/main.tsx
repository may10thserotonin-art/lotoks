import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAuth } from './store/auth'
import { initAdminAuth } from './store/adminAuth'

// Initialize auth states (check for existing sessions)
initAuth();
initAdminAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
