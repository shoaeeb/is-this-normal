import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DebugStorage = () => {
  const [myQuestions, setMyQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('myQuestions') || '[]');
    setMyQuestions(storedQuestions);
  }, [visible]); // Refresh when visibility changes

  const clearStorage = () => {
    localStorage.removeItem('myQuestions');
    setMyQuestions([]);
    alert('localStorage cleared');
  };
  
  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/debug/questions');
      setAllQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Error fetching all questions:', err);
      alert('Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) {
    return (
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
        <button 
          onClick={() => setVisible(true)}
          style={{ 
            background: '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ?
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'white', 
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        maxWidth: '300px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h4 style={{ margin: 0 }}>Debug Storage</h4>
        <button 
          onClick={() => setVisible(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>
      
      <div>
        <h5>My Questions IDs:</h5>
        {myQuestions.length === 0 ? (
          <p>No questions stored</p>
        ) : (
          <ul style={{ maxHeight: '150px', overflow: 'auto', padding: '0 0 0 20px' }}>
            {myQuestions.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        )}
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={clearStorage}
            style={{ 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              padding: '5px 10px',
              cursor: 'pointer'
            }}
          >
            Clear Storage
          </button>
          <button 
            onClick={fetchAllQuestions}
            disabled={loading}
            style={{ 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              padding: '5px 10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Loading...' : 'View All Questions'}
          </button>
        </div>
        
        {allQuestions.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h5>All Questions in Database:</h5>
            <ul style={{ maxHeight: '200px', overflow: 'auto', padding: '0 0 0 20px' }}>
              {allQuestions.map((q) => (
                <li key={q._id}>
                  <strong>{q._id}</strong>: {q.text.substring(0, 50)}...
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugStorage;