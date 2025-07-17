import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  // Calculate range of pages to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="pagination">
      <button 
        className="pagination-btn prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i> Previous
      </button>
      
      <div className="page-numbers">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis">...</span>
          ) : (
            <button
              key={page}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      <button 
        className="pagination-btn next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;