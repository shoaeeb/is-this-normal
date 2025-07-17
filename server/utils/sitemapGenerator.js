const fs = require('fs');
const path = require('path');
const Question = require('../../models/Question');

/**
 * Generate a sitemap XML file with all question URLs
 * @param {string} baseUrl - The base URL of the website
 */
const generateSitemap = async (baseUrl) => {
  try {
    // Get all approved questions
    const questions = await Question.find({ isApproved: true });
    
    // Start XML content
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add home page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}</loc>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';
    
    // Add about page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/about</loc>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.5</priority>\n';
    sitemap += '  </url>\n';
    
    // Add submit page
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/submit</loc>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';
    
    // Add all question pages
    questions.forEach(question => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/question/${question.slug}</loc>\n`;
      
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
      sitemap += `    <loc>${baseUrl}/category/${category}</loc>\n`;
      sitemap += '    <changefreq>daily</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    });
    
    // Close XML
    sitemap += '</urlset>';
    
    // Write to file
    const filePath = path.join(__dirname, '../../client/public/sitemap.xml');
    fs.writeFileSync(filePath, sitemap);
    
    console.log('Sitemap generated successfully');
    return true;
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return false;
  }
};

module.exports = generateSitemap;