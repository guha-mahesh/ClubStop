import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import feather from "../../assets/FeatherIcon.png";
import {useAuth} from '../../contexts/AuthContexts'
import Flair from "../../components/Flair";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

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
  const [isLeader, setIsLeader] = useState(false);
  const [onBoard, setOnBoard] = useState(false);
  const navigate = useNavigate();
  const { clubID } = useParams<{ clubID: string }>();
  const [clubData, setClubData] = useState<clubData | null>(null);
  const [rate, setRate] = useState<boolean>(false);
  const [camaraderie, setCamaraderie] = useState<string>("");
  const [ascendancy, setAscendancy] = useState<string>("");
  const [prestige, setPrestige] = useState<string>("");
  const [obligation, setObligation] = useState<string>("");
  const [legacy, setLegacy] = useState<string>("");
  const [review, setReview] = useState<string>("")
  const [hasRated, setHasRated] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [role, setRole] = useState<string>("");
  const [edit, setEdit] = useState(false);
  const [flairs,setFlairs] = useState<string[] | null>(null)
  const [primaryFlair, setPrimaryFlair] = useState("")

  const formatDate = (isoString: string): string => {
    const year = isoString.substring(0, 4);
    const month = isoString.substring(5, 7);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formatted = `${monthNames[parseInt(month) - 1]} ${year}`;

    return formatted;
  }

  useEffect(() => {

    const token = localStorage.getItem("authToken")
    const fetchClubData = async () =>{
    console.log(user)

      
      if (user){
        console.log("user exists")
        const response = await fetch(`${backendUrl}/api/club/${clubID}?userId=${user.id}`,  {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            
           },
           credentials: 'include',
        });
        
        const data = await response.json();

        if (data.success){
          setClubData(data.clubData)
          setFlairs(data.flairs)
          setPrimaryFlair(data.primaryFlair)
          console.log(data.flairs)
          setFetching(false)

          if( data.clubRole !== "Not a Member!"){
            setRole(data.clubRole)
          }

          if(data.clubData.leader == user.id){


            setIsLeader(true);
           

        }
         if(data.clubRole == "Board"){
              setOnBoard(true)
            }

          setHasRated(data.hasRated)
          console.log("Success")
          console.log(data.clubData)
        }
      }
      else{
        const response = await fetch(`${backendUrl}/api/club/${clubID}`,  {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success){
          setClubData(data.clubData)
          setFetching(false)
          console.log("success")

          

        }else{
          console.log("failure")
          console.log(data.error)
        }
      }
    }
    fetchClubData();
  }, [clubID, user]);

  
  const clearInputs = () => {
    setCamaraderie("");
    setAscendancy("");
    setPrestige("");
    setObligation("");
    setLegacy("");
    setReview("");
  };

  const handleJoin = async () =>{
    const token = localStorage.getItem("authToken")

    if(user){
      const response = await fetch(`${backendUrl}/api/member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
          userId: user.id,
          clubId: clubID,
        }),
        credentials: 'include',
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
            
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id,
            clubId: clubID,
            ascendancy: parseFloat(ascendancy),
            camaraderie: parseFloat(camaraderie),
            legacy: parseFloat(legacy),
            prestige: parseFloat(prestige),
            obligation: parseFloat(obligation),
            review: review,
            total: total,
          }),
        });

        const data = await response.json();
        if(data.success) { 
          console.log("Club rated:");
          clearInputs();
          setRate(false);
          setHasRated(true)
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };




  const rating = ( <div className="rating-form">
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
            <div className = "rating-input-group">
              <label htmlFor ="Review" className = "rating-label">
                Review Here
              </label>
              <textarea
                id = "review"
                value={review}
                onChange ={(e)=>{setReview(e.target.value)}}>
              </textarea>
            </div>

            <button className="submit-rating-button" type="submit">
              Submit
            </button>
          </form>
        </div>)









  return (
    <>
      <Navbar />
      {!rate ? (

        <div>


          <div className="clubNameHeader">
            <div className="clubNameHeader topPart">
              {!fetching ? (<h1 className="clubNameText">{clubData?.clubName}</h1>): <h1>Loading...</h1>}
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
            {!fetching ? (
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
            ): <div className="ratings">
                <h1 className="ratingBox ratingBox1">
                  Ascendancy: (<span>None Yet</span>)
                </h1>
                <br />
                <h1 className="ratingBox ratingBox2">
                  Camaraderie: (<span>None Yet</span>)
                </h1>
                <br />
                <h1 className="ratingBox ratingBox3">
                  Prestige: (<span>None Yet</span>)
                </h1>
                <br />
                <h1 className="ratingBox ratingBox4">
                  Obligation: (<span>None Yet</span>)
                </h1>
                <br />
                <h1 className="ratingBox ratingBox5">
                  Legacy: (<span>None Yet</span>)
                </h1>
                <br />
                <h1 className="ratingBox ratingBox6">
                  Overall: (<span>None Yet</span>)
                </h1>
              </div>}

            <img className="featherIcon featherIconClubPage" src={feather} />
            <p className="description">
              {!clubData ? "Loading..." : (clubData.clubDesc || "No description available.")}
            </p>
            <img
              className="featherIcon featherIconClubPage"
              id="featherIcon2clubpage"
              src={feather}
            />
           {!fetching ? ( <div className="rightScreen">

              {(isLeader || onBoard ) && (<button onClick = {()=>navigate(`/editClub/${clubID}`)}>Manage Club</button>)}
              
              {isAuthenticated && !role && !fetching ? (
                <button className="clubPageBtn" onClick={()=>handleJoin()}>
                  Join Club
                </button>
              ) : null}
              <br />

              
              {isAuthenticated && (
                !hasRated ? (
                  <button
                    className="clubPageBtn"
                    onClick={() => {
                      if(!hasRated){
                        setRate(true);
                      }else{
                        console.log("hi")
                      }
                    }}
                  >
                    Rate Club
                  </button>
                ) : (
                  <div>
                    <button onClick={() => {navigate(`/viewRating/${clubID}`)}}>
                      View your Reviews and Ratings
                    </button>

          
                    
                  </div>
                )
              )}
              
              <br></br>
              <br></br>
              <h1>Details:</h1>
              <br></br>
              <br></br>
              <button 
                onClick={() => navigate(`/UserPage/${clubData?.leader}`)}
                style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
              >
                <p>Club President: {clubData?.leaderName}</p>
              </button>
              <br></br>
              {clubData ? (<p>Created: {formatDate(clubData.created_at)}</p>) : null}
              <br></br>
              <br></br>
              {<>
                {
                  <> 
                  <h1>Primary Flair</h1>
                  <Flair Flair = {primaryFlair} ClubID={clubID} primary = {true} dlt = {false}/> 
                  </>
                  }

              {flairs ? ( flairs.map((flair, idx) => <Flair primary = {false} key={idx} dlt = {false} Flair = {flair} ClubID={clubID} />)) : null}
              </>}

              <div><button onClick = {()=>navigate(`/rating/${clubID}/${clubData?.clubName}`)}>View all ratings</button></div>


            </div>): <h1>Loading...</h1>}



          </div>
          
        </div> 
        


      ) : (rating)}
    </>
  );
};

export default ClubPage;