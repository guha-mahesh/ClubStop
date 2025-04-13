//the page that a user can view all their joined and created clubs, probably needs clubCard.tsx as components

import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../Global";
import Clubs from "../components/clubs/ClubCard";
import ScreenHeader from "../components/ScreenHeader";
import { useNavigate } from "react-router-dom";

interface Club {
  clubId: string;
  clubName: string;
}

interface UserData {
  username: string;
  password: string;
  clubs: Club[];
}

const MyClubs = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>({
    username: "",
    password: "",
    clubs: [],
  }); // Initializing userData with an empty clubs array
  const { signed, setSigned } = useGlobalContext();

  useEffect(() => {
    const storedSigned = localStorage.getItem("signed") === "true";
    setSigned(storedSigned);

    const user = localStorage.getItem("user");

    if (storedSigned && user) {
      fetch(`http://localhost:5000/users?user=${encodeURIComponent(user)}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Inspect the data here
          setUserData(data);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      navigate("/Login");
    }
  }, [signed, setSigned, navigate]);

  return (
    <div>
      <ScreenHeader />
      {userData ? (
        <div>
          <p>Username: {userData.username}</p>
          <div>
            <h3>Clubs:</h3>
            <ul>
              {userData.clubs?.map(
                (
                  club // Use optional chaining
                ) => (
                  <li key={club.clubId}>
                    <Clubs id={club.clubId} />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MyClubs;
