import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import './index.css';

// Configure axios base URL
// In production, use the production backend URL
// You should set VITE_API_URL in your Vercel environment variables
const productionBackendUrl = 'https://wizjock-production.up.railway.app'; // Update this with your actual backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || productionBackendUrl;

console.log('Admin Dashboard - API Base URL:', axios.defaults.baseURL);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
