//just the top header
import React, { useEffect } from "react";
import Search from "./Search/Search";
import Profile from "./Profile/Profile";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ClubStop.png";
import {useAuth} from '../contexts/AuthContexts'

import axios from "axios";

interface Props {
  searchy?: boolean;
}

const ScreenHeader = ({ searchy = false }: Props) => {
  const {isAuthenticated, logout, login, user} = useAuth();


  const navigate = useNavigate();


  const checkSign = () => {

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");

    
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
        
        </div>
      </div>
      <Search
        onChange={() => console.log("hi")}
        placeholder="Search for Clubs"
      />

      <div className="nav-right">
        { !isAuthenticated ?(
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

              logout();

            }}
          >
            Sign Out
          </button>
        )}

        <Profile />
      </div>
    </nav>
  );
};

export default ScreenHeader;
