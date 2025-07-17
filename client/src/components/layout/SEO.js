import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ 
  title, 
  description, 
  canonicalUrl,
  ogType = 'website',
  ogImage = '/logo512.png' 
}) => {
  // Default site name
  const siteName = 'Is This Normal?';
  
  // Format the title
  const formattedTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Default description if none provided
  const defaultDescription = 'Ask and answer questions about what behaviors and situations are normal. Get anonymous validation from the community.';
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph tags for social sharing */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string
};

export default SEO;