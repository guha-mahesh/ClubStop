//the home page,

import ScreenHeader from "../../components/ScreenHeader";
import Search from "../../components/Search/Search";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Puffin from "../../assets/puffin.png";
import {useAuth} from "../../contexts/AuthContexts"


interface UserData {
  username: string;
  password: string;
}

const Home = () => {
  const {user, login, logout, isAuthenticated} = useAuth();



  

  const navigate = useNavigate();

  return (
    <>
      <div>
        <ScreenHeader />

        <div className="content-app">
          <div className="left-section">
            <h1>
              Hey {user ? user.username : "Guest"}! Looking for a Club
              at <br /> <span>Northeastern?</span>
            </h1>

            <Search
              onChange={() => {
                console.log("hi");
              }}
              reason="homePage"
              placeholder="Search for what you're interested in (Computer Science, Football, etc"
            />

            { !isAuthenticated ?(
              <button onClick={() => navigate("/Login")} className="login-btn">
                Or log in to join Club →
              </button>
            ): (null)}

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
