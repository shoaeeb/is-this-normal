import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const onSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar ${darkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container">
        <h1>
          <Link to="/">
            <i className="fas fa-question-circle"></i> Is This Normal?
          </Link>
        </h1>
        <form onSubmit={onSubmit} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Search by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </form>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/submit">Ask a Question</Link>
          </li>
          <li>
            <Link to="/my-questions">My Questions</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/sitemap">Sitemap</Link>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;