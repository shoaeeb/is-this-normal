import React from 'react';
import { Link } from 'react-router-dom';

const SearchExample = () => {
  const examples = [
    {
      question: "Is it normal to feel anxious when someone is watching you work?",
      searchTerms: ["anxious work", "watching", "feel anxious"]
    },
    {
      question: "Is it normal to rehearse conversations in your head?",
      searchTerms: ["rehearse", "conversations head", "rehearse head"]
    },
    {
      question: "Is it normal to avoid making phone calls?",
      searchTerms: ["avoid phone", "calls", "phone anxiety"]
    }
  ];

  // Randomly select one example
  const randomExample = examples[Math.floor(Math.random() * examples.length)];

  return (
    <div className="search-example">
      <h3>How to Search</h3>
      <div className="example-card">
        <p><strong>Example Question:</strong> "{randomExample.question}"</p>
        <p><strong>You could find this by searching:</strong></p>
        <div className="search-terms">
          {randomExample.searchTerms.map((term, index) => (
            <Link key={index} to={`/search/${term}`} className="search-term-example">
              {term}
            </Link>
          ))}
        </div>
        <p className="search-tip-small">
          <i className="fas fa-info-circle"></i> You don't need to type the exact question. 
          Just use keywords related to what you're looking for.
        </p>
      </div>
    </div>
  );
};

export default SearchExample;