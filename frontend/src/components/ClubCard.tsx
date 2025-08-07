import React from 'react';
import './PopularClubs.css';

type ClubCardProps = {
  category: string;
  name: string;
  ratings: number;
  score: number;
  imageUrl: string;
  clubId?: string;
};

const ClubCard: React.FC<ClubCardProps> = ({ category, name, ratings, score, imageUrl, clubId }) => (
  <div className="card-holder">
    <h2>{category}</h2>
    <div className="popular-card">
      <div className="image-container">
        <img src={imageUrl} alt="icon" className="icon" />
      </div>
      <div className="text-container">
        <div className="club-container">
          <div className="club-name">{name}</div>
          <div className="desc">{ratings} Ratings</div>
        </div>
        <div className="score-holder">
          <div className="score">{score}</div>
        </div>
      </div>
    </div>
  </div>
);

export default ClubCard; 