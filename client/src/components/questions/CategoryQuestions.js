import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import QuestionItem from './QuestionItem';
import Pagination from '../layout/Pagination';
import SEOTags from '../layout/SEOTags';

const CategoryQuestions = () => {
  const { category } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/api/questions/category/${category}?page=${currentPage}`);
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
  }, [category, currentPage]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  // Format category name for display
  const formatCategoryName = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Get category description for SEO
  const getCategoryDescription = (cat) => {
    const descriptions = {
      'work': 'Explore questions about work habits, office behavior, and professional relationships.',
      'relationships': 'Discover what others think about relationship dynamics, dating habits, and couple behaviors.',
      'social': 'Find out if your social interactions and behaviors are considered normal by others.',
      'habits': 'Learn whether your personal habits and routines are similar to others.',
      'health': 'Explore questions about health concerns, body changes, and wellness behaviors.',
      'family': 'Discover insights about family dynamics, parenting, and household behaviors.',
      'other': 'Browse miscellaneous questions about behaviors and situations across various aspects of life.'
    };
    return descriptions[cat] || `Explore questions about ${formatCategoryName(cat)} and see what others consider normal.`;
  };

  return (
    <div className="category-questions">
      <SEOTags 
        title={`${formatCategoryName(category)} Questions`}
        description={getCategoryDescription(category)}
        canonicalUrl={window.location.href}
        keywords={['is this normal', category, 'normal behavior', `${category} behavior`, `${category} habits`, 'social validation']}
      />
      <Link to="/" className="btn btn-light">
        Back to All Questions
      </Link>
      
      <h1>{formatCategoryName(category)} Questions</h1>
      
      {loading ? (
        <p className="text-center">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-center">No questions found in this category.</p>
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
              Showing {questions.length} of {totalQuestions} questions in {formatCategoryName(category)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryQuestions;