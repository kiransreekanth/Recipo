import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vegetarianRecipes, setVegetarianRecipes] = useState([]);
  const [nonVegRecipes, setNonVegRecipes] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Get current user ID helper function
  const getCurrentUserId = useCallback(() => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      const user = JSON.parse(userString);
      return user.userId || null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  }, []);

  // Fetch saved recipes function
  const fetchSavedRecipes = useCallback(async () => {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    
    try {
      const user = JSON.parse(userString);
      if (!user.token) return;
      
      const response = await fetch('http://localhost:5000/saved-recipes', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('user');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        const savedIds = data.map(recipe => recipe._id);
        setSavedRecipes(savedIds);
      }
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
    }
  }, []);
  
  // Search function
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    const searchString = query.toLowerCase();
    const allRecipes = [...vegetarianRecipes, ...nonVegRecipes];
    
    const results = allRecipes.filter(recipe => 
      (recipe.title && recipe.title.toLowerCase().includes(searchString)) || 
      (recipe.ingredients && recipe.ingredients.toLowerCase().includes(searchString)) ||
      (recipe.instructions && recipe.instructions.toLowerCase().includes(searchString)) ||
      (recipe.category && recipe.category.toLowerCase().includes(searchString))
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  }, [vegetarianRecipes, nonVegRecipes]); // Removed searchTerm from dependencies
  
  // Fetch recipes function
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/recipes');
      if (!res.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await res.json();
      
      // Update all recipe states in one batch
      setVegetarianRecipes(data.filter((recipe) => recipe.category === 'vegetarian'));
      setNonVegRecipes(data.filter((recipe) => recipe.category === 'non-vegetarian'));
      setSuggestedRecipes(data.slice(0, 3));
      
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies as this should only run on mount or manual calls
  
  // Effect for URL search parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    
    if (query) {
      setSearchTerm(query);
      // performSearch will be called by the searchTerm effect
    } else {
      setSearchTerm('');
      setShowSearchResults(false);
    }
  }, [location.search]); // Only depend on location.search
  
  // Effect to perform search when searchTerm changes
  useEffect(() => {
    if (searchTerm && (vegetarianRecipes.length > 0 || nonVegRecipes.length > 0)) {
      performSearch(searchTerm);
    }
  }, [searchTerm, performSearch, vegetarianRecipes, nonVegRecipes]);
  
  // Effect to fetch recipes and saved recipes on mount
  useEffect(() => {
    fetchRecipes();
    fetchSavedRecipes();
  }, [fetchRecipes, fetchSavedRecipes]); // Added missing dependencies

  // Navigation functions wrapped in useCallback
  const handleAddRecipe = useCallback(() => {
    navigate('/add-recipe');
  }, [navigate]);

  const handleRecipeClick = useCallback((recipeId) => {
    navigate(`/recipe/${recipeId}`);
  }, [navigate]);

  // Save/unsave recipe function
  const handleSaveRecipe = useCallback(async (e, recipeId) => {
    e.stopPropagation();
    
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      alert('You must be logged in to save recipes');
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userString);
      if (!user.token) {
        alert('You must be logged in to save recipes');
        navigate('/login');
        return;
      }
      
      const isAlreadySaved = savedRecipes.includes(recipeId);
      const endpoint = isAlreadySaved 
        ? `http://localhost:5000/remove-saved-recipe/${recipeId}`
        : `http://localhost:5000/save-recipe/${recipeId}`;
      
      const method = isAlreadySaved ? 'DELETE' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save/unsave recipe');
      }
      
      // Update the savedRecipes state
      if (isAlreadySaved) {
        setSavedRecipes(prev => prev.filter(id => id !== recipeId));
        alert('Recipe removed from saved list');
      } else {
        setSavedRecipes(prev => [...prev, recipeId]);
        alert('Recipe saved successfully');
      }
      
    } catch (error) {
      console.error('Error saving/unsaving recipe:', error);
      alert(error.message);
    }
  }, [navigate, savedRecipes]);

  // Delete recipe function
  const handleDeleteRecipe = useCallback(async (e, recipeId) => {
    e.stopPropagation();
    
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      alert('You must be logged in to delete recipes');
      navigate('/login');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const user = JSON.parse(userString);
        if (!user.token) {
          alert('You must be logged in to delete recipes');
          navigate('/login');
          return;
        }
        
        const response = await fetch(`http://localhost:5000/recipes/${recipeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.status === 401) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        
        if (response.status === 403) {
          alert('You do not have permission to delete this recipe.');
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete recipe');
        }
        
        // Batch all state updates together to prevent multiple re-renders
        setVegetarianRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
        setNonVegRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
        setSuggestedRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
        setSearchResults(prev => prev.filter(recipe => recipe._id !== recipeId));
        setSavedRecipes(prev => prev.filter(id => id !== recipeId));
        
        alert('Recipe deleted successfully');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert(error.message);
      }
    }
  }, [navigate]);

  // Helper functions
  const truncateText = useCallback((text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  }, []);

  const isRecipeSaved = useCallback((recipeId) => {
    return savedRecipes.includes(recipeId);
  }, [savedRecipes]);

  const highlightSearchTerm = useCallback((text, term) => {
    if (!term || !text) return text;
    
    const searchLower = term.toLowerCase();
    const textLower = text.toLowerCase();
    
    if (!textLower.includes(searchLower)) return text;
    
    const index = textLower.indexOf(searchLower);
    const beforeMatch = text.substring(0, index);
    const match = text.substring(index, index + term.length);
    const afterMatch = text.substring(index + term.length);
    
    return (
      <>
        {beforeMatch}
        <span className="highlight">{match}</span>
        {afterMatch}
      </>
    );
  }, []);

  // Recipe card rendering - memoized to prevent unnecessary re-renders
  const renderRecipeCard = useCallback((recipe, highlight = false) => {
    const saved = isRecipeSaved(recipe._id);
    const currentUserId = getCurrentUserId();
    const isOwner = currentUserId && recipe.user && recipe.user === currentUserId;
    
    const cardClassName = highlight && searchTerm ? "card highlighted" : "card";
    
    return (
      <div 
        className={cardClassName} 
        key={recipe._id} 
        onClick={() => handleRecipeClick(recipe._id)}
      >
        <div className="card-content">
          <h2 className="card-title">
            {highlight && searchTerm ? highlightSearchTerm(recipe.title, searchTerm) : recipe.title}
          </h2>
          
          {recipe.image && (
            <div className="card-image">
              <img src={recipe.image} alt={recipe.title} />
            </div>
          )}
          
          <div className="card-details">
            <h3>Ingredients:</h3>
            <p>
              {highlight && searchTerm 
                ? highlightSearchTerm(truncateText(recipe.ingredients, 60), searchTerm) 
                : truncateText(recipe.ingredients, 60)}
            </p>
            
            <h3>Instructions:</h3>
            <p>
              {highlight && searchTerm 
                ? highlightSearchTerm(truncateText(recipe.instructions, 80), searchTerm) 
                : truncateText(recipe.instructions, 80)}
            </p>
          </div>
          
          <div className="card-actions">
            <button 
              className={`save-btn ${saved ? 'saved' : ''}`}
              onClick={(e) => handleSaveRecipe(e, recipe._id)}
              aria-label={saved ? "Unsave recipe" : "Save recipe"}
            >
              {saved ? 'Unsave' : 'Save'}
            </button>
            {isOwner && (
              <button 
                className="delete-btn" 
                onClick={(e) => handleDeleteRecipe(e, recipe._id)}
                aria-label="Delete recipe"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    searchTerm, 
    handleRecipeClick, 
    handleSaveRecipe, 
    handleDeleteRecipe, 
    isRecipeSaved, 
    getCurrentUserId, 
    truncateText, 
    highlightSearchTerm
  ]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="home-container">
      <div className="about">
        <h1>"Connecting chefs and food lovers through shared recipes."</h1>
      </div>

      {/* Search results section */}
      {showSearchResults && (
        <div className="search-results">
          <h1>Search Results for "{searchTerm}"</h1>
          <div className="card-container">
            {searchResults.length > 0 ? (
              searchResults.map(recipe => renderRecipeCard(recipe, true))
            ) : (
              <p className="no-recipes">No recipes found matching your search.</p>
            )}
          </div>
        </div>
      )}

      {/* Regular sections */}
      {!showSearchResults && (
        <>
          <div className="vegetarian">
            <h1>Vegetarian Recipes</h1>
            <div className="card-container">
              {vegetarianRecipes.length > 0 ? (
                vegetarianRecipes.map(recipe => renderRecipeCard(recipe))
              ) : (
                <p className="no-recipes">No vegetarian recipes yet. Add one!</p>
              )}
            </div>
            <button type="button" className="add-recipe-btn" onClick={handleAddRecipe}>Add Recipe</button>
          </div>
          <div className="nonveg">
            <h1>Non-Vegetarian Recipes</h1>
            <div className="card-container">
              {nonVegRecipes.length > 0 ? (
                nonVegRecipes.map(recipe => renderRecipeCard(recipe))
              ) : (
                <p className="no-recipes">No non-vegetarian recipes yet. Add one!</p>
              )}
            </div>
            <button type="button" className="add-recipe-btn" onClick={handleAddRecipe}>Add Recipe</button>
          </div>
          <div className="suggestedrecipe">
            <h1>Suggested Recipes</h1>
            <div className="card-container">
              {suggestedRecipes.length > 0 ? (
                suggestedRecipes.map(recipe => renderRecipeCard(recipe))
              ) : (
                <p className="no-recipes">No suggested recipes available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;