import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { trackWebVitals } from './utils/analytics';

// Initialize Google Analytics 4
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  function gtag(...args: any[]) {
    if (window.dataLayer) {
      window.dataLayer.push(args);
    }
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true, // Anonymize IP for privacy compliance
    cookie_flags: 'SameSite=None;Secure', // Cookie security
  });

  // Make gtag available globally
  window.gtag = gtag;

  // Initialize Core Web Vitals tracking
  if (document.readyState === 'complete') {
    trackWebVitals();
  } else {
    window.addEventListener('load', trackWebVitals);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
