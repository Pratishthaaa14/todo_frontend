import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      <div className="loading-text">{text}</div>
    </div>
  );
};

export default LoadingSpinner; 