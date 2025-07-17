require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import Question model
const Question = require('./models/Question');

// Base URL for the sitemap
const BASE_URL = process.env.BASE_URL || 'https://is-this-normal.onrender.com';

async function generateSitemap() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
    
    // Get all approved questions
    console.log('Fetching questions...');
    const questions = await Question.find({ isApproved: true });
    console.log(`Found ${questions.length} questions`);
    
    // Start XML content
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add home page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}</loc>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';
    
    // Add about page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/about</loc>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.5</priority>\n';
    sitemap += '  </url>\n';
    
    // Add submit page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/submit</loc>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';
    
    // Add all question pages
    questions.forEach(question => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${BASE_URL}/question/${question.slug}</loc>\n`;
      
      // Format the last modified date
      const lastMod = question.updatedAt || question.createdAt;
      const formattedDate = lastMod.toISOString().split('T')[0];
      sitemap += `    <lastmod>${formattedDate}</lastmod>\n`;
      
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });
    
    // Add category pages
    const categories = ['work', 'relationships', 'social', 'habits', 'health', 'family', 'other'];
    categories.forEach(category => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${BASE_URL}/category/${category}</loc>\n`;
      sitemap += '    <changefreq>daily</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    });
    
    // Close XML
    sitemap += '</urlset>';
    
    // Write to file
    const filePath = path.join(__dirname, 'client/public/sitemap.xml');
    fs.writeFileSync(filePath, sitemap);
    
    console.log(`Sitemap generated successfully at ${filePath}`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    return true;
  } catch (err) {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  }
}

// Run the function
generateSitemap();