// NotLoggedInFooter.js
import React from 'react';
import './NotLoggedInFooter.css';
import { useNavigate } from 'react-router-dom';

const NotLoggedInFooter = () => {
    const navigate = useNavigate() ; 
    const handleClick = () => {
        navigate('/signup') ; 
    }
  return (
    <div className="not-logged-in-footer">
      <div className="footer-content">
        <div className="footer-text">
          <h4>Preview of Spotify</h4>
          <p>Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</p>
        </div>
        <button className="sign-up-button" onClick={handleClick}>Sign up for free</button>
      </div>
    </div>
  );
};

export default NotLoggedInFooter;
