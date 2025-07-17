import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  
  // Encode for sharing
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  
  // Social media share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`;
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="share-buttons">
      <h4>Share this question:</h4>
      <div className="social-buttons">
        <a 
          href={twitterUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn twitter"
          aria-label="Share on Twitter"
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a 
          href={facebookUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn facebook"
          aria-label="Share on Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn whatsapp"
          aria-label="Share on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <button 
          onClick={copyToClipboard} 
          className="share-btn copy"
          aria-label="Copy link"
        >
          <i className={copied ? "fas fa-check" : "fas fa-link"}></i>
        </button>
      </div>
      {copied && <div className="copy-message">Link copied to clipboard!</div>}
    </div>
  );
};

ShareButtons.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default ShareButtons;