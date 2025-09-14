import React from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';
import ClubCard from '../components/cards/clubs/ClubCard';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './FlairSort.css';

interface Club {
    clubName: string;
    club_id: string;
    clubDesc: string;
    School: string;
    leaderName: string;
    ascendancy: number;
    camaraderie: number;
    prestige: number;
    legacy: number;
    obligation: number;
    total: number;
}

type SortKey = keyof Pick<Club, 'total' | 'ascendancy' | 'camaraderie' | 'prestige' | 'legacy' | 'obligation'>;

const FlairSort = () => {
    const [fetching, setFetching] = useState(true);
    const [clubs, setClubs] = useState<Club[] | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>('total');
    const { flairName} = useParams<{ flairName: string }>();
    const { university} = useParams<{ university: string }>();
    const [noClubs, setNoClubs] = useState(false);

    const sortOptions = [
        { value: 'total', label: 'Total Rating' },
        { value: 'ascendancy', label: 'Ascendancy' },
        { value: 'camaraderie', label: 'Camaraderie' },
        { value: 'prestige', label: 'Prestige' },
        { value: 'legacy', label: 'Legacy' },
        { value: 'obligation', label: 'Obligation' }
    ] as const;

    const sortClubs = (clubsToSort: Club[], sortKey: SortKey): Club[] => {
        return [...clubsToSort].sort((a, b) => b[sortKey] - a[sortKey]);
    };

    useEffect(() => {
        const getClubsByFlair = async () => {
            try {
                console.log(flairName)

                const result = await fetch(`${backendUrl}/api/sort/${flairName}/${university}`,
            {method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          
          const data = await result.json();
          if (data.success) {
            console.log(data, "yipepeee")
            setClubs(data.clubData);
          }
          else{
            console.log(data.error)
            if(data.errorCode === 404){
                setNoClubs(true);
            }
          }
            } catch (error) {
                console.error('Error fetching clubs:', error);
            } finally {
                setFetching(false);
            }
        }
        getClubsByFlair();
    }, []);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value as SortKey);
    };

    const sortedClubs = clubs ? sortClubs(clubs, sortBy) : null;

  return (
    <div className="flair-sort-page">
      {!fetching ? ( 
        noClubs ? (
          <div className="no-clubs-container">
            <div className="no-clubs-card">
              <div className="no-clubs-icon">🔍</div>
              <h2 className="no-clubs-title">No clubs found</h2>
              <p className="no-clubs-message">
                We couldn't find any clubs for the <strong>{flairName}</strong> flair at this university.
              </p>
            </div>
          </div>
        ) : (
          <div className="flair-sort-container">
            <div className="flair-sort-header">
              <div className="header-content">
                <h1 className="page-title">
                  Top Rated Clubs under{" "}
                  <span className="flair-highlight">
                    {flairName}
                  </span>
                </h1>
                <p className="university-subtitle">{university}</p>
              </div>
              
              <div className="sort-controls">
                <label htmlFor="sort-select" className="sort-label">
                  Sort by:
                </label>
                <div className="select-wrapper">
                  <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={handleSortChange}
                    className="sort-select"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="select-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="clubs-grid">
              {sortedClubs?.map((club, id) => (
                <div key={id} className="club-card-wrapper">
                  <ClubCard
                    ClubName={club.clubName}
                    ClubDescription={club.clubDesc}
                    id={club.club_id}
                    School={club.School}
                    leader={club.leaderName}
                  />
                </div>
              ))}
            </div>
            
            {sortedClubs && sortedClubs.length > 0 && (
              <div className="results-footer">
                <p className="results-count">
                  Showing {sortedClubs.length} club{sortedClubs.length !== 1 ? 's' : ''} 
                  {sortBy !== 'total' && ` sorted by ${sortOptions.find(opt => opt.value === sortBy)?.label}`}
                </p>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Finding the best clubs for you...</p>
        </div>
      )}
    </div>
  );
}

export default FlairSort