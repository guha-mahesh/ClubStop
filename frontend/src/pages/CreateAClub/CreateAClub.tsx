//This is a page that lets you create a club

import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { FaInstagram } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../../contexts/AuthContexts'
import linktree from '../../assets/linktree-logo-icon.svg'
import bg from '../../assets/CreateClubBackground.png'
import Flair from "../../components/Flair";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

interface University{
  name: string;
}

interface Flair{
  flair_name: string;
}

const CreateAClub: React.FC = () => {
  const [clubName, setClubName] = useState<string>("");
  const [clubDesc, setClubDesc] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [instagram, setInstagram] = useState<string>("")
  const [linkTree, setLinkTree] = useState<string>("")
  const [flairSrch, setFlairSrch] = useState<string>("")
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const userRef = useRef<HTMLInputElement | null>(null);
  const {user, isAuthenticated, loading, school} = useAuth();
  const [selected, setSelected] = useState("")
  const [flairs, setFlairs] = useState<Flair[] | null>(null);
  const [clubId, setClubId]= useState("")
  
  useEffect(() => {
    
    const fetchFlairData = async () => {
      console.log("fetching Flairs")
      const res = await fetch(`${backendUrl}/api/flair`);
      const data = await res.json();
      if (data.success) setFlairs(data.flairs);
    };
    
    if (userRef.current) {
      userRef.current.focus();
    }
    fetchFlairData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/Login")
    }
  }, [isAuthenticated,loading, navigate]);

  interface ClubCreation {
    name: string;
    description: string;
    user: string;
    school: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      if (user){
        const response = await fetch(`${backendUrl}/api/club`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
          body: JSON.stringify({userId: user.id, clubName: clubName, clubDesc: clubDesc, school: school, instagram: instagram, linkTree: linkTree, primaryFlair: selected }),
        });
        const data = await response.json();

        if (data.success){
          console.log("Success Creating Club");
          console.log(data.clubId);
          setClubId(data.clubId)
          setSuccess(true);
          navigate(`/club/${data.clubId}`)
        }else{
          console.log(data.error)
        }
      }
    } catch (error) {
      console.error("Error creating club:", error);
      setErrorMessage("Error creating club. Please try again.");
    }
  };

  const filteredFlairs = flairSrch.trim()
    ? flairs?.filter((flair) =>
        flair.flair_name.toLowerCase().includes(flairSrch.trim().toLowerCase())
      ).slice(0,3)
    : null;


  return (
    <>
      <Navbar />
      <div className="create-club-container">
        <img src={bg} className="background-decoration" alt="Background decoration" />
        
        {!success ? (
          <div className="club-creation-card">
            <div className="form-header">
              <h1 className="form-title">Create Your Club</h1>
              <p className="form-subtitle">Build your community and connect with like-minded students</p>
            </div>

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="clubName" className="input-label">
                  Club Name
                </label>
                <input
                  ref={userRef}
                  id="clubName"
                  maxLength={20}
                  required
                  type="text"
                  value={clubName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setClubName(e.target.value)
                  }
                  className="text-input"
                  placeholder="Enter your club's name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="clubDesc" className="input-label">
                  Club Description
                </label>
                <textarea
                  id="clubDesc"
                  required
                  value={clubDesc}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setClubDesc(e.target.value)
                  }
                  className="textarea-input"
                  placeholder="Describe your club's purpose, activities, and what makes it special..."
                />
              </div>
              <div className="input-group">
                <label htmlFor="flair" className="input-label">
                  Primary Flair
                </label>
                <input
                  id="flair"
                  required
                  value={flairSrch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFlairSrch(e.target.value)
                  }
                  className = "text-input"

                  placeholder="Search for the Flair that best matches your Club!"
                />
              </div>
            <>
  {filteredFlairs && filteredFlairs.length > 0 ? (
    <div className="searchItems">
      {filteredFlairs.map((flair, idx) => (
        <div onClick = {()=>setSelected(flair.flair_name)}className = "searchItem" key={idx}>
          {flair.flair_name}
        </div>
      ))}
      
    </div>
  ) : null}
</>
{selected ? (<div className = "selectedBox"><h1 className = "selectedFlair">Selected:</h1> <Flair Flair ={selected} dlt = {false} primary = {true}></Flair></div>): (null)}
              <div className="social-links-section">
                <h3 className="social-links-title">Connect Your Socials</h3>
                <div className="social-links-grid">
                  <div className="social-input-group">
                    <div className="social-icon-container">
                      <FaInstagram className="instagram-icon" />
                    </div>
                    <input
                      id="instagram"
                      value={instagram}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInstagram(e.target.value)
                      }
                      className="social-input"
                      placeholder="@username"
                    />
                  </div>

                  <div className="social-input-group">
                    <div className="social-icon-container">
                      <img className="linktree-icon" src={linktree} alt="Linktree" />
                    </div>
                    <input
                      id="linktree"
                      value={linkTree}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLinkTree(e.target.value)
                      }
                      className="social-input"
                      placeholder="linktr.ee/yourclub"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-button">
                Create Club
              </button>
            </form>
          </div>
        ) : (
          <div className="club-creation-card">
            <div className="success-section">
              <h1 className="success-title">🎉 Club Created!</h1>
              <p className="success-description">
                Your club has been successfully created and is ready for members.
              </p>
              <button 
                onClick={() => navigate(`/club/${clubId}`)} 
                className="club-link-button"
              >
                Visit Your Club →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAClub;