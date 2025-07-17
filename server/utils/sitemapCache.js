const generateDynamicSitemap = require('./dynamicSitemap');

// Cache object
let sitemapCache = {
  content: null,
  lastUpdated: null
};

// Cache expiration time (5 hours in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 60 * 1000;

/**
 * Get sitemap from cache or generate a new one
 * @param {string} baseUrl - The base URL of the website
 * @returns {Promise<string>} - The sitemap XML as a string
 */
const getSitemapFromCache = async (baseUrl) => {
  const now = new Date();
  
  // If cache is empty or expired, regenerate
  if (!sitemapCache.content || !sitemapCache.lastUpdated || 
      (now - sitemapCache.lastUpdated) > CACHE_EXPIRATION) {
    console.log('Sitemap cache expired or empty, regenerating...');
    try {
      sitemapCache.content = await generateDynamicSitemap(baseUrl);
      sitemapCache.lastUpdated = now;
      console.log('Sitemap cache updated at', now.toISOString());
    } catch (err) {
      console.error('Error updating sitemap cache:', err);
      // If we have a cached version, return it even if expired
      if (sitemapCache.content) {
        console.log('Returning stale cache due to error');
        return sitemapCache.content;
      }
      throw err;
    }
  } else {
    console.log('Serving sitemap from cache, last updated:', sitemapCache.lastUpdated.toISOString());
  }
  
  return sitemapCache.content;
};

/**
 * Force refresh the sitemap cache
 * @param {string} baseUrl - The base URL of the website
 * @returns {Promise<boolean>} - Success status
 */
const refreshSitemapCache = async (baseUrl) => {
  try {
    sitemapCache.content = await generateDynamicSitemap(baseUrl);
    sitemapCache.lastUpdated = new Date();
    console.log('Sitemap cache manually refreshed at', sitemapCache.lastUpdated.toISOString());
    return true;
  } catch (err) {
    console.error('Error refreshing sitemap cache:', err);
    return false;
  }
};

module.exports = {
  getSitemapFromCache,
  refreshSitemapCache
};