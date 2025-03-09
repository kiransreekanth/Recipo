import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [username, setUsername] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    // Check login status when component mounts
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!userStr);
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUsername(userData.username || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      setIsLoggedIn(!!userStr);
      
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUsername(userData.username || '');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setUsername('');
      }
    };

    // Get search term from URL if present to sync form with current search
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get('query');
    if (query) {
      setSearchInput(query);
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    window.dispatchEvent(new Event('storage')); // Force update in all components
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Navigate to home page with search query
      navigate(`/?query=${encodeURIComponent(searchInput.trim())}`);
    } else {
      // If search is cleared, navigate to home page without query
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link className="navbar-brand" to="/">Recipo</Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">Support</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/saved-recipes">Saved Recipes</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <span className="nav-link user-greeting">Welcome, {username}</span>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link logout-btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login/Register</Link>
              </li>
            )}
          </ul>

          <form className="d-flex" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Recipe"
              aria-label="Search Recipe"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;