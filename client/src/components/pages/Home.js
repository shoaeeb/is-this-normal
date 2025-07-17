import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import QuestionItem from '../questions/QuestionItem';
import CategoryFilter from '../questions/CategoryFilter';
import SearchExample from '../search/SearchExample';
import Pagination from '../layout/Pagination';
import SEOTags from '../layout/SEOTags';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = selectedCategory === 'all'
          ? await api.get(`/api/questions?page=${currentPage}`)
          : await api.get(`/api/questions/category/${selectedCategory}?page=${currentPage}`);
        
        setQuestions(res.data.questions);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setTotalQuestions(res.data.totalQuestions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  return (
    <div className="home-page">
      <SEOTags 
        title="Home" 
        description="Ask and answer questions about what behaviors and situations are normal. Get anonymous validation from the community without judgment."
        keywords={['anonymous questions', 'normal behavior', 'community feedback', 'social validation', 'anonymous advice']}
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
      />
      <div className="intro-section">
        <h1 className="text-center">Is This Normal?</h1>
        <p className="lead text-center">
          Ever wondered if your habits, thoughts, or behaviors are normal? 
          Find out what others think or ask your own question anonymously.
        </p>
        <SearchExample />
      </div>

      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      <div className="question-list">
        {loading ? (
          <p className="text-center">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-center">No questions found in this category.</p>
        ) : (
          <>
            <div className="questions-container">
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
                Showing {questions.length} of {totalQuestions} questions
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;