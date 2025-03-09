import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './showrecipe.css';

const ShowRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/recipes/${id}`);
        if (!res.ok) {
          throw new Error('Recipe not found');
        }
        const data = await res.json();
        setRecipe(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading recipe details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleGoBack}>Go Back Home</button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Recipe Not Found</h2>
          <p>The recipe you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleGoBack}>Go Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-header">
        <button className="back-button" onClick={handleGoBack}>
          &larr; Back to Recipes
        </button>
        <h1 className="recipe-title">{recipe.title}</h1>
        <div className="recipe-meta">
          <span className="recipe-category">Category: {recipe.category}</span>
          {recipe.prepTime && (
            <span className="recipe-prep-time">Prep Time: {recipe.prepTime}</span>
          )}
          {recipe.cookTime && (
            <span className="recipe-cook-time">Cook Time: {recipe.cookTime}</span>
          )}
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-image-container">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
          ) : (
            <div className="placeholder-image">No Image Available</div>
          )}
        </div>

        <div className="recipe-information">
          <div className="recipe-ingredients">
            <h2>Ingredients</h2>
            <div className="ingredients-content">
              {recipe.ingredients.split('\n').map((ingredient, index) => (
                <p key={index} className="ingredient-item">• {ingredient.trim()}</p>
              ))}
            </div>
          </div>

          <div className="recipe-instructions">
            <h2>Instructions</h2>
            <div className="instructions-content">
              {recipe.instructions.split('\n').map((step, index) => (
                <div key={index} className="instruction-step">
                  <span className="step-number">{index + 1}</span>
                  <p>{step.trim()}</p>
                </div>
              ))}
            </div>
          </div>

          {recipe.notes && (
            <div className="recipe-notes">
              <h2>Notes</h2>
              <p>{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowRecipe;