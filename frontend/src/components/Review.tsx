import { useNavigate } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";

import { useState } from "react";

interface props{
    clubName: string| undefined;
    Review: string;
    User: string;
    profilePic: string | null;
    userId: string;
    created_at: string;
    ascendancy: number;
    camaraderie: number;
    prestige: number;
    obligation: number;
    legacy: number;
    total: number;
    clubId: string | undefined;
}



const Review = ({Review, User, userId, created_at, ascendancy, camaraderie, prestige, obligation, legacy, total, profilePic, clubName, clubId}: props) => {
    const [viewBreakdown, setViewBreakdown] = useState(false);
    const navigate = useNavigate(); 

  return (
    <>


    <div className = "ReviewCard">
        <div className ="userBox">
            <div className = "userBoxImg">{profilePic? (<img src={profilePic} alt="profile" className = "profilePicReview" />):(null)}</div>
            <h1 onClick = {()=>{navigate(`/UserPage/${userId}`)}}> <span className = "userSpan">{User}</span> on {created_at}</h1>
            <div className = "totalDiv">Rated <span onClick = {()=>navigate(`/club/${clubId}`)}className = "clubSpan">{clubName}</span> a <div className = "metric">{total}</div><div className="caretWrapper">
  <FaCaretRight
    onClick={() => setViewBreakdown(prev =>!prev)}
    size={24}
    className="Caret"
  />
  <h1 className="toolTip">   {viewBreakdown ? "Hide Breakdown" : "View Breakdown"}</h1>
</div>
                
</div>
        </div>
        <div className = "ReviewRatingBox">
            <h1> "{Review}"</h1>
        </div>
         <div className={`metricsBox ${!viewBreakdown ? 'hidden' : ''}`}>
  <div className="metric">Ascendancy: {ascendancy}</div>
  <div className="metric">Camaraderie: {camaraderie}</div>
  <div className="metric">Prestige: {prestige}</div>
  <div className="metric">Obligation: {obligation}</div>
  <div className="metric">Legacy: {legacy}</div>
</div>

   
        
        


    </div>
    







    </>
  )
}

export default Review


