import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const QuestionItem = ({ question }) => {
  const {
    text,
    slug,
    category,
    normalVotes,
    notNormalVotes,
    totalVotes,
    normalPercentage,
    createdAt
  } = question;

  // Format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card question-item">
      <h3>
        <Link to={`/question/${slug}`}>{text}</Link>
      </h3>
      
      <div className="progress-bar">
        <div 
          className="progress progress-normal" 
          style={{ width: `${normalPercentage}%` }}
        ></div>
      </div>
      
      <div className="stats">
        <span className="badge badge-success">
          Normal: {normalVotes} ({normalPercentage}%)
        </span>
        <span className="badge badge-danger">
          Not Normal: {notNormalVotes} ({100 - normalPercentage}%)
        </span>
        <span className="badge badge-primary">
          Total Votes: {totalVotes}
        </span>
      </div>
      
      <div className="meta">
        <span className="badge">{category}</span>
        <span className="date">Posted on {formatDate(createdAt)}</span>
      </div>
      
      <Link to={`/question/${slug}`} className="btn btn-dark btn-sm">
        Vote & Discuss
      </Link>
    </div>
  );
};

QuestionItem.propTypes = {
  question: PropTypes.object.isRequired
};

export default QuestionItem;