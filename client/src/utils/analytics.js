import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = (trackingId) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(trackingId);
    console.log('GA initialized');
  }
};

// Track page views
export const trackPageView = (path) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.send({ hitType: 'pageview', page: path });
    console.log(`Page viewed: ${path}`);
  }
};

// Track events
export const trackEvent = (category, action, label = null, value = null) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
    console.log(`Event tracked: ${category} - ${action}`);
  }
};