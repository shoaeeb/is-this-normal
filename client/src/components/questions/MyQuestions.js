import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import QuestionItem from './QuestionItem';

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get recently submitted questions from localStorage
    const myQuestionIds = JSON.parse(localStorage.getItem('myQuestions') || '[]');
    
    const fetchMyQuestions = async () => {
      if (myQuestionIds.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        // Get all questions and filter locally
        const res = await api.get('/api/questions');
        const allQuestions = res.data;
        
        // Filter questions that match the IDs in localStorage
        const myQuestions = allQuestions.filter(q => 
          myQuestionIds.includes(q._id)
        );
        
        setQuestions(myQuestions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, []);

  return (
    <div className="my-questions">
      <Link to="/" className="btn btn-light">
        Back to All Questions
      </Link>
      
      <h1>My Questions</h1>
      <p className="lead">
        Questions you've submitted from this device
      </p>
      
      {loading ? (
        <p className="text-center">Loading your questions...</p>
      ) : questions.length === 0 ? (
        <div className="no-questions">
          <p>You haven't submitted any questions yet.</p>
          <Link to="/submit" className="btn btn-primary">
            Ask a Question
          </Link>
        </div>
      ) : (
        <div className="question-list">
          {questions.map(question => (
            <QuestionItem key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuestions;