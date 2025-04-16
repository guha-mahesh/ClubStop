//the home page,

import ScreenHeader from "../../components/ScreenHeader";
import Search from "../../components/Search/Search";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Puffin from "../../assets/puffin.png";

import { useGlobalContext } from "../../Global";

interface UserData {
  username: string;
  password: string;
}

const Home = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { signed, setSigned } = useGlobalContext();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const storedSigned = localStorage.getItem("signed") === "true";
    const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage

    if (storedSigned === true) {
      setSigned(true);
    } else {
      setSigned(false);
    }

    if (user && token) {
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
        .then((data) => setUserData(data))
        .catch((error) => {
          console.error("Error:", error);
          setUserData(null); // Set userData to null if an error occurs
          localStorage.clear();
          setSigned(false);
          navigate("/");
        });
    }
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div>
        <ScreenHeader />

        <div className="content-app">
          <div className="left-section">
            <h1>
              Hey {userData ? userData.username : "Guest"}! Looking for a Club
              at <br /> <span>Northeastern?</span>
            </h1>

            <Search
              onChange={() => {
                console.log("hi");
              }}
              reason="homePage"
              placeholder="Search for what you're interested in (Computer Science, Football, etc"
            />

            {!signed ? (
              <button onClick={() => navigate("/Login")} className="login-btn">
                Or log in to join Club →
              </button>
            ) : null}

            <div className="puffin">
              <img src={Puffin} alt="Puffin Mascot" />
            </div>
          </div>

          <div className="right-section">
            <h2>Popular Club</h2>

            <div className="club-list">
              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>Club</span>
              </div>

              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>Club</span>
              </div>

              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>Club</span>
              </div>

              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>Club</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
