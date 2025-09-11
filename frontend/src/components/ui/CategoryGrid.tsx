import React from 'react';
import './CategoryGrid.css';
import { useNavigate } from 'react-router-dom';

interface props{
  school: string;
}





const CategoryGrid = ({school}:props) => {

  const navigate = useNavigate();
  const categories = {
"Computer Science": 1,
"Business": 9,
"Medicine": 18,
"Arts": 29,
"Sports": 33,
"Community Service": 36,
"Music": 30,
"Engineering": 2,  
}
  return (
    <div className="categories">
    <h2>Categories</h2>
    <div className="categories-grid">
      {Object.entries(categories).map(([name,id]) => (
        <div onClick = {()=>{navigate( `/sortFlair/${school}/${name}`)}}className="category-box" key={id}>{name}</div>
      ))}
    </div>
  </div>
  )
}

export default CategoryGrid