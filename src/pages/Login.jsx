import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './login.css'; // Import the CSS file

const Login = () => {
  const [remember, setRemember] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <form>
          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter password" />
          </div>

          {/* Checkbox & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label className="form-check-label">Remember me</label>
            </div>
            <a href="#">Forgot password?</a>
          </div>

          {/* Sign-in Button */}
          <button className="btn btn-primary w-100">Sign in</button>

          {/* Register & Social Login */}
          <div className="text-center mt-3">
            <p>Not a member? <Link to="/register">Register</Link></p> {/* Link to Register */}
            <p>or sign up with:</p>
            <button className="btn btn-link mx-1"><i className="fab fa-facebook-f"></i></button>
            <button className="btn btn-link mx-1"><i className="fab fa-google"></i></button>
            <button className="btn btn-link mx-1"><i className="fab fa-twitter"></i></button>
            <button className="btn btn-link mx-1"><i className="fab fa-github"></i></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
