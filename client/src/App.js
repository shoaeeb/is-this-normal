import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { initGA, trackPageView } from './utils/analytics';
import DebugStorage from './components/utils/DebugStorage';
import Home from './components/pages/Home';
import QuestionDetail from './components/questions/QuestionDetail';
import QuestionForm from './components/questions/QuestionForm';
import CategoryQuestions from './components/questions/CategoryQuestions';
import SearchResults from './components/questions/SearchResults';
import MyQuestions from './components/questions/MyQuestions';
import About from './components/pages/About';
import Sitemap from './components/pages/Sitemap';
import NotFound from './components/pages/NotFound';

// Google Analytics tracking ID from environment variable
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-T5RVXEYJ0C';

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  
  return null;
};

const App = () => {
  // Initialize Google Analytics
  useEffect(() => {
    console.log('Initializing GA with tracking ID:', GA_TRACKING_ID);
    initGA(GA_TRACKING_ID);
    // Send an initial pageview
    trackPageView(window.location.pathname + window.location.search);
  }, []);
  return (
    <HelmetProvider>
      <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <AnalyticsTracker />
          <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question/:slug" element={<QuestionDetail />} />
            <Route path="/submit" element={<QuestionForm />} />
            <Route path="/category/:category" element={<CategoryQuestions />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-questions" element={<MyQuestions />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
          {process.env.NODE_ENV !== 'production' && <DebugStorage />}
        </div>
      </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;