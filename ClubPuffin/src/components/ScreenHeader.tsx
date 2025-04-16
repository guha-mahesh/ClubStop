//just the top header
import React, { useEffect } from "react";
import Search from "./Search/Search";
import Profile from "./Profile/Profile";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ClubStop.png";
import { useGlobalContext } from "../Global";
import axios from "axios";

interface Props {
  searchy?: boolean;
}

const ScreenHeader = ({ searchy = false }: Props) => {
  const { signed, setSigned } = useGlobalContext();

  const navigate = useNavigate();

  const RandomClub = () => {
    fetch("http://localhost:5000/randomClub")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch random club");
        }
        return response.json();
      })
      .then((data) => {
        const id = data._id;
        navigate(`/club/${id}`);
      })
      .catch((error) => {
        console.error("Error fetching random club:", error);
      });
  };

  const checkSign = () => {
    console.log(localStorage);
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");

    if (name && token) {
      setSigned(true);
    }
  };

  useEffect(() => {
    checkSign();
  }, []);

  return (
    <nav className="Top-Screen">
      <div className="topLeft">
        <div className="nav-left">
          <a href="/">
            <img className="logoCP" src={logo} alt="Logo" />
          </a>
        </div>

        <div className="nav-middle">
          <button className="navButton">IdeaBoard</button>
          <button onClick={RandomClub} className="navButton">
            RandomClub
          </button>
        </div>
      </div>
      <Search
        onChange={() => console.log("hi")}
        placeholder="Search for Clubs"
      />

      <div className="nav-right">
        {!signed ? (
          <button
            className="navButton"
            onClick={() => {
              navigate("/Login");
            }}
          >
            Sign In
          </button>
        ) : (
          <button
            className="navButton"
            onClick={() => {
              setSigned(false);
              localStorage.clear();
              navigate("/");
              window.location.reload();
            }}
          >
            Sign Out
          </button>
        )}

        {signed ? <Profile /> : null}
      </div>
    </nav>
  );
};

export default ScreenHeader;
