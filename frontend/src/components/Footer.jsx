import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/support">Support</Link>
        <Link to="/saved-recipes">Saved Recipes</Link>
        <Link to="/login">Login/Register</Link>
      </nav>
      <hr className="footer-line" />
      <p className="footer-text">© 2025 Recipo. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;