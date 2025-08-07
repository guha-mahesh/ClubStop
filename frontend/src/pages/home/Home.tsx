import React from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import PopularClubs from '../../components/PopularClubs';
import CategoryGrid from '../../components/CategoryGrid';
import { useAuth } from '../../contexts/AuthContexts';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#a4b5b9', padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '40px' }}>
          Looking for a club at Northeastern?
        </h1>
        <SearchBar />
      </div>
      <PopularClubs />
      <CategoryGrid />
    </>
  );
};

export default Home;
