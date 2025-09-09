import React from 'react';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/ui/searchbar/SearchBar';
import PopularClubs from '../../components/ui/PopularClubs';
import CategoryGrid from '../../components/ui/CategoryGrid';
import { useAuth } from '../../contexts/AuthContexts';
import './Home.css';


const Home = () => {
  const { user, isAuthenticated, school, loading} = useAuth();



  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          {school ? (<h1 className="hero-title">
            <>
            {/* @ts-ignore */}


            Looking for a Club at {school}?
            </>
          </h1>): (<h1 className="hero-title">Looking for a Club?</h1>) }
          {user && school ? (<p className="hero-subtitle">
            <>
            {/* @ts-ignore */}
            Discover, join, and connect with amazing student organizations at {school}
            </>
          </p>): (<p className="hero-subtitle">
            Search for your college!
          </p>)}
          <div className="search-container">

            {/* @ts-ignore */}
            
            {!loading ? (<SearchBar 
  {...(school && { School: school })} 
  {...(!user && { placeholder: "Ex. Harvard University..." })} 
  api={user ? ["clubs", "flairs"] : ["universities"]}
/>): (<div>loading....</div>)}

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
