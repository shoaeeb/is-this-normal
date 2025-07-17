import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';
import CommentSection from '../comments/CommentSection';
import ShareButtons from '../layout/ShareButtons';
import SEO from '../layout/SEO';
import { trackEvent } from '../../utils/analytics';

const QuestionDetail = () => {
  const { slug } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [userIdentifier, setUserIdentifier] = useState('');
  
  // Get or create user identifier
  useEffect(() => {
    let identifier = localStorage.getItem('userIdentifier');
    if (!identifier) {
      identifier = uuidv4();
      localStorage.setItem('userIdentifier', identifier);
    }
    setUserIdentifier(identifier);
  }, []);

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/api/questions/${slug}`);
        setQuestion(res.data);
        setLoading(false);
        
        // Track question view
        trackEvent('Question', 'View', res.data.text);
      } catch (err) {
        setError('Question not found');
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [slug]);

  // Check if user has voted
  useEffect(() => {
    const checkVote = async () => {
      if (question && userIdentifier) {
        try {
          const res = await api.get(`/api/votes/check/${question._id}/${userIdentifier}`);
          if (res.data.hasVoted) {
            setUserVote(res.data.voteType);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkVote();
  }, [question, userIdentifier]);

  // Handle vote
  const handleVote = async (voteType) => {
    if (!userIdentifier) return;

    try {
      const res = await api.post('/api/votes', {
        questionId: question._id,
        voteType,
        userIdentifier
      });

      setQuestion(res.data);
      setUserVote(voteType);
      
      // Track vote event
      trackEvent('Question', 'Vote', question.text, voteType === 'normal' ? 1 : 0);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading question...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="question-detail">
      <SEO 
        title={question.text}
        description={`${question.normalPercentage}% of people think this is normal. Join the discussion and vote!`}
        canonicalUrl={window.location.href}
        ogType="article"
      />
      <Link to="/" className="btn btn-light">
        Back to Questions
      </Link>
      
      <div className="card">
        <h1>{question.text}</h1>
        
        <div className="progress-bar">
          <div 
            className="progress progress-normal" 
            style={{ width: `${question.normalPercentage}%` }}
          ></div>
        </div>
        
        <div className="stats">
          <div className="result-numbers">
            <span className="badge badge-success">
              Normal: {question.normalVotes} ({question.normalPercentage}%)
            </span>
            <span className="badge badge-danger">
              Not Normal: {question.notNormalVotes} ({100 - question.normalPercentage}%)
            </span>
            <span className="badge badge-primary">
              Total Votes: {question.totalVotes}
            </span>
          </div>
          
          <div className="category">
            <span className="badge">
              Category: {question.category}
            </span>
          </div>
        </div>
        
        <div className="vote-section">
          <h3>What do you think?</h3>
          
          <div className="vote-buttons">
            <button 
              className={`btn ${userVote === 'normal' ? 'btn-disabled' : 'btn-normal'}`}
              onClick={() => handleVote('normal')}
              disabled={userVote === 'normal'}
            >
              {userVote === 'normal' ? 'You voted Normal' : 'Vote Normal'}
            </button>
            
            <button 
              className={`btn ${userVote === 'notNormal' ? 'btn-disabled' : 'btn-not-normal'}`}
              onClick={() => handleVote('notNormal')}
              disabled={userVote === 'notNormal'}
            >
              {userVote === 'notNormal' ? 'You voted Not Normal' : 'Vote Not Normal'}
            </button>
          </div>
          
          {userVote && (
            <p className="vote-message">
              Your vote has been recorded. Thanks for participating!
            </p>
          )}
        </div>
        
        {/* Share Buttons */}
        <ShareButtons 
          title={question.text}
          url={window.location.href}
        />
      </div>
      
      {/* Add Comment Section */}
      {question && <CommentSection questionId={question._id} />}
    </div>
  );
};

export default QuestionDetail;