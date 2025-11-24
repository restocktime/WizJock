import type { StateData } from '../data/statesData';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  ogType?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

/**
 * Generates SEO configuration for a state page
 */
export function generateStatePageSEO(stateData: StateData): SEOConfig {
  const { name, slug, memberCount, proTeams, legalStatus } = stateData;
  
  // Generate title
  const title = `Sports Betting Picks ${name} | WizJock`;
  
  // Generate description with state mentions
  const teamMention = proTeams.nfl?.[0] || proTeams.nba?.[0] || proTeams.mlb?.[0] || 'local teams';
  const memberText = memberCount ? ` Join ${memberCount} ${name} members` : '';
  const legalText = legalStatus === 'legal' ? 'legal sports betting market' : 'sports betting community';
  
  const description = `Professional sports betting analysis and picks for ${name}. Get expert insights on ${teamMention} and more.${memberText} winning with WizJock in ${name}'s ${legalText}.`;
  
  // Generate keywords
  const keywords = [
    `sports betting ${name.toLowerCase()}`,
    `${name.toLowerCase()} sports betting picks`,
    `best sports betting ${name.toLowerCase()}`,
    `${name.toLowerCase()} betting analysis`,
    ...stateData.seoKeywords,
  ];
  
  // Generate canonical URL
  const canonical = `https://wizjock.com/locations/${slug}`;
  
  // OG image (can be customized per state later)
  const ogImage = `https://wizjock.com/og-images/${slug}.jpg`;
  
  return {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType: 'website',
  };
}

/**
 * Generates SEO configuration for the locations index page
 */
export function generateLocationsIndexSEO(): SEOConfig {
  return {
    title: 'Sports Betting Picks by State | WizJock - All 50 States',
    description: 'Find professional sports betting analysis and picks for your state. WizJock serves all 50 US states with expert betting insights, local team coverage, and winning strategies.',
    keywords: [
      'sports betting by state',
      'state sports betting picks',
      'local sports betting analysis',
      'sports betting locations',
      'betting picks usa',
    ],
    canonical: 'https://wizjock.com/locations',
    ogImage: 'https://wizjock.com/og-images/locations.jpg',
    ogType: 'website',
  };
}

/**
 * Updates meta tags in the document head
 */
export function updateMetaTags(config: SEOConfig): void {
  // Update title
  document.title = config.title;
  
  // Update or create meta description
  updateMetaTag('name', 'description', config.description);
  
  // Update or create meta keywords
  updateMetaTag('name', 'keywords', config.keywords.join(', '));
  
  // Update canonical link
  updateLinkTag('canonical', config.canonical);
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:title', config.title);
  updateMetaTag('property', 'og:description', config.description);
  updateMetaTag('property', 'og:url', config.canonical);
  updateMetaTag('property', 'og:type', config.ogType || 'website');
  
  if (config.ogImage) {
    updateMetaTag('property', 'og:image', config.ogImage);
  }
  
  // Update Twitter Card tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', config.title);
  updateMetaTag('name', 'twitter:description', config.description);
  
  if (config.ogImage) {
    updateMetaTag('name', 'twitter:image', config.ogImage);
  }
}

/**
 * Helper function to update or create a meta tag
 */
function updateMetaTag(attribute: string, attributeValue: string, content: string): void {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

/**
 * Helper function to update or create a link tag
 */
function updateLinkTag(rel: string, href: string): void {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}

/**
 * Generates LocalBusiness schema markup for a state page
 */
export function generateLocalBusinessSchema(stateData: StateData): object {
  const { name, slug, memberCount } = stateData;
  
  return {
    '@type': 'LocalBusiness',
    '@id': `https://wizjock.com/locations/${slug}#business`,
    name: `WizJock - ${name}`,
    description: `Professional sports betting analysis and picks for ${name}`,
    url: `https://wizjock.com/locations/${slug}`,
    areaServed: {
      '@type': 'State',
      name: name,
    },
    priceRange: '$299-$999',
    ...(memberCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: memberCount.toString(),
      },
    }),
  };
}

/**
 * Generates Breadcrumb schema markup
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): object {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${breadcrumbs[breadcrumbs.length - 1].url}#breadcrumb`,
    itemListElement: breadcrumbs.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates Organization schema markup
 */
export function generateOrganizationSchema(): object {
  return {
    '@type': 'Organization',
    '@id': 'https://wizjock.com/#organization',
    name: 'WizJock',
    url: 'https://wizjock.com',
    logo: 'https://wizjock.com/wizjock-logo.png',
    sameAs: [
      'https://twitter.com/wizjock',
      'https://facebook.com/wizjock',
    ],
  };
}

/**
 * Generates complete schema markup for a state page
 */
export function generateStatePageSchema(stateData: StateData, breadcrumbs: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateLocalBusinessSchema(stateData),
      generateBreadcrumbSchema(breadcrumbs),
      generateOrganizationSchema(),
    ],
  };
}

/**
 * Injects schema markup into the document head
 */
export function injectSchemaMarkup(schema: object): void {
  // Remove existing schema markup with our ID
  const existingSchema = document.querySelector('script[data-schema="wizjock-location"]');
  if (existingSchema) {
    existingSchema.remove();
  }
  
  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema', 'wizjock-location');
  script.textContent = JSON.stringify(schema, null, 2);
  
  // Append to head
  document.head.appendChild(script);
}

/**
 * Generates breadcrumb items for a state page
 */
export function generateStateBreadcrumbs(stateData: StateData): BreadcrumbItem[] {
  return [
    {
      name: 'Home',
      url: 'https://wizjock.com',
      position: 1,
    },
    {
      name: 'Locations',
      url: 'https://wizjock.com/locations',
      position: 2,
    },
    {
      name: stateData.name,
      url: `https://wizjock.com/locations/${stateData.slug}`,
      position: 3,
    },
  ];
}

/**
 * Generates breadcrumb items for the locations index page
 */
export function generateLocationsIndexBreadcrumbs(): BreadcrumbItem[] {
  return [
    {
      name: 'Home',
      url: 'https://wizjock.com',
      position: 1,
    },
    {
      name: 'Locations',
      url: 'https://wizjock.com/locations',
      position: 2,
    },
  ];
}

/**
 * Removes all SEO-related elements added by these utilities
 */
export function cleanupSEO(): void {
  // Remove schema markup
  const schema = document.querySelector('script[data-schema="wizjock-location"]');
  if (schema) {
    schema.remove();
  }
  
  // Note: We don't remove meta tags as they'll be updated by the next page
  // This prevents flickering and maintains SEO continuity
}
