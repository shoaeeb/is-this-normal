import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

// Create context for comment updates
export const CommentContext = createContext();

const CommentSection = ({ questionId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('top');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/comments/${questionId}?sort=${sortMethod}`);
        setComments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchComments();
  }, [questionId, sortMethod, refreshTrigger]);

  const handleCommentAdded = () => {
    // Trigger a refresh by incrementing the refreshTrigger
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleVoteUpdated = () => {
    // Trigger a refresh when votes change
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="comment-section">
      <h2>Discussion</h2>
      
      <div className="comment-sort">
        <span>Sort by: </span>
        <button 
          className={`sort-btn ${sortMethod === 'top' ? 'active' : ''}`}
          onClick={() => setSortMethod('top')}
        >
          Top
        </button>
        <button 
          className={`sort-btn ${sortMethod === 'new' ? 'active' : ''}`}
          onClick={() => setSortMethod('new')}
        >
          New
        </button>
        <button 
          className={`sort-btn ${sortMethod === 'old' ? 'active' : ''}`}
          onClick={() => setSortMethod('old')}
        >
          Old
        </button>
      </div>
      
      <CommentForm 
        questionId={questionId} 
        onCommentAdded={handleCommentAdded} 
      />
      
      <div className="comments-list">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <CommentContext.Provider value={{ onVoteUpdated: handleVoteUpdated }}>
            {comments.map(comment => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                questionId={questionId}
              />
            ))}
          </CommentContext.Provider>
        )}
      </div>
    </div>
  );
};

CommentSection.propTypes = {
  questionId: PropTypes.string.isRequired
};

export default CommentSection;