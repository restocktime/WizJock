import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';

// Configure axios base URL
// In production, use the production backend URL
// You should set VITE_API_URL in your Vercel environment variables
const productionBackendUrl = 'https://wizjock-production.up.railway.app';
const envApiUrl = import.meta.env.VITE_API_URL;
const apiUrl = envApiUrl || productionBackendUrl;
// Ensure URL starts with http/https to prevent relative path issues
axios.defaults.baseURL = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;

console.log('Client App - API Base URL:', axios.defaults.baseURL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
