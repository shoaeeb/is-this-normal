# SEO Implementation Guide

This document provides detailed instructions on how the SEO features are implemented in the "Is This Normal?" application.

## SEOTags Component

The `SEOTags` component is the central piece of our SEO strategy, providing consistent meta tags across all pages.

### Usage

```jsx
<SEOTags 
  title="Page Title"
  description="Page description with keywords and call-to-action."
  canonicalUrl={window.location.href}
  keywords={['keyword1', 'keyword2', 'keyword3']}
  ogType="website"
  ogImage="/og-image.jpg"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Title",
    "description": "Page description"
  }}
/>
```

### Parameters

- `title`: The page title (will be appended with site name)
- `description`: Meta description (150-160 characters recommended)
- `canonicalUrl`: Canonical URL to prevent duplicate content
- `keywords`: Array of relevant keywords
- `ogType`: Open Graph type (website, article, etc.)
- `ogImage`: Image for social sharing
- `structuredData`: JSON-LD structured data for rich results

## Structured Data Implementation

### Question Pages

Question pages use the QAPage schema:

```jsx
structuredData={{
  "@context": "https://schema.org",
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": question.text,
    "text": question.text,
    "answerCount": question.totalVotes,
    "dateCreated": question.createdAt,
    "author": { "@type": "Person", "name": "Anonymous" },
    "suggestedAnswer": {
      "@type": "Answer",
      "text": `${question.normalPercentage}% of ${question.totalVotes} people think this is normal.`,
      "dateCreated": question.updatedAt || question.createdAt,
      "upvoteCount": question.normalVotes,
      "url": window.location.href
    }
  }
}}
```

### Homepage

The homepage uses the WebSite schema:

```jsx
structuredData={{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Is This Normal?",
  "url": window.location.href,
  "description": "Anonymous platform to validate your habits, thoughts, and behaviors",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${window.location.origin}/search/{search_term_string}`,
    "query-input": "required name=search_term_string"
  }
}}
```

## Page-Specific SEO

### Homepage

- Title: "Is This Normal? | Anonymous Behavior Validation Platform"
- Description: Focuses on the core purpose of anonymous validation
- Keywords: General terms about validation and anonymity
- Schema: WebSite with SearchAction

### Question Detail Pages

- Title: The question text itself
- Description: Includes the percentage of "normal" votes and a call to action
- Keywords: Category-specific terms and keywords from the question
- Schema: QAPage with Question and suggestedAnswer

### Category Pages

- Title: Category name + "Questions"
- Description: Category-specific description of the types of questions
- Keywords: Category-specific terms
- Dynamic content based on the category

### Search Results

- Title: "Search Results for [query]"
- Description: Includes the search query and a call to action
- Keywords: Search query terms and general validation terms
- No indexing for search results pages (added in robots.txt)

## Social Sharing Optimization

### Open Graph Tags

```html
<meta property="og:title" content="Page Title | Is This Normal?" />
<meta property="og:description" content="Page description" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://is-this-normal.onrender.com/page" />
<meta property="og:image" content="https://is-this-normal.onrender.com/og-image.jpg" />
<meta property="og:site_name" content="Is This Normal?" />
```

### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title | Is This Normal?" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://is-this-normal.onrender.com/og-image.jpg" />
```

## Technical SEO

### Robots.txt

```
# Allow all web crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://is-this-normal.onrender.com/sitemap.xml
```

### Sitemap Generation

The sitemap is dynamically generated and includes:
- Homepage
- All approved questions
- Category pages
- Static pages (About, Submit)

## Performance Optimization

For optimal SEO, the application implements:

1. Server-side rendering for initial page load
2. Lazy loading for images and comments
3. Minified CSS and JavaScript
4. Optimized font loading
5. Responsive design for mobile-friendliness

## Monitoring and Improvement

1. Use Google Search Console to monitor indexing and performance
2. Track keyword rankings for primary and secondary keywords
3. Monitor click-through rates and adjust meta descriptions accordingly
4. Regularly update the sitemap as new content is added