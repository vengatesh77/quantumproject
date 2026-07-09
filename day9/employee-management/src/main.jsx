import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initData } from './services/localStorageService'

// Initialize local storage data
initData();

// Apply saved theme before render to prevent flash
const savedTheme = localStorage.getItem('ems_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
