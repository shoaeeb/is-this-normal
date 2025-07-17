# Sitemap Generation Guide

This guide explains how the dynamic sitemap generation works for the "Is This Normal?" application.

## Dynamic Sitemap Generation

The sitemap.xml is generated dynamically and served directly from the server:

1. When a request is made to `/sitemap.xml`, the server generates the sitemap on-demand
2. The sitemap is cached in memory for 5 hours to improve performance
3. After 5 hours, the cache expires and a new sitemap is generated on the next request
4. The sitemap is also automatically refreshed every 5 hours by a scheduled task

## Configuration

Ensure your `.env` file has the correct `BASE_URL` variable:
```
BASE_URL=https://your-app-url.onrender.com
```

This URL will be used as the base for all URLs in the sitemap.

## Deploying to Render

When deploying to Render, the dynamic sitemap will work out of the box:

1. Push your code to GitHub
2. Connect your repository to Render
3. Set up the environment variables in Render:
   - `MONGO_URI`: Your MongoDB connection string
   - `BASE_URL`: Your Render app URL (e.g., https://is-this-normal.onrender.com)
4. Deploy your application
5. The sitemap will be available at `https://your-app-url.onrender.com/sitemap.xml`

## Manually Refreshing the Sitemap

If you need to update the sitemap immediately (e.g., when new questions are added):

1. Access the API endpoint at `/api/admin/generate-sitemap`
2. This will force a refresh of the sitemap cache

## How It Works with Render's Free Tier

This approach is compatible with Render's free tier because:

1. The sitemap is generated in memory, not written to the filesystem
2. The cache is stored in the application's memory, not on disk
3. The automatic refresh happens every 5 hours via a scheduled task
4. The keep-alive function prevents the server from spinning down

## Verifying the Sitemap

To verify that your sitemap is working correctly:

1. Visit `https://your-app-url.onrender.com/sitemap.xml` in your browser
2. You should see an XML file with URLs for your site
3. Submit your sitemap to Google Search Console for indexing