import React from "react";
import Oval from "./Oval";
import Search from "./Search";
import homeIcon from "../assets/home.png";
import Profile from "./Profile";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

interface Props {
  searchy?: boolean;
}

const ScreenHeader = ({ searchy = false }: Props) => {
  const navigate = useNavigate();
  return (
    <nav className="Top-Screen">
      <div className="nav-left">
        <img className="logoCP" src={logo} />
      </div>

      <div className="nav-middle">
        <button className="navButton">Home</button>
        <button className="navButton">Clubs</button>
        <button className="navButton">Clubs</button>
        <button className="navButton">Clubs</button>
      </div>

      <Search
        onChange={() => console.log("hi")}
        placeholder="Search for Clubs, Orgs, etc"
      ></Search>

      <div className="nav-right">
        <button onClick={() => navigate("/Register")}>Sign Up!</button>
        <Profile></Profile>
      </div>
    </nav>
  );
};
export default ScreenHeader;

/*
        <nav>
          <div className="nav-left">
            <a href="#">Club Puffin</a>
            <a href="#">Home</a>
            <a href="#">Clubs</a>
          </div>

          <div className="nav-right">
            <span>buy me a coffee lol if you want</span>
          </div>
        </nav>
*/
