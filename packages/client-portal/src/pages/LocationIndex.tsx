import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statesByTier, searchStates, getStatesByLegalStatus, type StateData } from '../data/statesData';
import { generateLocationsIndexSEO, generateLocationsIndexBreadcrumbs, generateBreadcrumbSchema, generateOrganizationSchema } from '../utils/seo';
import { trackPageView, trackEvent } from '../utils/analytics';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

/**
 * LocationIndex Page Component
 * 
 * Displays all 50 US states organized by priority tiers:
 * - Tier 1: Legal sports betting states
 * - Tier 2: Large population states
 * - Tier 3: Remaining states
 * 
 * Features:
 * - Search functionality to find states
 * - Filter by legal status
 * - SEO optimized with meta tags and schema markup
 * - Breadcrumb navigation
 * - Analytics tracking
 */
export default function LocationIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'legal' | 'pending' | 'illegal'>('all');

  // Generate SEO config and breadcrumbs
  const seoConfig = generateLocationsIndexSEO();
  const breadcrumbs = generateLocationsIndexBreadcrumbs();

  // Generate schema markup
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      generateOrganizationSchema(),
    ],
  }), [breadcrumbs]);

  // Track page view on mount
  useEffect(() => {
    trackPageView('/locations');
    trackEvent('locations_index_view', {
      page_type: 'locations_index',
    });
  }, []);

  // Filter and search states
  const filteredStates = useMemo(() => {
    let states: StateData[] = [];

    // Apply status filter
    if (filterStatus === 'all') {
      states = [...statesByTier.tier1, ...statesByTier.tier2, ...statesByTier.tier3];
    } else {
      states = getStatesByLegalStatus(filterStatus);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = searchStates(searchQuery);
      const searchSlugs = new Set(searchResults.map(s => s.slug));
      states = states.filter(s => searchSlugs.has(s.slug));
    }

    return states;
  }, [searchQuery, filterStatus]);

  // Organize filtered states by tier for display
  const organizedStates = useMemo<
    | { filtered: StateData[] }
    | { tier1: StateData[]; tier2: StateData[]; tier3: StateData[] }
  >(() => {
    if (filterStatus !== 'all' || searchQuery.trim()) {
      // If filtering or searching, show flat list
      return { filtered: filteredStates };
    }

    // Otherwise show organized by tiers
    return {
      tier1: statesByTier.tier1,
      tier2: statesByTier.tier2,
      tier3: statesByTier.tier3,
    };
  }, [filteredStates, filterStatus, searchQuery]);

  // Track search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      trackEvent('location_search', {
        search_query: query,
        results_count: searchStates(query).length,
      });
    }
  };

  // Track filter change
  const handleFilterChange = (status: typeof filterStatus) => {
    setFilterStatus(status);
    trackEvent('location_filter', {
      filter_type: 'legal_status',
      filter_value: status,
    });
  };

  // Track state click
  const handleStateClick = (state: StateData) => {
    trackEvent('location_state_click', {
      state_name: state.name,
      state_slug: state.slug,
      legal_status: state.legalStatus,
      from_page: 'locations_index',
    });
  };

  return (
    <>
      <SEOHead config={seoConfig} schema={schema} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/" className="inline-block">
              <img 
                src="/optimized/wizjock-logo.webp" 
                alt="WizJock Logo" 
                className="h-10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/wizjock-logo.png';
                }}
              />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbs} className="mb-6" />

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sports Betting Picks by State
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find professional sports betting analysis and picks for your state. 
              WizJock serves all 50 US states with expert betting insights, local team coverage, and winning strategies.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div>
                <label htmlFor="state-search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search States
                </label>
                <input
                  id="state-search"
                  type="text"
                  placeholder="Search by state name, abbreviation, or city..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search for states"
                />
              </div>

              {/* Filter by Legal Status */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Legal Status
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value as typeof filterStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter states by legal status"
                >
                  <option value="all">All States</option>
                  <option value="legal">Legal Sports Betting</option>
                  <option value="pending">Pending Legislation</option>
                  <option value="illegal">Not Yet Legal</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            {(searchQuery.trim() || filterStatus !== 'all') && (
              <div className="mt-4 text-sm text-gray-600">
                Found {filteredStates.length} state{filteredStates.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* States Display */}
          {'filtered' in organizedStates ? (
            // Filtered/Searched Results
            <StateGrid 
              states={organizedStates.filtered} 
              onStateClick={handleStateClick}
            />
          ) : (
            // Organized by Tiers
            <>
              {/* Tier 1: Legal Sports Betting States */}
              <section className="mb-12">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Legal Sports Betting States
                  </h2>
                  <p className="text-gray-600">
                    States where online sports betting is currently legal and operational
                  </p>
                </div>
                <StateGrid 
                  states={organizedStates.tier1} 
                  onStateClick={handleStateClick}
                  highlight
                />
              </section>

              {/* Tier 2: Large Population States */}
              <section className="mb-12">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Major Markets
                  </h2>
                  <p className="text-gray-600">
                    Large population states with significant sports betting interest
                  </p>
                </div>
                <StateGrid 
                  states={organizedStates.tier2} 
                  onStateClick={handleStateClick}
                />
              </section>

              {/* Tier 3: All Other States */}
              <section className="mb-12">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    All Other States
                  </h2>
                  <p className="text-gray-600">
                    We serve bettors in all 50 US states
                  </p>
                </div>
                <StateGrid 
                  states={organizedStates.tier3} 
                  onStateClick={handleStateClick}
                />
              </section>
            </>
          )}

          {/* No Results */}
          {filteredStates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                No states found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-xl p-8 md:p-12 text-center text-white mt-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Winning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful bettors across all 50 states
            </p>
            <Link
              to="/apply"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              onClick={() => trackEvent('cta_click', { location: 'locations_index_bottom' })}
            >
              Request Access
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

/**
 * StateGrid Component
 * Displays states in a responsive grid layout
 */
interface StateGridProps {
  states: StateData[];
  onStateClick: (state: StateData) => void;
  highlight?: boolean;
}

function StateGrid({ states, onStateClick, highlight = false }: StateGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {states.map((state) => (
        <StateCard 
          key={state.slug} 
          state={state} 
          onClick={() => onStateClick(state)}
          highlight={highlight}
        />
      ))}
    </div>
  );
}

/**
 * StateCard Component
 * Individual state card with link to state page
 */
interface StateCardProps {
  state: StateData;
  onClick: () => void;
  highlight?: boolean;
}

function StateCard({ state, onClick, highlight = false }: StateCardProps) {
  const statusColors = {
    legal: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    illegal: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    legal: 'Legal',
    pending: 'Pending',
    illegal: 'Not Legal',
  };

  return (
    <Link
      to={`/locations/${state.slug}`}
      onClick={onClick}
      className={`block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-6 ${
        highlight ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* State Name and Abbreviation */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {state.name}
          </h3>
          <p className="text-sm text-gray-500">
            {state.abbreviation}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[state.legalStatus]}`}>
          {statusLabels[state.legalStatus]}
        </span>
      </div>

      {/* Member Count */}
      {state.memberCount && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold text-blue-600">{state.memberCount}</span> members
        </p>
      )}

      {/* Major Cities */}
      <p className="text-xs text-gray-500 mb-3">
        {state.majorCities.slice(0, 3).join(', ')}
      </p>

      {/* Teams Count */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {Object.keys(state.proTeams).length > 0 && (
          <span>
            {Object.values(state.proTeams).flat().length} pro teams
          </span>
        )}
      </div>

      {/* View Details Link */}
      <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
        View Details
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
