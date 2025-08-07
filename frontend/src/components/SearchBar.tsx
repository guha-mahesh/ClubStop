import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now, just navigate to search or clubs page
      // You can implement actual search functionality later
      navigate('/MyClubs');
    }
  };

  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="query" 
          placeholder="Ex. Computer Science..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button">🔎</button>
      </form>
    </div>
  );
};

export default SearchBar; 