import React, { useState } from 'react';
import './addrecipe.css';

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    category: 'vegetarian',
    ingredients: '',
    instructions: '',
    image: ''
  });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recipe Submitted:', recipe);
    // You can add functionality to save the recipe to a database or state
  };

  return (
    <div className="add-recipe-container">
      <h1>Add a New Recipe</h1>
      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Recipe Title */}
        <label>Recipe Title:</label>
        <input type="text" name="title" value={recipe.title} onChange={handleChange} required />

        {/* Category */}
        <label>Category:</label>
        <select name="category" value={recipe.category} onChange={handleChange}>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
        </select>

        {/* Ingredients */}
        <label>Ingredients:</label>
        <textarea name="ingredients" value={recipe.ingredients} onChange={handleChange} required placeholder="List ingredients separated by commas"></textarea>

        {/* Instructions */}
        <label>Instructions:</label>
        <textarea name="instructions" value={recipe.instructions} onChange={handleChange} required placeholder="Step-by-step cooking instructions"></textarea>

        {/* Image URL */}
        <label>Recipe Image URL:</label>
        <input type="text" name="image" value={recipe.image} onChange={handleChange} placeholder="Enter image URL" />

        {/* Submit Button */}
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
