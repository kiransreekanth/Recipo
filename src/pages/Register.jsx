import React from 'react';
import { Link } from 'react-router-dom';
import './register.css'; // Import CSS

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left Side: Registration Form */}
        <div className="register-form">
          <h1 className="text-center">Sign up</h1>

          <form>
            <div className="form-outline">
              <label>Your Name</label>
              <input type="text" className="form-control" placeholder="Enter your name" />
            </div>

            <div className="form-outline">
              <label>Your Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>

            <div className="form-outline">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Enter password" />
            </div>

            <div className="form-outline">
              <label>Repeat your password</label>
              <input type="password" className="form-control" placeholder="Repeat password" />
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">I agree to all statements in <a href="#">Terms of service</a></label>
            </div>

            <button type="submit" className="register-btn">Register</button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="register-image">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" alt="Register" />
        </div>
      </div>
    </div>
  );
};

export default Register;
