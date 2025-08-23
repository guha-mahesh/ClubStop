import React from 'react';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/ui/SearchBar';
import PopularClubs from '../../components/ui/PopularClubs';
import CategoryGrid from '../../components/ui/CategoryGrid';
import { useAuth } from '../../contexts/AuthContexts';
import './Home.css';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Looking for a club at Northeastern?
          </h1>
          <p className="hero-subtitle">
            Discover, join, and connect with amazing student organizations
          </p>
          <div className="search-container">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="main-content">
        <PopularClubs />
        <CategoryGrid />
      </div>
    </>
  );
};

export default Home;
