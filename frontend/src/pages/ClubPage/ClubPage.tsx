//THIS is a clubPage, we can prob make a lot of this stuff components but we need to be careful w the backend,,,

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ScreenHeader from "../../components/ScreenHeader";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import feather from "../../assets/FeatherIcon.png";
import {useAuth} from '../../contexts/AuthContexts'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://your-backend-service.onrender.com';








interface Rating{
  camaraderie: number;
  ascendancy: number;
  prestige: number;
  obligation: number;
  legacy: number;
  total: number;
  
}
interface clubData{
    clubName: string;
    clubDesc: string;
     School: string;
      created_at: string;
      camaraderie: number;
  ascendancy: number;
  prestige: number;
  obligation: number;
  legacy: number;
  total: number;
  leader: number;
  leaderName: string;

  }
const ClubPage = () => {

  

  const {loading, isAuthenticated, user} = useAuth();
  const navigate = useNavigate();
  const { clubID } = useParams<{ clubID: string }>();
  const [clubData, setClubData] = useState<clubData | null>(null);
  const [rate, setRate] = useState<boolean>(false);
  const [camaraderie, setCamaraderie] = useState<string>("");
  const [ascendancy, setAscendancy] = useState<string>("");
  const [prestige, setPrestige] = useState<string>("");
  const [obligation, setObligation] = useState<string>("");
  const [legacy, setLegacy] = useState<string>("");
  const [ratingError, setRatingError] = useState<string>("");
  const [hasRated, setHasRated] = useState(true);


  const [role, setRole] = useState<string>("");


  useEffect(() => {

    if(!loading && !isAuthenticated){
      
      navigate("/")
    }
    
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    console.log("trying")
    const token = localStorage.getItem("authToken")
    const fetchClubData = async () =>{
      console.log("trying 2.0")
      
      if (user){
        console.log("user exists")
        const response = await fetch(`${backendUrl}/api/club/${clubID}?userId=${user.id}`,  {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}` },
    });
        
    const data = await response.json();
    if (data.success){
      console.log(data.clubRole)
      setClubData(data.clubData)
      if( data.clubRole !== "Not a Member!"){
      setRole(data.clubRole)}
      setHasRated(data.hasRated)
      console.log(data.hasRated)

      console.log("Success")
    }

      }
    }
  fetchClubData();
  }, [clubID, user]);

  useEffect(()=>{
    console.log(clubData, "\n", "\n", role)
  }, [clubData, role])
  

  
  const clearInputs = () => {
    setCamaraderie("");
    setAscendancy("");
    setPrestige("");
    setObligation("");
    setLegacy("");
  };



  const handleJoin = async () =>{
    const token = localStorage.getItem("authToken")

    if(user){
    const response = await fetch(`${backendUrl}/api/member`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    userId: user.id,
    clubId: clubID,
  }),
});

const data = await response.json();
if (data.success){
  console.log("joined Club!")
  setRole("Member")

}else{
  console.log("Failed to join club")
}


}

  }











  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
const token = localStorage.getItem("authToken")

    e.preventDefault();

    if (!user || !clubData) {
      alert("An error occurred")
      navigate("/")
    }

    const total = parseFloat(
      (
        (parseFloat(ascendancy) +
          parseFloat(camaraderie) +
          parseFloat(legacy) +
          parseFloat(prestige) +
          parseFloat(obligation)) /
        5
      ).toFixed(1)
    );

    try {
      if(user){
      const response = await fetch(`${backendUrl}/api/rate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    userId: user.id,
    clubId: clubID,
    ascendancy: parseFloat(ascendancy),
    camaraderie: parseFloat(camaraderie),
    legacy: parseFloat(legacy),
    prestige: parseFloat(prestige),
    obligation: parseFloat(obligation),
    total: total,
  }),
});

const data = await response.json();
if(data.success)

     { console.log("Club rated:");
      clearInputs();
      setRate(false);
      setHasRated(true)
      window.location.reload();}}
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  

  return (
    <>
      <ScreenHeader />
      {!rate ? (
        <div>
          <div className="clubNameHeader">
            <div className="clubNameHeader topPart">
              {hasRated}
              <h1 className="clubNameText">{clubData?.clubName}</h1>
              <div className="iconic">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={role ? "valid membIcon" : "hide"}
                />
                <h4 className="tooltip">You are a {role}!</h4>
              </div>
            </div>

          </div>

          <div className="ClubContent">
            
              <div className="ratings">
                <h1 className="ratingBox ratingBox1">
                  Ascendancy: {clubData ?(<span>{clubData.ascendancy.toFixed(2)}</span>): (<span>None Yet</span>)}
                </h1>
                <br />
                <h1 className="ratingBox ratingBox2">
                  Camaraderie: {clubData ? (<span>{clubData.camaraderie.toFixed(2)}</span>): (<span>None Yet</span>)}
                </h1>
                <br />
                <h1 className="ratingBox ratingBox3">
                  Prestige: {clubData ? (<span>{clubData.prestige.toFixed(2)}</span>): (<span>None Yet</span>)}
                </h1>
                <br />
                <h1 className="ratingBox ratingBox4">
                  Obligation: {clubData ? (<span>{clubData.obligation.toFixed(2)}</span>): (<span>None Yet</span>)}
                </h1>
                <br />
                <h1 className="ratingBox ratingBox5">
                  Legacy: {clubData ? (<span>{clubData.legacy.toFixed(2)}</span>): (<span>None Yet</span>)}
                </h1>
                <br />
                <h1 className="ratingBox ratingBox6">
                  Overall: {clubData ? (<span>{clubData.total.toFixed(2)}</span>): (<span>None Yet</span>)}
                </h1>
              </div>

        

            <img className="featherIcon featherIconClubPage" src={feather} />
            <p className="description">
              {clubData?.clubDesc || "No description available."}
            </p>
            <img
              className="featherIcon featherIconClubPage"
              id="featherIcon2clubpage"
              src={feather}
            />
            <div className="rightScreen">
              {!role ? (
                <button className="clubPageBtn" onClick={()=>handleJoin()}>
                  Join Club
                </button>
              ) : null}
              <br />
              
              {! hasRated? (<button
                className="clubPageBtn"
                onClick={() => {
                  if(! hasRated){
                  
                setRate(true);
              
              }else{console.log("hi")}
                }}
              >
                Rate Club
              </button>) : null}
              {ratingError && <p className="error-message">{ratingError}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="rating-form">
          <button className="back-button" onClick={() => setRate(false)}>
            Back
          </button>
          <form className="rating-form-body" onSubmit={handleSubmit}>
            <div className="rating-input-group">
              <label htmlFor="camaraderie" className="rating-label">
                Camaraderie
              </label>
              <input
                id="camaraderie"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={camaraderie}
                onChange={(e) => setCamaraderie(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={camaraderie}
                onChange={(e) => setCamaraderie(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="ascendancy" className="rating-label">
                Ascendancy
              </label>
              <input
                id="ascendancy"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={ascendancy}
                onChange={(e) => setAscendancy(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={ascendancy}
                onChange={(e) => setAscendancy(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="prestige" className="rating-label">
                Prestige
              </label>
              <input
                id="prestige"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={prestige}
                onChange={(e) => setPrestige(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={prestige}
                onChange={(e) => setPrestige(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="obligation" className="rating-label">
                Obligation
              </label>
              <input
                id="obligation"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={obligation}
                onChange={(e) => setObligation(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={obligation}
                onChange={(e) => setObligation(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="legacy" className="rating-label">
                Legacy
              </label>
              <input
                id="legacy"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
                required
              />
            </div>

            <button className="submit-rating-button" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ClubPage;
