import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import QuestionItem from './QuestionItem';
import Pagination from '../layout/Pagination';
import { trackEvent } from '../../utils/analytics';
import SEO from '../layout/SEO';

const SearchResults = () => {
  const { query } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/api/questions/search/${query}?page=${currentPage}`);
        setQuestions(res.data.questions || []);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 0);
        setTotalQuestions(res.data.totalQuestions || 0);
        setLoading(false);
        
        // Track search query and results count
        trackEvent('Search', 'Query', query, res.data.totalQuestions || 0);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  return (
    <div className="search-results">
      <SEO 
        title={`Search Results for "${query}"`}
        description={`Search results for "${query}" - Find out if your behaviors and situations are normal.`}
        canonicalUrl={window.location.href}
      />
      <Link to="/" className="btn btn-light">
        Back to All Questions
      </Link>
      
      <h1>Search Results for "{query}"</h1>
      <p className="search-tip">
        <i className="fas fa-lightbulb"></i> Tip: Search for keywords like "phone calls" or "work" to find related questions
      </p>
      
      {loading ? (
        <p className="text-center">Searching...</p>
      ) : questions.length === 0 ? (
        <div className="no-results">
          <p className="text-center">No questions found matching your search.</p>
          <p className="text-center">Try using fewer or different keywords.</p>
          <div className="text-center">
            <Link to="/submit" className="btn btn-primary">
              Ask "Is it normal to {query}?"
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="question-list">
            {questions.map(question => (
              <QuestionItem key={question._id} question={question} />
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          {totalQuestions > 0 && (
            <div className="results-count">
              Found {totalQuestions} questions matching "{query}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;