import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { initGA, trackPageView } from './utils/analytics';
import Home from './components/pages/Home';
import QuestionDetail from './components/questions/QuestionDetail';
import QuestionForm from './components/questions/QuestionForm';
import CategoryQuestions from './components/questions/CategoryQuestions';
import SearchResults from './components/questions/SearchResults';
import MyQuestions from './components/questions/MyQuestions';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';

// Google Analytics tracking ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual tracking ID

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
    initGA(GA_TRACKING_ID);
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
        </div>
      </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;