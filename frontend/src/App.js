import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import ShowRecipe from './pages/ShowRecipe';
import Footer from './components/Footer';
import SavedRecipes from './pages/SavedRecipes';
import Support from './pages/Support';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe/:id" element={<ShowRecipe />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;