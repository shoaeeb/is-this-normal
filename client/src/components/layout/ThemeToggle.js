import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </button>
  );
};

export default ThemeToggle;