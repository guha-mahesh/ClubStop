import React from 'react';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/ui/searchbar/SearchBar';
import PopularClubs from '../../components/ui/PopularClubs';
import CategoryGrid from '../../components/ui/CategoryGrid';
import { useAuth } from '../../contexts/AuthContexts';
import { useState, useEffect } from 'react';
import './Home.css';


const Home = () => {
  const { user, isAuthenticated, school, loading} = useAuth();
  //@ts-ignore
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);


    const [apis, setApis] = useState(["universities"])

    useEffect(() => {
  if (!loading && school) {
    console.log("school changed", school);
    console.log("isAuthenticated", isAuthenticated);
    

    //@ts-ignore
    setSelectedSchool(school); 
    setApis(['flairs', 'clubs']);
  }
}, [loading, school, isAuthenticated]);

useEffect(() => {
  console.log("Selected school:", selectedSchool);
}, [selectedSchool]);


   
  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          {selectedSchool ? (<h1 className="hero-title">
            <>
            {/* @ts-ignore */}


            Looking for a Club at {selectedSchool}?
            </>
          </h1>): (<h1 className="hero-title">Looking for a Club?</h1>) }
          {selectedSchool ? (<p className="hero-subtitle">
            <>
            {/* @ts-ignore */}
            Discover, join, and connect with amazing student organizations at {selectedSchool}
            </>
          </p>): (<p className="hero-subtitle">
            Search for your college!
          </p>)}
          <div className="search-container">

            {/* @ts-ignore */}
            
            {!loading ? (<SearchBar 
            {...(selectedSchool && { specified:selectedSchool  })} 

  {...(!selectedSchool && { placeholder: "Ex. Harvard University..." })} 
  api={apis}
              setSpecified={(e) => e && setSelectedSchool(e)}
               setApis={(newApis) => newApis && setApis(newApis)}




/>): (<div>loading....</div>)}


          </div>
          {selectedSchool && (<button onClick = {()=>{setSelectedSchool("")}}>Search for Clubs at other schools</button>)}
        </div>
      </div>
      {selectedSchool?(
      <div className="main-content">
        <PopularClubs />
        <CategoryGrid school = {selectedSchool} />
      </div>): null}
    </>
  );
};

export default Home;
