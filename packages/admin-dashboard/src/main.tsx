import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import './index.css';

// Configure axios base URL
// In production, use the production backend URL
// You should set VITE_API_URL in your Vercel environment variables
const productionBackendUrl = 'https://wizjock-production.up.railway.app';
const envApiUrl = import.meta.env.VITE_API_URL;
const apiUrl = envApiUrl || productionBackendUrl;
// Ensure URL starts with http/https to prevent relative path issues
axios.defaults.baseURL = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;

console.log('Admin Dashboard - API Base URL:', axios.defaults.baseURL);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
