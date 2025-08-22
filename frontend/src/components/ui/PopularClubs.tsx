import React, { useState, useEffect } from 'react';
import ClubCard from '../cards/ClubCard';
import './PopularClubs.css';

interface Club {
  club_id: string;
  clubName: string;
  clubDesc: string;
  School: string;
  total: number;
  ratings?: number;
}

const PopularClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularClubs = async () => {
      try {
        // For now, we'll use dummy data since the backend doesn't have a "popular clubs" endpoint
        // You can implement this later by adding an endpoint to get clubs sorted by rating
        const dummyClubs = [
          {
            club_id: '1',
            clubName: 'Computer Science Club',
            clubDesc: 'Programming and tech enthusiasts',
            School: 'Computer Science',
            total: 85,
            ratings: 12
          },
          {
            club_id: '2',
            clubName: 'Finance Society',
            clubDesc: 'Investment and financial education',
            School: 'Finance',
            total: 92,
            ratings: 8
          },
          {
            club_id: '3',
            clubName: 'Art Collective',
            clubDesc: 'Creative expression and design',
            School: 'Arts',
            total: 78,
            ratings: 15
          },
          {
            club_id: '4',
            clubName: 'Engineering Club',
            clubDesc: 'Innovation and problem solving',
            School: 'Engineering',
            total: 88,
            ratings: 20
          }
        ];
        
        setClubs(dummyClubs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular clubs:', error);
        setLoading(false);
      }
    };

    fetchPopularClubs();
  }, []);

  if (loading) {
    return <div>Loading popular clubs...</div>;
  }

  return (
    <div className="popular">
      <h2 className="head">Popular Clubs</h2>
      <div className="popular-cards">
        {clubs.map((club) => (
          <ClubCard
            key={club.club_id}
            category={club.School}
            name={club.clubName}
            ratings={club.ratings || 0}
            score={club.total}
            imageUrl="https://via.placeholder.com/100"
            clubId={club.club_id}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularClubs; 