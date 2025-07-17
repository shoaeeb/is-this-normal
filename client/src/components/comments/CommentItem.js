import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';
import CommentForm from './CommentForm';
import { CommentContext } from './CommentSection';

const CommentItem = ({ comment, questionId, level = 0 }) => {
  const { _id, text, username, upvotes, downvotes, score, createdAt, children } = comment;
  const [userVote, setUserVote] = useState(null);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [localScore, setLocalScore] = useState(score);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [scoreUpdated, setScoreUpdated] = useState(false);
  
  // Get context for vote updates
  const commentContext = useContext(CommentContext);
  
  // Get or create user identifier
  useEffect(() => {
    let identifier = localStorage.getItem('userIdentifier');
    if (!identifier) {
      identifier = uuidv4();
      localStorage.setItem('userIdentifier', identifier);
    }
    setUserIdentifier(identifier);
  }, []);
  
  // Check if user has voted on this comment
  useEffect(() => {
    const checkVote = async () => {
      if (_id && userIdentifier) {
        try {
          const res = await api.get(`/api/comments/vote/${_id}/${userIdentifier}`);
          if (res.data.hasVoted) {
            setUserVote(res.data.voteType);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkVote();
  }, [_id, userIdentifier]);

  // Format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  // Handle voting
  const handleVote = async (voteType) => {
    if (!userIdentifier) return;

    try {
      const res = await api.post('/api/comments/vote', {
        commentId: _id,
        voteType,
        userIdentifier
      });

      setUserVote(userVote === voteType ? null : voteType);
      setLocalScore(res.data.score);
      setLocalUpvotes(res.data.upvotes);
      setLocalDownvotes(res.data.downvotes);
      
      // Trigger animation
      setScoreUpdated(true);
      setTimeout(() => setScoreUpdated(false), 500);
      
      // Notify parent component about vote update
      if (commentContext && commentContext.onVoteUpdated) {
        commentContext.onVoteUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  // Handle reply submission
  const handleReplySubmitted = () => {
    setShowReplyForm(false);
  };

  return (
    <div className={`comment-item ${level > 0 ? 'comment-reply' : ''}`}>
      {level > 0 && <div className="comment-connector"></div>}
      <div className="comment-vote">
        <button 
          className={`vote-btn upvote ${userVote === 'upvote' ? 'active' : ''}`}
          onClick={() => handleVote('upvote')}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
        <span className={`score ${scoreUpdated ? 'score-updated' : ''}`}>{localScore}</span>
        <button 
          className={`vote-btn downvote ${userVote === 'downvote' ? 'active' : ''}`}
          onClick={() => handleVote('downvote')}
        >
          <i className="fas fa-arrow-down"></i>
        </button>
      </div>
      
      <div className="comment-content">
        <div className="comment-header">
          <span className="username">{username}</span>
          <span className="date">{formatDate(createdAt)}</span>
        </div>
        
        <p className="comment-text">{text}</p>
        
        <div className="comment-actions">
          <button 
            className="reply-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
          <span className="vote-count">{localUpvotes} upvotes, {localDownvotes} downvotes</span>
        </div>
        
        {showReplyForm && (
          <div className="reply-form">
            <div className="replying-to">
              <i className="fas fa-reply"></i> Replying to <strong>{username}</strong>
            </div>
            <CommentForm 
              questionId={questionId}
              parentId={_id}
              onCommentAdded={handleReplySubmitted}
            />
          </div>
        )}
        
        {children && children.length > 0 && (
          <div className="comment-replies">
            <div className="reply-line"></div>
            {children.map(childComment => (
              <CommentItem 
                key={childComment._id} 
                comment={childComment} 
                questionId={questionId}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  questionId: PropTypes.string.isRequired,
  level: PropTypes.number
};

export default CommentItem;