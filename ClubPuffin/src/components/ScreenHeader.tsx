import React from "react";
import Oval from "./Oval";
import Search from "./Search";
import homeIcon from "../assets/home.png";
import logo from "../assets/logo.png";

const ScreenHeader = () => {
  return (
    <div className="Top-Screen">
      <img className="logoCP" src={logo} />
      <div className="navButtonRow">
        <button className="navButton">Home</button>
        <button className="navButton">Clubs</button>
        <button className="navButton">Clubs</button>
        <button className="navButton">Clubs</button>
      </div>

      <Search placeholder="Search for Clubs, Orgs, etc"></Search>
    </div>
  );
};

export default ScreenHeader;
