import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  generateStatePageSEO,
  generateLocationsIndexSEO,
  updateMetaTags,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateStatePageSchema,
  injectSchemaMarkup,
  generateStateBreadcrumbs,
  generateLocationsIndexBreadcrumbs,
  cleanupSEO,
} from '../seo';
import type { StateData } from '../../data/statesData';

describe('SEO Utilities', () => {
  const mockStateData: StateData = {
    name: 'California',
    slug: 'california',
    abbreviation: 'CA',
    legalStatus: 'illegal',
    population: 39538223,
    majorCities: ['Los Angeles', 'San Francisco'],
    proTeams: {
      nfl: ['Los Angeles Rams', 'San Francisco 49ers'],
      nba: ['Los Angeles Lakers', 'Golden State Warriors'],
    },
    popularSports: ['Football', 'Basketball'],
    memberCount: 487,
    nearbyStates: ['nevada', 'oregon'],
    seoKeywords: ['california sports betting', 'ca betting picks'],
  };

  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = '';
  });

  afterEach(() => {
    cleanupSEO();
  });

  describe('generateStatePageSEO', () => {
    it('should generate correct SEO config for a state', () => {
      const seo = generateStatePageSEO(mockStateData);

      expect(seo.title).toBe('Sports Betting Picks California | WizJock');
      expect(seo.description).toContain('California');
      expect(seo.description).toContain('Los Angeles Rams');
      expect(seo.description).toContain('487');
      expect(seo.canonical).toBe('https://wizjock.com/locations/california');
      expect(seo.keywords).toContain('sports betting california');
      expect(seo.keywords).toContain('california sports betting picks');
    });

    it('should handle states without member count', () => {
      const stateWithoutMembers = { ...mockStateData, memberCount: undefined };
      const seo = generateStatePageSEO(stateWithoutMembers);

      expect(seo.description).not.toContain('Join');
      expect(seo.description).toContain('California');
    });

    it('should handle legal states differently', () => {
      const legalState = { ...mockStateData, legalStatus: 'legal' as const };
      const seo = generateStatePageSEO(legalState);

      expect(seo.description).toContain('legal sports betting market');
    });
  });

  describe('generateLocationsIndexSEO', () => {
    it('should generate correct SEO config for locations index', () => {
      const seo = generateLocationsIndexSEO();

      expect(seo.title).toContain('All 50 States');
      expect(seo.description).toContain('all 50 US states');
      expect(seo.canonical).toBe('https://wizjock.com/locations');
      expect(seo.keywords).toContain('sports betting by state');
    });
  });

  describe('updateMetaTags', () => {
    it('should update document title', () => {
      const config = generateStatePageSEO(mockStateData);
      updateMetaTags(config);

      expect(document.title).toBe('Sports Betting Picks California | WizJock');
    });

    it('should create meta description tag', () => {
      const config = generateStatePageSEO(mockStateData);
      updateMetaTags(config);

      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc).toBeTruthy();
      expect(metaDesc?.getAttribute('content')).toContain('California');
    });

    it('should create meta keywords tag', () => {
      const config = generateStatePageSEO(mockStateData);
      updateMetaTags(config);

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      expect(metaKeywords).toBeTruthy();
      expect(metaKeywords?.getAttribute('content')).toContain('california');
    });

    it('should create canonical link', () => {
      const config = generateStatePageSEO(mockStateData);
      updateMetaTags(config);

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeTruthy();
      expect(canonical?.getAttribute('href')).toBe('https://wizjock.com/locations/california');
    });

    it('should create Open Graph tags', () => {
      const config = generateStatePageSEO(mockStateData);
      updateMetaTags(config);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogType = document.querySelector('meta[property="og:type"]');

      expect(ogTitle?.getAttribute('content')).toBe('Sports Betting Picks California | WizJock');
      expect(ogDesc?.getAttribute('content')).toContain('California');
      expect(ogUrl?.getAttribute('content')).toBe('https://wizjock.com/locations/california');
      expect(ogType?.getAttribute('content')).toBe('website');
    });

    it('should create Twitter Card tags', () => {
      const config = generateStatePageSEO(mockStateData);
      updateMetaTags(config);

      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');

      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
      expect(twitterTitle?.getAttribute('content')).toBe('Sports Betting Picks California | WizJock');
      expect(twitterDesc?.getAttribute('content')).toContain('California');
    });
  });

  describe('Schema Markup Generation', () => {
    describe('generateLocalBusinessSchema', () => {
      it('should generate valid LocalBusiness schema', () => {
        const schema = generateLocalBusinessSchema(mockStateData);

        expect(schema).toHaveProperty('@type', 'LocalBusiness');
        expect(schema).toHaveProperty('name', 'WizJock - California');
        expect(schema).toHaveProperty('url', 'https://wizjock.com/locations/california');
        expect(schema).toHaveProperty('priceRange', '$299-$999');
      });

      it('should include aggregate rating when member count exists', () => {
        const schema = generateLocalBusinessSchema(mockStateData) as any;

        expect(schema.aggregateRating).toBeDefined();
        expect(schema.aggregateRating.reviewCount).toBe('487');
        expect(schema.aggregateRating.ratingValue).toBe('4.8');
      });

      it('should not include aggregate rating when member count is missing', () => {
        const stateWithoutMembers = { ...mockStateData, memberCount: undefined };
        const schema = generateLocalBusinessSchema(stateWithoutMembers) as any;

        expect(schema.aggregateRating).toBeUndefined();
      });
    });

    describe('generateBreadcrumbSchema', () => {
      it('should generate valid Breadcrumb schema', () => {
        const breadcrumbs = generateStateBreadcrumbs(mockStateData);
        const schema = generateBreadcrumbSchema(breadcrumbs) as any;

        expect(schema['@type']).toBe('BreadcrumbList');
        expect(schema.itemListElement).toHaveLength(3);
        expect(schema.itemListElement[0].name).toBe('Home');
        expect(schema.itemListElement[1].name).toBe('Locations');
        expect(schema.itemListElement[2].name).toBe('California');
      });
    });

    describe('generateOrganizationSchema', () => {
      it('should generate valid Organization schema', () => {
        const schema = generateOrganizationSchema() as any;

        expect(schema['@type']).toBe('Organization');
        expect(schema.name).toBe('WizJock');
        expect(schema.url).toBe('https://wizjock.com');
        expect(schema.logo).toBe('https://wizjock.com/wizjock-logo.png');
        expect(schema.sameAs).toContain('https://twitter.com/wizjock');
      });
    });

    describe('generateStatePageSchema', () => {
      it('should generate complete schema with @graph', () => {
        const breadcrumbs = generateStateBreadcrumbs(mockStateData);
        const schema = generateStatePageSchema(mockStateData, breadcrumbs) as any;

        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@graph']).toHaveLength(3);
        expect(schema['@graph'][0]['@type']).toBe('LocalBusiness');
        expect(schema['@graph'][1]['@type']).toBe('BreadcrumbList');
        expect(schema['@graph'][2]['@type']).toBe('Organization');
      });
    });
  });

  describe('injectSchemaMarkup', () => {
    it('should inject schema markup into document head', () => {
      const breadcrumbs = generateStateBreadcrumbs(mockStateData);
      const schema = generateStatePageSchema(mockStateData, breadcrumbs);

      injectSchemaMarkup(schema);

      const scriptTag = document.querySelector('script[data-schema="wizjock-location"]');
      expect(scriptTag).toBeTruthy();
      expect(scriptTag?.getAttribute('type')).toBe('application/ld+json');
      
      const content = JSON.parse(scriptTag?.textContent || '{}');
      expect(content['@context']).toBe('https://schema.org');
    });

    it('should replace existing schema markup', () => {
      const breadcrumbs = generateStateBreadcrumbs(mockStateData);
      const schema1 = generateStatePageSchema(mockStateData, breadcrumbs);
      const schema2 = generateStatePageSchema({ ...mockStateData, name: 'Nevada' }, breadcrumbs);

      injectSchemaMarkup(schema1);
      injectSchemaMarkup(schema2);

      const scriptTags = document.querySelectorAll('script[data-schema="wizjock-location"]');
      expect(scriptTags).toHaveLength(1);
      
      const content = JSON.parse(scriptTags[0]?.textContent || '{}');
      expect(content['@graph'][0].name).toBe('WizJock - Nevada');
    });
  });

  describe('Breadcrumb Generation', () => {
    describe('generateStateBreadcrumbs', () => {
      it('should generate correct breadcrumbs for state page', () => {
        const breadcrumbs = generateStateBreadcrumbs(mockStateData);

        expect(breadcrumbs).toHaveLength(3);
        expect(breadcrumbs[0]).toEqual({
          name: 'Home',
          url: 'https://wizjock.com',
          position: 1,
        });
        expect(breadcrumbs[1]).toEqual({
          name: 'Locations',
          url: 'https://wizjock.com/locations',
          position: 2,
        });
        expect(breadcrumbs[2]).toEqual({
          name: 'California',
          url: 'https://wizjock.com/locations/california',
          position: 3,
        });
      });
    });

    describe('generateLocationsIndexBreadcrumbs', () => {
      it('should generate correct breadcrumbs for locations index', () => {
        const breadcrumbs = generateLocationsIndexBreadcrumbs();

        expect(breadcrumbs).toHaveLength(2);
        expect(breadcrumbs[0].name).toBe('Home');
        expect(breadcrumbs[1].name).toBe('Locations');
      });
    });
  });

  describe('cleanupSEO', () => {
    it('should remove schema markup', () => {
      const breadcrumbs = generateStateBreadcrumbs(mockStateData);
      const schema = generateStatePageSchema(mockStateData, breadcrumbs);

      injectSchemaMarkup(schema);
      expect(document.querySelector('script[data-schema="wizjock-location"]')).toBeTruthy();

      cleanupSEO();
      expect(document.querySelector('script[data-schema="wizjock-location"]')).toBeFalsy();
    });
  });
});
