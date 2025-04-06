import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../Global";
import Clubs from "../clubs/ClubCard";
import ScreenHeader from "../components/ScreenHeader";

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const { signed, setSigned } = useGlobalContext();

  useEffect(() => {
    const storedSigned = localStorage.getItem("signed") === "true";
    setSigned(storedSigned);

    const user = localStorage.getItem("user"); // Get only the username or user identifier

    if (storedSigned && user) {
      fetch(`http://localhost:5000/users?user=${encodeURIComponent(user)}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [signed, setSigned]);

  return (
    <div>
      <ScreenHeader></ScreenHeader>
      {userData ? (
        <div>
          <p>Username: {userData.username}</p>
          <div>
            <h3>Clubs:</h3>
            <ul>
              {userData.clubs.map((club) => (
                <li key={club.clubId}>
                  <Clubs id={club.clubId} />
                </li>
              ))}
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
