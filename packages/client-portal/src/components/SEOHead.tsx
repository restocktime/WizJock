import { useEffect } from 'react';
import type { SEOConfig } from '../utils/seo';
import { updateMetaTags, injectSchemaMarkup, cleanupSEO } from '../utils/seo';

interface SEOHeadProps {
  config: SEOConfig;
  schema?: object;
}

/**
 * SEOHead component for dynamic meta tag and schema markup updates
 * 
 * This component handles:
 * - Updating document title
 * - Injecting/updating meta tags (description, keywords, OG tags, Twitter cards)
 * - Updating canonical links
 * - Injecting JSON-LD schema markup
 * 
 * Usage:
 * ```tsx
 * const seoConfig = generateStatePageSEO(stateData);
 * const schema = generateStatePageSchema(stateData, breadcrumbs);
 * 
 * <SEOHead config={seoConfig} schema={schema} />
 * ```
 */
export function SEOHead({ config, schema }: SEOHeadProps) {
  useEffect(() => {
    // Update meta tags
    updateMetaTags(config);
    
    // Inject schema markup if provided
    if (schema) {
      injectSchemaMarkup(schema);
    }
    
    // Cleanup function to remove schema markup when component unmounts
    return () => {
      cleanupSEO();
    };
  }, [config, schema]);
  
  // This component doesn't render anything
  return null;
}

export default SEOHead;
