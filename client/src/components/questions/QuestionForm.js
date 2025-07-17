import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    text: '',
    category: 'other'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const { text, category } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (text.trim() === '') {
      setError('Please enter your question');
      return;
    }
    
    // Format question if needed
    let questionText = text;
    if (!questionText.toLowerCase().startsWith('is it normal to')) {
      questionText = `Is it normal to ${questionText}`;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting question:', { text: questionText, category });
      const res = await api.post('/api/questions', {
        text: questionText,
        category
      });
      console.log('Question submission response:', res.data);
      
      // Save question ID to localStorage
      const myQuestions = JSON.parse(localStorage.getItem('myQuestions') || '[]');
      const questionId = res.data._id;
      console.log('Saving question ID to localStorage:', questionId);
      
      // Only add if not already in the array
      if (!myQuestions.includes(questionId)) {
        myQuestions.push(questionId);
        localStorage.setItem('myQuestions', JSON.stringify(myQuestions));
        console.log('Updated myQuestions in localStorage:', myQuestions);
      }
      
      setSuccess('Your question has been published and is now live!');
      setFormData({ text: '', category: 'other' });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Question submission error:', err);
      if (err.response && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError(`Error: ${err.message || 'Something went wrong. Please try again.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-form-container">
      <h1>Ask a Question</h1>
      <p className="lead">
        Submit your question anonymously and find out if others think it's normal.
      </p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Your Question</label>
          <textarea
            name="text"
            id="text"
            placeholder="Is it normal to..."
            value={text}
            onChange={onChange}
            rows="4"
          ></textarea>
          <small className="form-text">
            Start with "Is it normal to..." or we'll add it for you.
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select name="category" id="category" value={category} onChange={onChange}>
            <option value="work">Work</option>
            <option value="relationships">Relationships</option>
            <option value="social">Social</option>
            <option value="habits">Habits</option>
            <option value="health">Health</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
      
      <div className="submission-note">
        <p>
          <strong>Note:</strong> Your question will be immediately visible on the site.
          We don't collect any personal information.
        </p>
      </div>
    </div>
  );
};

export default QuestionForm;