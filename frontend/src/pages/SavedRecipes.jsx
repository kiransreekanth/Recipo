import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './savedrecipes.css';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const userString = localStorage.getItem('user');
        console.log("User from localStorage:", userString); // Debug line
        
        // If not logged in, show error
        if (!userString) {
          setError('You must be logged in to view saved recipes');
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userString);
        console.log("Parsed user:", user); // Debug line
        
        // Make sure token exists
        if (!user.token) {
          setError('You must be logged in to view saved recipes');
          setLoading(false);
          return;
        }

        console.log("Authorization header:", `Bearer ${user.token}`); // Debug line
        
        const response = await axios.get('http://localhost:5000/saved-recipes', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        console.log("Saved recipes response:", response.data); // Debug line
        setSavedRecipes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
        
        // Check if this is an auth error
        if (err.response && err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to fetch saved recipes. Please try again later.');
        }
        
        setLoading(false);
      }
    };

    fetchSavedRecipes();

    // Listen for login/logout events
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        setError('You must be logged in to view saved recipes');
        setSavedRecipes([]);
      } else {
        // Refetch data when user logs in
        setLoading(true);
        setError(null);
        fetchSavedRecipes();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRemoveSaved = async (recipeId) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        setError('You must be logged in to remove saved recipes');
        return;
      }
      
      const user = JSON.parse(userString);
      if (!user.token) {
        setError('You must be logged in to remove saved recipes');
        return;
      }
      
      await axios.delete(`http://localhost:5000/remove-saved-recipe/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Remove the recipe from state
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      console.error('Error removing saved recipe:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        alert('Failed to remove recipe from saved list');
      }
    }
  };

  // Function to truncate text for card preview
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  if (loading) {
    return (
      <div className="saved-recipes-container">
        <div className="about">
          <h1>"Connecting chefs and food lovers through shared recipes."</h1>
        </div>
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-recipes-container">
        <div className="about">
          <h1>"Connecting chefs and food lovers through shared recipes."</h1>
        </div>
        <div className="error-container">
          <h3>{error}</h3>
          {error.includes('logged in') || error.includes('session has expired') ? (
            <Link to="/login" className="login-btn">Go to Login</Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="saved-recipes-container">
        <div className="about">
          <h1>"Connecting chefs and food lovers through shared recipes."</h1>
        </div>
        <div className="saved-section empty-state">
          <h2>No Saved Recipes</h2>
          <p>You haven't saved any recipes yet.</p>
          <Link to="/" className="explore-btn">Explore Recipes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-recipes-container">
      <div className="about">
        <h1>"Connecting chefs and food lovers through shared recipes."</h1>
      </div>
      
      <div className="saved-section">
        <h1>My Saved Recipes</h1>
        
        <div className="card-container">
          {savedRecipes.map((recipe) => (
            <div className="card" key={recipe._id} onClick={() => window.location.href = `/recipe/${recipe._id}`}>
              <div className="card-content">
                <h2 className="card-title">{recipe.title}</h2>
                
                {recipe.image && (
                  <div className="card-image">
                    <img src={recipe.image} alt={recipe.title} />
                  </div>
                )}
                
                <div className="card-details">
                  <h3>Ingredients:</h3>
                  <p>{truncateText(recipe.ingredients, 60)}</p>
                  
                  <h3>Instructions:</h3>
                  <p>{truncateText(recipe.instructions, 80)}</p>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSaved(recipe._id);
                    }}
                    aria-label="Remove recipe"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipes;