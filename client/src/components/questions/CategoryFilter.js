import React from 'react';
import PropTypes from 'prop-types';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'work', name: 'Work' },
    { id: 'relationships', name: 'Relationships' },
    { id: 'social', name: 'Social' },
    { id: 'habits', name: 'Habits' },
    { id: 'health', name: 'Health' },
    { id: 'family', name: 'Family' },
    { id: 'other', name: 'Other' }
  ];

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category.id}
            className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-light'}`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default CategoryFilter;