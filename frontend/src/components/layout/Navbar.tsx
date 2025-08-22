import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import Puffin from '../ui/Puffin';
import './Navbar.css';
import Profile from '../cards/Profile/Profile';

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
        <a className="logo" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>ClubStop</a>
        <div className="items">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/MyClubs'); }}>Clubs</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/CreateClub'); }}>Create Club</a>
          <a href="#">About Us</a>
        </div>
      </div>
      <div className="nav-right">
        {!isAuthenticated ? (
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/Login'); }}>Log In</a>
        ) : (
          <>
            <span style={{ color: '#a83232', fontSize: '1.2rem', fontWeight: 'bold', marginRight: '20px', marginLeft: '20px' }}>
              Welcome, {user?.username}!
            </span>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Log Out</a>
          </>
        )}
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar; 