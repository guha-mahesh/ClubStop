import { useState, useEffect } from "react";
import Clubs from "../../components/cards/clubs/ClubCard";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContexts';
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

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
  const [fetching, setFetching] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "leading" | "joined">("all");

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
          setFetching(false);
        }
        else if (data.success && data.clubData == "No Clubs Yet") {
          setFetching(false);
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    if (isAuthenticated && !loading) {
      fetchClubData();
    }
  }, [user, navigate, isAuthenticated, loading]);

  // Get clubs to display based on filter
  const getDisplayClubs = () => {
    switch (filterType) {
      case "leading":
        return leading || [];
      case "joined":
        return joined || [];
      case "all":
      default:
        return clubData || [];
    }
  };

  // Get section title based on filter
  const getSectionTitle = () => {
    switch (filterType) {
      case "leading":
        return "Clubs You're Leading";
      case "joined":
        return "Clubs You've Joined";
      case "all":
      default:
        return "All Your Clubs";
    }
  };

  // Get empty state message and button
  const getEmptyState = () => {
    switch (filterType) {
      case "leading":
        return {
          message: "Not Leading any Clubs",
          showButton: true,
          buttonText: "Create Your First Club",
          buttonAction: () => navigate("/CreateClub")
        };
      case "joined":
        return {
          message: "Haven't Joined Any Clubs Yet",
          showButton: false
        };
      case "all":
      default:
        return {
          message: "No Clubs Yet",
          showButton: true,
          buttonText: "Create Your First Club",
          buttonAction: () => navigate("/CreateClub")
        };
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayClubs = getDisplayClubs();
  const emptyState = getEmptyState();

  return (
    <>
      {!fetching ? (
        <div>
          <Navbar />
          <div className="allClubs">
            {/* Filter Dropdown */}
            <div className="filter-section">
              <label htmlFor="club-filter">View: </label>
              <select 
                id="club-filter"
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as "all" | "leading" | "joined")}
                className="club-filter-dropdown"
              >
                <option value="all">All Clubs</option>
                <option value="leading">Leading</option>
                <option value="joined">Joined</option>
              </select>
            </div>

            {/* Clubs Display Section */}
            <div className="clubs-section">
              {displayClubs && displayClubs.length > 0 ? (
                <>
                  <h2>{getSectionTitle()}:</h2>
                  <div className="clubs-grid">
                    {displayClubs.map((club) => (
                      <div key={club.club_id} className="club-item">
                        <Clubs 
                          id={club.club_id} 
                          ClubName={club.clubName} 
                          ClubDescription={club.clubDesc} 
                          School={club.school} 
                          leader={club.leaderName}
                        />
                        <p className="club-date">
                          {filterType === "leading" ? "Created" : "Joined"}: {new Date(club.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-clubs-section">
                  <h2>{emptyState.message}</h2>
                  {emptyState.showButton && (
                    <button 
                      onClick={emptyState.buttonAction} 
                      className="create-club-link"
                    >
                      {emptyState.buttonText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default MyClubs;