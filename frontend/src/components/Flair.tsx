import React from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';
interface props{
    Flair: string;
    ClubID?: string;
    dlt?: boolean;
    chngprm?: boolean;
    primary: boolean;
}

const Flair = ({Flair, ClubID = "", dlt = true,chngprm = false, primary}: props) => {


const {user, loading, isAuthenticated, } = useAuth();
const handleDelete = async () => {
  const token = localStorage.getItem("authToken");

  try {
    if (user && ClubID) {
      const response = await fetch(`${backendUrl}/api/flair/${Flair}/${ClubID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
          Authorization: `Bearer ${token}`,
        },
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
    <>

    <div className = {primary?"flair primary-flair": "flair" }>{Flair}</div>
    {dlt && (<button onClick = {handleDelete}>X</button>)}
    {chngprm && (<button onClick = {handlePrimary}>Make Primary</button>)}
    </>
  )
}

export default Flair