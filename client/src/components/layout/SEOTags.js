import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Enhanced SEO component with comprehensive meta tags
 */
const SEOTags = ({ 
  title, 
  description, 
  canonicalUrl,
  keywords = [],
  ogType = 'website',
  ogImage = '/og-image.jpg',
  structuredData = null
}) => {
  // Default site name
  const siteName = 'Is This Normal?';
  
  // Format the title
  const formattedTitle = title ? `${title} | ${siteName}` : `${siteName} | Anonymous Behavior Validation Platform`;
  
  // Default description if none provided
  const defaultDescription = 'Anonymous platform to validate your habits, thoughts, and behaviors. Get community feedback on what\'s normal without judgment.';
  
  // Default keywords if none provided
  const defaultKeywords = [
    'normal behavior', 
    'is this normal', 
    'anonymous questions', 
    'behavior validation', 
    'social validation', 
    'anonymous confession', 
    'mental health support', 
    'community feedback'
  ];
  
  // Combine default and custom keywords
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');
  
  // Get the current URL if canonical not provided
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={allKeywords} />
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* Open Graph tags for social sharing */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured data for rich results */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEOTags.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  structuredData: PropTypes.object
};

export default SEOTags;