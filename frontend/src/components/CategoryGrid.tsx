import React from 'react';
import './CategoryGrid.css';

const categories = [
  "Computer Science", "Finance", "Arts", "Med",
  "Student Associations", "Sports", "Engineering", "Misc"
];

const CategoryGrid = () => (
  <div className="categories">
    <h2>Categories</h2>
    <div className="categories-grid">
      {categories.map((cat) => (
        <div className="category-box" key={cat}>{cat}</div>
      ))}
    </div>
  </div>
);

export default CategoryGrid; 