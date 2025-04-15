//the page that a user can view all their joined and created clubs, probably needs clubCard.tsx as components

import { useState, useEffect } from "react";
import { useGlobalContext } from "../../Global";
import Clubs from "../../components/clubs/ClubCard";
import ScreenHeader from "../../components/ScreenHeader";
import { useNavigate } from "react-router-dom";

interface Club {
  clubID: string;
  clubName: string;
}
interface ratedClub {
  clubName: string;
  clubID: string;
}
interface joinedClub {
  clubName: string;
  clubID: string;
}

interface UserData {
  username: string;
  password: string;
  clubs: Club[];
  ratedClubs: ratedClub[];
  joinedClubs: joinedClub[];
  _id: string;
}

const MyClubs = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>({
    username: "",
    password: "",
    clubs: [],
    ratedClubs: [],
    joinedClubs: [],
    _id: "",
  });
  const { signed, setSigned } = useGlobalContext();

  useEffect(() => {
    const storedSigned = localStorage.getItem("signed") === "true";
    setSigned(storedSigned);
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage

    if (storedSigned && user) {
      fetch(`http://localhost:5000/users?user=${encodeURIComponent(user)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add the JWT token in Authorization header
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Error occurred");
            });
          }
          return response.json(); // Continue if the response is OK (2xx)
        })
        .then((data) => {
          console.log(data);
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setUserData(null); // Set userData to null if an error occurs
          localStorage.clear();
          setSigned(false);
          navigate("/");
        });
    } else {
      navigate("/Login");
    }
  }, [signed, setSigned, navigate]);
  return (
    <div>
      <ScreenHeader />
      {userData ? (
        <div className="allClubs">
          <div>
            <span>Clubs You've Created:</span>
            <ul>
              {userData.clubs?.map((club) => (
                <li key={club.clubID}>
                  <Clubs id={club.clubID} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span>Clubs You've Joined:</span>
            <ul>
              {userData.joinedClubs?.map((club) => (
                <li key={club.clubID}>
                  <Clubs id={club.clubID} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyClubs;
