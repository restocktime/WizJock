import { useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import CookieConsent from './components/CookieConsent';
import { trackPageView } from './utils/analytics';

// Eager load landing page for best initial performance
import LandingPage from './pages/LandingPage';

// Lazy load all other pages
const Apply = lazy(() => import('./pages/Apply'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const ResponsibleGambling = lazy(() => import('./pages/ResponsibleGambling'));
const About = lazy(() => import('./pages/About'));
const WhyUs = lazy(() => import('./pages/WhyUs'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const MemberExperience = lazy(() => import('./pages/MemberExperience'));
const Contact = lazy(() => import('./pages/Contact'));
const LocationIndex = lazy(() => import('./pages/LocationIndex'));
const StatePage = lazy(() => import('./pages/StatePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const MemberLogin = lazy(() => import('./pages/MemberLogin'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Loading component
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

// Component to track page views on route changes
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnalyticsTracker />
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/responsible-gambling" element={<ResponsibleGambling />} />
            <Route path="/about" element={<About />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/member-experience" element={<MemberExperience />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/locations" element={<LocationIndex />} />
            <Route path="/locations/:stateSlug" element={<StatePage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/member-login" element={<MemberLogin />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieConsent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
