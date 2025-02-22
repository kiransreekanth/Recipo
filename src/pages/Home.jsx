import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="about">
        <h1>"Connecting chefs and food lovers through shared recipes."</h1>
      </div>
      <div className="vegetarian">
        <h1>Vegetarian Recipes</h1>
        <div className="card-container">
          <div className="card"><h2>Recipe 1</h2></div>
          <div className="card"><h2>Recipe 2</h2></div>
          <div className="card"><h2>Recipe 3</h2></div>
        </div>
        <button type="button" onClick={() => navigate('/add-recipe')}>Add Recipe</button>
      </div>
      <div className="nonveg">
        <h1>Non-Vegetarian Recipes</h1>
        <div className="card-container">
          <div className="card"><h2>Recipe 1</h2></div>
          <div className="card"><h2>Recipe 2</h2></div>
          <div className="card"><h2>Recipe 3</h2></div>
        </div>
        <button type="button" onClick={() => navigate('/add-recipe')}>Add Recipe</button>
      </div>
    </>
  );
}

export default Home;
