//This is a page that lets you create a club

import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../../contexts/AuthContexts'
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';






const CreateAClub: React.FC = () => {
  const [clubName, setClubName] = useState<string>("");
  const [clubSchool, setClubSchool] = useState<string>("");
  const [clubDesc, setClubDesc] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const userRef = useRef<HTMLInputElement | null>(null);
  const {user, isAuthenticated, loading} = useAuth();
  const [clubId, setClubId]= useState("")

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
    
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
      body: JSON.stringify({userId: user.id, clubName: clubName, clubDesc: clubDesc, school: clubSchool  }),
    });
    const data = await response.json();

    if (data.success){
      console.log("Success Creating Club");
      console.log(data.clubId);
      setClubId(data.clubId)
      setSuccess(true);
    }else{
      console.log(data.error)
    }
}
     

    } catch (error) {
      console.error("Error creating club:", error);
      setErrorMessage("Error creating club. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
  {
    !success ? (
      <form onSubmit={handleSubmit} className="club-form">
        <label htmlFor="clubName" className="label">
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
          className="input-field"
        />

        <label htmlFor="clubDesc" className="label">
          Club Description
        </label>
        <textarea
          id="clubDesc"
          required
          value={clubDesc}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setClubDesc(e.target.value)
          }
          className="textarea-field"
        />
        <label htmlFor="clubSchool" className="label">
          What University/School is this club at?
        </label>
        <input
          ref={userRef}
          id="clubSchool"
          maxLength={30}
          required
          type="text"
          value={clubSchool}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setClubSchool(e.target.value)
          }
          className="input-field"
        />

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    ) : (
      <section className="success-message">
        <h1>Club Created Successfully!</h1>
        <p>
          <button 
            onClick={() => navigate(`/club/${clubId}`)} 
            className="home-link"
            style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
          >
            Go • to • Club
          </button>
        </p>
      </section>
    )
  }
</div>
    </>
  );
};

export default CreateAClub;
