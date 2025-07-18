import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import SEOTags from '../layout/SEOTags';

const Sitemap = () => {
  const [categories, setCategories] = useState(['work', 'relationships', 'social', 'habits', 'health', 'family', 'other']);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Get the most recent questions for the sitemap
        const res = await api.get('/api/questions?limit=50');
        setQuestions(res.data.questions || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions for sitemap:', err);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="sitemap-page">
      <SEOTags 
        title="Sitemap"
        description="Browse all pages on Is This Normal? - Find questions about behaviors and situations across different categories."
        keywords={['sitemap', 'is this normal', 'all questions', 'categories', 'browse questions']}
      />
      <h1>Sitemap</h1>
      <p className="lead">
        Browse all pages on Is This Normal?
      </p>

      <div className="sitemap-section">
        <h2>Main Pages</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/submit">Submit a Question</Link></li>
          <li><Link to="/my-questions">My Questions</Link></li>
        </ul>
      </div>

      <div className="sitemap-section">
        <h2>Categories</h2>
        <ul>
          {categories.map(category => (
            <li key={category}>
              <Link to={`/category/${category}`}>{category.charAt(0).toUpperCase() + category.slice(1)} Questions</Link>
            </li>
          ))}
        </ul>
      </div>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <div className="sitemap-section">
          <h2>Recent Questions</h2>
          <ul>
            {questions.map(question => (
              <li key={question._id}>
                <Link to={`/question/${question.slug}`}>{question.text}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sitemap;