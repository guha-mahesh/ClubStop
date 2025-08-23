import React from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContexts';
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';
interface props{
    Flair: string;
    ClubID?: string;
    dlt?: boolean
}

const Flair = ({Flair, ClubID = "", dlt = true}: props) => {


const {user, loading, isAuthenticated} = useAuth();
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



    
  return (
    <>
    <h1>Flair</h1>
    <div>{Flair}</div>
    {dlt && (<button onClick = {handleDelete}>X</button>)}
    </>
  )
}

export default Flair