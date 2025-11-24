import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStateData } from '../data/statesData';
import {
  generateStatePageSEO,
  updateMetaTags,
  generateStatePageSchema,
  generateStateBreadcrumbs,
  injectSchemaMarkup,
  cleanupSEO,
} from '../utils/seo';
import { trackPageView, trackEvent } from '../utils/analytics';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import {
  StateHero,
  LocalTeamsSection,
  StateBettingLandscape,
  WhyWizJockInState,
  NearbyStatesLinks,
  StateFAQ,
  StateCTA,
} from '../components/state';

/**
 * StateNotFound Component
 * Displays a custom 404 page for invalid state slugs
 */
function StateNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold mb-4">State Not Found</h1>
          <p className="text-xl text-gray-400 mb-8">
            We couldn't find the state you're looking for. Please check the URL or browse our locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/locations"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              View All States
            </Link>
            <Link
              to="/"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/**
 * StatePage Component
 * Dynamic page for each state at /locations/[state-slug]
 * 
 * Features:
 * - Dynamic routing with URL parameter extraction
 * - State data loading with error handling
 * - 404 handling for invalid state slugs
 * - SEO meta tag injection on component mount
 * - Schema markup injection
 * - Analytics tracking with state context
 */
export default function StatePage() {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  
  // Load state data based on URL parameter
  const stateData = stateSlug ? getStateData(stateSlug) : null;
  
  // Handle invalid state slug - show 404
  if (!stateData) {
    // Track 404 event
    useEffect(() => {
      trackEvent('state_page_404', {
        attempted_slug: stateSlug,
        page_path: `/locations/${stateSlug}`,
      });
    }, [stateSlug]);
    
    return <StateNotFound />;
  }
  
  // SEO setup - inject meta tags and schema markup on component mount
  useEffect(() => {
    // Generate SEO configuration
    const seoConfig = generateStatePageSEO(stateData);
    
    // Update meta tags
    updateMetaTags(seoConfig);
    
    // Generate and inject schema markup
    const breadcrumbs = generateStateBreadcrumbs(stateData);
    const schema = generateStatePageSchema(stateData, breadcrumbs);
    injectSchemaMarkup(schema);
    
    // Cleanup on unmount
    return () => {
      cleanupSEO();
    };
  }, [stateData]);
  
  // Analytics tracking with state context
  useEffect(() => {
    // Track page view with state identifier
    trackPageView(`/locations/${stateData.slug}`);
    
    // Track state-specific event
    trackEvent('state_page_view', {
      state_name: stateData.name,
      state_abbr: stateData.abbreviation,
      state_slug: stateData.slug,
      legal_status: stateData.legalStatus,
      member_count: stateData.memberCount || 0,
    });
  }, [stateData]);
  
  // Generate breadcrumb data
  const breadcrumbs = generateStateBreadcrumbs(stateData);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>
      
      {/* State Hero Section */}
      <StateHero stateData={stateData} />
      
      {/* Local Teams Section */}
      <LocalTeamsSection stateData={stateData} />
      
      {/* State Betting Landscape */}
      <StateBettingLandscape stateData={stateData} />
      
      {/* Why WizJock in State */}
      <WhyWizJockInState stateData={stateData} />
      
      {/* State FAQ */}
      <StateFAQ stateData={stateData} />
      
      {/* Nearby States Links */}
      <NearbyStatesLinks stateData={stateData} />
      
      {/* State CTA */}
      <StateCTA stateData={stateData} />
      
      {/* Legal Disclaimer */}
      <section className="py-12 px-4 bg-gray-900 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Legal Disclaimer:</strong> Sports betting laws vary by state. 
              Please check your local regulations before participating. Must be 21+ to participate in sports betting.
            </p>
            <p className="text-sm text-gray-400">
              <strong className="text-white">Performance Disclaimer:</strong> Past performance does not guarantee future results. 
              All betting involves risk. Please bet responsibly.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/responsible-gambling" className="text-blue-400 hover:text-blue-300">
                Responsible Gambling Resources
              </Link>
              <a 
                href="https://www.ncpgambling.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                National Council on Problem Gambling
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
