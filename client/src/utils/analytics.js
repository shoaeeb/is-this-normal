import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (trackingId) => {
  // Always initialize GA regardless of environment
  ReactGA.initialize(trackingId);
  console.log('GA initialized with ID:', trackingId);
};

// Track page views
export const trackPageView = (path) => {
  // Always track page views regardless of environment
  ReactGA.send({ hitType: 'pageview', page: path });
  console.log(`Page viewed: ${path}`);
};

// Track events
export const trackEvent = (category, action, label = null, value = null) => {
  // Always track events regardless of environment
  ReactGA.event({
    category,
    action,
    label,
    value
  });
  console.log(`Event tracked: ${category} - ${action}`);
};