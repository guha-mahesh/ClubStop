import { useState, useEffect } from "react";
import Clubs from "../../components/clubs/ClubCard";
import ScreenHeader from "../../components/ScreenHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContexts';
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://your-backend-service.onrender.com';



const MyClubs = () => {
  interface Club {
    clubName: string;
    clubDesc: string;
    school: string;
    created_at: string;
    club_id: string;
    clubRole: string;
    leader: string;
    leaderName: string;
  }

  const navigate = useNavigate();
  const [clubData, setClubData] = useState<Club[] | null>(null);
  const [leading, setLeading] = useState<Club[] | null>(null);
  const [joined, setJoined] = useState<Club[] | null>(null);
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchClubData = async () => {
      if (!user) {
        navigate("/Login");
        return;
      }

      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(`${backendUrl}/api/clubs/${user.id}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          },
        });

        const data = await response.json();
        
        if (data.success && data.clubData !== "No Clubs Yet") {
          const clubs = data.clubData;
          setClubData(clubs);
          

          const leadingClubs = clubs.filter((club: Club) => 
            club.clubRole === 'Leader' || club.leader === user.id
          );
          setLeading(leadingClubs);
          

          const joinedClubs = clubs.filter((club: Club) => 
            club.clubRole !== 'Leader' && club.leader !== user.id
          );
          setJoined(joinedClubs);
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    if (isAuthenticated && !loading) {
      fetchClubData();
    }
  }, [user, navigate, isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <ScreenHeader />
      <div className="allClubs">

        <div className="leading-section">
          {leading && leading.length > 0 ? (
            <>
              <h2>Clubs You're Leading:</h2>
              <div className="clubs-grid">
                {leading.map((club) => (
                  <div key={club.club_id} className="club-item">
                    <Clubs 
                      id={club.club_id} 
                      ClubName={club.clubName} 
                      ClubDescription={club.clubDesc} 
                      School={club.school} 
                      leader={club.leaderName}
                    />
                    <p className="club-date">
                      Created: {new Date(club.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-clubs-section">
              <h2>Not Leading any Clubs</h2>
              <a href="/CreateClub" className="create-club-link">
                <button>Create Your First Club</button>
              </a>
            </div>
          )}
        </div>


        <div className="joined-section">
          {joined && joined.length > 0 ? (
            <>
              <h2>Clubs You've Joined:</h2>
              <div className="clubs-grid">
                {joined.map((club) => (
                  <div key={club.club_id} className="club-item">
                    <Clubs 
                      id={club.club_id} 
                      ClubName={club.clubName} 
                      ClubDescription={club.clubDesc} 
                      School={club.school} 
                      leader={club.leaderName}
                    />
                    <p className="club-date">
                      Joined: {new Date(club.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-clubs-section">
              <h2>Haven't Joined Any Clubs Yet</h2>
             
            </div>
          )}
        </div>


        
      </div>
    </div>
  );
};

export default MyClubs;