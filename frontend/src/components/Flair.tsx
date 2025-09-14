import React from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts';
import './Flair.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

interface props{
    Flair: string;
    ClubID?: string;
    dlt?: boolean;
    chngprm?: boolean;
    primary: boolean;

}

const Flair = ({Flair, ClubID = "", dlt = true, chngprm = false, primary}: props) => {

const {user, loading, isAuthenticated, } = useAuth();

const handleDelete = async () => {
  const token = localStorage.getItem("authToken");

  try {
    if (user && ClubID) {
      const response = await fetch(`${backendUrl}/api/flair/${Flair}/${ClubID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        console.log("Flair deleted successfully:", data.result);
      } else {
        console.log("Server error:", data.error);
      }

    window.location.reload();
    }
  } catch (err) {
    console.log("Request failed:", err);
  }
};

const handlePrimary = async () => {
  const token = localStorage.getItem("authToken");

  try {
    if (user && ClubID) {
      const response = await fetch(`${backendUrl}/api/flair`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify({
          newPrimary: Flair,
          clubID: ClubID
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log("Flair updated successfully:");
      } else {
        console.log("Server error:", data.error);
      }

    window.location.reload();
    }
  } catch (err) {
    console.log("Request failed:", err);
  }
};

  return (
    <div className="flair-container">
      <div className={primary ? "flair primary-flair" : "flair"}>
        <span className="flair-text">{Flair}</span>
        {dlt && (
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            data-tooltip="Delete this flair"
          >
            <span className="delete-icon">×</span>
          </button>
        )}
        {chngprm && (
          <button 
            className="primary-btn" 
            onClick={handlePrimary}
            data-tooltip="Make primary flair"
          >
            <span className="crown-icon">♛</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Flair