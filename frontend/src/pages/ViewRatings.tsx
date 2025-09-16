import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';
import Review from "../components/Review";
import "./ViewRatings.css";

interface rating {
    username: string;
    users_id: string;
    ascendancy: number;
    camaraderie: number;
    prestige: number;
    obligation: number;
    legacy: number;
    total: number;
    review: string;
    profilePic: string | null;
    created_at: string;
}

type SortField = 'total' | 'ascendancy' | 'camaraderie' | 'prestige' | 'obligation' | 'legacy' | 'created_at';
type SortOrder = 'asc' | 'desc';

const ViewRatings = () => {
    const { clubID, clubName } = useParams();
    const [noClub, setNoClub] = useState(false);
    const [ratings, setRatings] = useState<rating[] | null>(null);
    const [sortField, setSortField] = useState<SortField>('total');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [sortedRatings, setSortedRatings] = useState<rating[] | null>(null);

    useEffect(() => {
        if (ratings) {
            const sorted = [...ratings].sort((a, b) => {
                let aValue, bValue;
                
                if (sortField === 'created_at') {
                    aValue = new Date(a[sortField]).getTime();
                    bValue = new Date(b[sortField]).getTime();
                } else {
                    aValue = a[sortField];
                    bValue = b[sortField];
                }
                
                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            setSortedRatings(sorted);
        }
    }, [ratings, sortField, sortOrder]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const results = await fetch(`${backendUrl}/api/ratings/${clubID}`, {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json', 
                    },
                });
                const data = await results.json();
                if (data.success) {
                    setRatings(data.ratings);  
                } else if (data.error === "No ratings for this club") {
                    setNoClub(true);
                } else {
                    console.log(data.error);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchRatings();
    }, []);

    const handleSortChange = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    if (noClub) {
        return (
            <div className="ratings-page-container">
                <div className="ratings-wrapper">
                    <div className="no-ratings-card">
                        <div className="no-ratings-content">
                            <div className="no-ratings-icon">📝</div>
                            <h2 className="no-ratings-title">No Reviews Yet</h2>
                            <p className="no-ratings-subtitle">Be the first to share your experience with {clubName}!</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!ratings) {
        return (
            <div className="ratings-page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading reviews...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="ratings-page-container">
            <div className="ratings-wrapper">
                <div className="ratings-header-card">
                    <div className="ratings-header-content">
                        <h1 className="ratings-title">Reviews for {clubName}</h1>
                        <p className="ratings-subtitle">{ratings.length} review{ratings.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                <div className="sort-controls-card">
                    <div className="sort-header">
                        <h3 className="sort-title">Sort Reviews</h3>
                    </div>
                    <div className="sort-buttons">
                        <button 
                            className={`sort-button ${sortField === 'total' ? 'active' : ''}`}
                            onClick={() => handleSortChange('total')}
                        >
                            Total Score
                            {sortField === 'total' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                        <button 
                            className={`sort-button ${sortField === 'ascendancy' ? 'active' : ''}`}
                            onClick={() => handleSortChange('ascendancy')}
                        >
                            Ascendancy
                            {sortField === 'ascendancy' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                        <button 
                            className={`sort-button ${sortField === 'camaraderie' ? 'active' : ''}`}
                            onClick={() => handleSortChange('camaraderie')}
                        >
                            Camaraderie
                            {sortField === 'camaraderie' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                        <button 
                            className={`sort-button ${sortField === 'prestige' ? 'active' : ''}`}
                            onClick={() => handleSortChange('prestige')}
                        >
                            Prestige
                            {sortField === 'prestige' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                        <button 
                            className={`sort-button ${sortField === 'obligation' ? 'active' : ''}`}
                            onClick={() => handleSortChange('obligation')}
                        >
                            Obligation
                            {sortField === 'obligation' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                        <button 
                            className={`sort-button ${sortField === 'legacy' ? 'active' : ''}`}
                            onClick={() => handleSortChange('legacy')}
                        >
                            Legacy
                            {sortField === 'legacy' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                        <button 
                            className={`sort-button ${sortField === 'created_at' ? 'active' : ''}`}
                            onClick={() => handleSortChange('created_at')}
                        >
                            Date
                            {sortField === 'created_at' && (
                                <span className="sort-indicator">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="reviews-grid">
                    {sortedRatings && sortedRatings.map((r, idx) => (
                        <div key={idx} className="review-item">
                            <Review
                                Review={r.review}
                                User={r.username}
                                userId={r.users_id}
                                created_at={new Date(r.created_at).toLocaleDateString()} 
                                ascendancy={r.ascendancy}
                                camaraderie={r.camaraderie}
                                prestige={r.prestige}
                                obligation={r.obligation}
                                legacy={r.legacy}
                                total={r.total}
                                profilePic={r.profilePic}
                                clubName={clubName}
                                clubId={clubID}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewRatings;