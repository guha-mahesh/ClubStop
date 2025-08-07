import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import Puffin from '../assets/puffin.png';
import './Navbar.css';
import Profile from './Profile/Profile';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <a className="logo" href="#" onClick={() => navigate('/')}>ClubStop</a>
        <div className="items">
          <a href="#" onClick={() => navigate('/MyClubs')}>Clubs</a>
          <a href="#" onClick={() => navigate('/CreateClub')}>Create Club</a>
          <a href="#">About Us</a>
        </div>
      </div>
      <div className="nav-right">
        {!isAuthenticated ? (
          <a href="#" onClick={() => navigate('/Login')}>Log In</a>
        ) : (
          <>
            <span style={{ color: 'white', marginRight: '20px' }}>
              Welcome, {user?.username}!
            </span>
            <a href="#" onClick={handleLogout}>Log Out</a>
          </>
        )}
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar; 