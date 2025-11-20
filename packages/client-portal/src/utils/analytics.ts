/**
 * Google Analytics 4 utility functions
 * Provides type-safe wrappers for GA4 event tracking
 * 
 * Privacy Compliance:
 * - IP anonymization is enabled by default
 * - No PII (personally identifiable information) is tracked
 * - Analytics only loads if VITE_GA_MEASUREMENT_ID is configured
 * - All tracking respects user privacy preferences
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event to track
 * @param params - Optional parameters to include with the event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track a page view in Google Analytics
 * @param path - The page path to track
 */
export const trackPageView = (path: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

/**
 * Track a CTA (Call-to-Action) button click
 * @param location - Where the CTA is located (e.g., 'header', 'hero', 'pricing_card')
 */
export const trackCTAClick = (location: string): void => {
  trackEvent('cta_click', {
    location,
    button_text: 'Request Access',
  });
};

/**
 * Track when a user starts filling out a form
 * @param formName - Name of the form (default: 'application')
 */
export const trackFormStart = (formName: string = 'application'): void => {
  trackEvent('form_start', {
    form_name: formName,
  });
};

/**
 * Track form submission (success or failure)
 * @param success - Whether the form submission was successful
 * @param formName - Name of the form (default: 'application')
 * @param errorMessage - Optional error message if submission failed
 */
export const trackFormSubmit = (
  success: boolean,
  formName: string = 'application',
  errorMessage?: string
): void => {
  trackEvent('form_submit', {
    form_name: formName,
    success,
    ...(errorMessage && { error_message: errorMessage }),
  });
};

/**
 * Track WhatsApp link clicks
 * @param location - Where the WhatsApp link is located
 */
export const trackWhatsAppClick = (location: string): void => {
  trackEvent('whatsapp_click', {
    location,
    link_type: 'external',
  });
};

/**
 * Track Core Web Vitals metrics
 * Sends performance metrics to Google Analytics for monitoring
 */
export const trackWebVitals = (): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Track Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    
    if (lastEntry) {
      const lcp = lastEntry.renderTime || lastEntry.loadTime;
      trackEvent('web_vitals', {
        metric_name: 'LCP',
        value: Math.round(lcp),
        metric_rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs_improvement' : 'poor',
      });
    }
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // Track First Input Delay (FID) / Interaction to Next Paint (INP)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      const fid = entry.processingStart - entry.startTime;
      trackEvent('web_vitals', {
        metric_name: 'FID',
        value: Math.round(fid),
        metric_rating: fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor',
      });
    });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // FID not supported
  }

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0;
  let clsEntries: any[] = [];

  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    });
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // CLS not supported
  }

  // Send CLS when page is hidden or unloaded
  const sendCLS = () => {
    if (clsValue > 0) {
      trackEvent('web_vitals', {
        metric_name: 'CLS',
        value: Math.round(clsValue * 1000) / 1000,
        metric_rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor',
      });
    }
  };

  // Send CLS on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendCLS();
    }
  });

  // Also send on page unload as fallback
  window.addEventListener('pagehide', sendCLS);

  // Track Time to First Byte (TTFB)
  const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    trackEvent('web_vitals', {
      metric_name: 'TTFB',
      value: Math.round(ttfb),
      metric_rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs_improvement' : 'poor',
    });
  }
};
