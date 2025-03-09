import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      // ✅ Check if user data exists in localStorage before parsing
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
      } else {
        setUser(JSON.parse(storedUser)); // ✅ Parse only if data exists
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate('/login'); // Redirect if there's a parsing error
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage')); // ✅ Update navbar immediately
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Your Profile</h1>
        {user ? (
          <div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
