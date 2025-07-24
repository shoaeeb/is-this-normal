const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security headers but allow inline scripts for Google Analytics
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      "img-src": ["'self'", "data:", "https://www.google-analytics.com"]
    }
  }
}));



// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Define routes
app.use('/api/questions', require('./routes/questions'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/comments', require('./routes/comments'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});



// Dynamic sitemap endpoint with caching
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { getSitemapFromCache } = require('./server/utils/sitemapCache');
    const baseUrl = process.env.BASE_URL || 'https://is-this-normal.onrender.com';
    
    const sitemapXml = await getSitemapFromCache(baseUrl);
    
    // Set appropriate headers
    res.header('Content-Type', 'application/xml');
    res.header('Content-Length', Buffer.byteLength(sitemapXml));
    
    // Send the sitemap XML
    res.send(sitemapXml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// Debug endpoint to get all questions (development only)
app.get('/api/debug/questions', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ msg: 'Not available in production' });
  }
  
  try {
    const Question = require('./models/Question');
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ questions });
  } catch (err) {
    console.error('Debug questions error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin endpoint to force refresh the sitemap cache
app.get('/api/admin/generate-sitemap', async (req, res) => {
  try {
    const { refreshSitemapCache } = require('./server/utils/sitemapCache');
    const baseUrl = process.env.BASE_URL || 'https://is-this-normal.onrender.com';
    
    const success = await refreshSitemapCache(baseUrl);
    
    if (success) {
      res.status(200).json({ 
        success: true, 
        message: 'Sitemap cache refreshed successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to refresh sitemap cache' 
      });
    }
  } catch (err) {
    console.error('Sitemap refresh error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/is-this-normal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep-alive function to prevent Render from spinning down
if (process.env.NODE_ENV === 'production') {
  const keepAliveInterval = 14 * 60 * 1000; // 14 minutes (Render free tier spins down after 15 minutes of inactivity)
  
  // Initialize sitemap cache on startup
  const { refreshSitemapCache } = require('./server/utils/sitemapCache');
  const baseUrl = process.env.BASE_URL || 'https://is-this-normal.onrender.com';
  refreshSitemapCache(baseUrl)
    .then(() => console.log('Initial sitemap cache created'))
    .catch(err => console.error('Error creating initial sitemap cache:', err));
  
  // Schedule sitemap refresh every 5 hours
  const sitemapRefreshInterval = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
  setInterval(() => {
    console.log('Scheduled sitemap refresh triggered');
    refreshSitemapCache(baseUrl)
      .then(success => console.log('Scheduled sitemap refresh completed:', success ? 'success' : 'failed'))
      .catch(err => console.error('Error in scheduled sitemap refresh:', err));
  }, sitemapRefreshInterval);
  
  // Function to ping our own server
  const keepAlive = () => {
    console.log('Keep-alive ping sent');
    // For a self-ping, we can use the server's own hostname
    const http = require('http');
    const url = new URL(`http://localhost:${PORT}/api/health`);
    
    const req = http.get(url, (res) => {
      console.log(`Keep-alive response: ${res.statusCode}`);
    });
    
    req.on('error', (err) => {
      console.error('Keep-alive error:', err);
    });
    
    req.end();

  };
  
  // Start the keep-alive interval
  setInterval(keepAlive, keepAliveInterval);
  console.log(`Keep-alive service started, pinging every ${keepAliveInterval / 60000} minutes`);
}