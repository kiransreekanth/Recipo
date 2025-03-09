import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addrecipe.css';

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    category: 'vegetarian',
    ingredients: '',
    instructions: '',
    image: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add a recipe.');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to add a recipe.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/add-recipe',
        recipe,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage(response.data.message);
      setRecipe({ title: '', category: 'vegetarian', ingredients: '', instructions: '', image: '' });
      setLoading(false);
      
      // Redirect to home page after successful submission
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Add recipe error:', error);
      
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token'); // Clear the invalid token
        setMessage('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(error.response?.data?.message || 'Error adding recipe');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-container">
      <h1>Add a New Recipe</h1>
      {message && <p className={message.includes('Success') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>Recipe Title:</label>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select name="category" value={recipe.category} onChange={handleChange}>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
        </select>

        <label>Ingredients:</label>
        <textarea
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          required
          placeholder="List ingredients separated by commas"
        ></textarea>

        <label>Instructions:</label>
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          required
          placeholder="Step-by-step cooking instructions"
        ></textarea>

        <label>Recipe Image URL:</label>
        <input
          type="text"
          name="image"
          value={recipe.image}
          onChange={handleChange}
          placeholder="Enter image URL"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;