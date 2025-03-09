import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      
      // Create a user object with all required data
      const userData = {
        token: response.data.token,
        username: response.data.username,
        userId: response.data.userId
      };
      
      // Store user info as a JSON string in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Trigger storage event for navbar to detect
      window.dispatchEvent(new Event('storage'));
      
      setLoading(false);
      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form">
          <h1 className="text-center">Login</h1>
          
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-outline">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                placeholder="Enter your email" 
                value={loginData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-outline">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                className="form-control" 
                placeholder="Enter password" 
                value={loginData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
        <div className="login-image">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;