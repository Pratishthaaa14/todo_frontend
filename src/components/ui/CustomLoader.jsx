import React from 'react';
import './CustomLoader.css';

const CustomLoader = () => {
  return (
    <div className="loader-container">
      <div className="custom-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default CustomLoader; 