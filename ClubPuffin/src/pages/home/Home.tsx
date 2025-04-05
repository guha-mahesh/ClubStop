import ScreenHeader from "../../components/ScreenHeader";
import Search from "../../components/Search";
import { showAlert } from "../../backend/handleSearch";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Puffin from "../../assets/puffin.png";
import { checkJwt } from "../../backend/CheckJWT";
import { useGlobalContext } from "../../Global";

interface UserData {
  username: string;
  password: string;
  description?: string;
}

const Home = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { signed, setSigned } = useGlobalContext();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      fetch(`http://localhost:5000/users?user=${encodeURIComponent(user)}`)
        .then((response) => response.json())
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error:", error));
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
              Hey {userData ? userData.username : "Guest"}! Looking for a bruh
              at <br /> <span>Northeastern?</span>
            </h1>
            <p>Search for what you're interested in:</p>

            <Search onChange={showAlert} placeholder="Computer Science" />

            {!signed ? (
              <button onClick={() => console.log(signed)} className="login-btn">
                Or log in to join bruh →
              </button>
            ) : null}

            <div className="puffin">
              <img src={Puffin} alt="Puffin Mascot" />
            </div>
          </div>

          <div className="right-section">
            <h2>Popular bruh</h2>

            <div className="club-list">
              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>bruh</span>
              </div>

              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>bruh</span>
              </div>

              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>bruh</span>
              </div>

              <div className="club">
                <img src="club-placeholder.png" alt="Club Icon" />
                <span>bruh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
