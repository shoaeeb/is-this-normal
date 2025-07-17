import React from 'react';
import { Link } from 'react-router-dom';
import SEOTags from '../layout/SEOTags';

const About = () => {
  return (
    <div className="about-page">
      <SEOTags 
        title="About Is This Normal?"
        description="Learn about the Is This Normal? platform where you can anonymously validate your habits, thoughts, and behaviors through community feedback."
        keywords={['about is this normal', 'anonymous validation', 'community feedback', 'behavior validation', 'anonymous platform', 'social validation']}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Is This Normal?",
          "description": "A platform for anonymous validation of behaviors and situations"
        }}
      />
      <h1>About "Is This Normal?"</h1>
      <p className="my-1">
        "Is This Normal?" is a platform where people can anonymously ask if their habits, 
        thoughts, or behaviors are normal and get validation from the community.
      </p>
      <p className="my-1">
        We all have moments where we wonder if we're the only ones who do certain things 
        or think certain thoughts. This platform helps you find out that you're not alone.
      </p>
      <p className="my-1">
        <strong>How it works:</strong>
      </p>
      <ul>
        <li>Browse questions others have asked</li>
        <li>Vote whether you think behaviors are "Normal" or "Not Normal"</li>
        <li>Submit your own questions anonymously</li>
        <li>Get validation from thousands of others</li>
      </ul>
      <p className="my-1">
        <Link to="/submit" className="btn btn-primary">
          Ask Your Question
        </Link>
      </p>
      <p className="bg-dark p">
        <strong>Version: </strong> 1.0.0
      </p>
    </div>
  );
};

export default About;