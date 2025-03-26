import React from "react";
import Oval from "./Oval";
import Search from "./Search";
import homeIcon from "../assets/home.png";
import logo from "../assets/logo.png";

const ScreenHeader = () => {
  return (
    <div className="Top-Screen">
      <img className="logoCP" src={logo} />
      <div className="SearchFlex">
        <Search placeholder="Search for Clubs, Orgs, etc"></Search>
        <img className="home" src={homeIcon} />
      </div>
    </div>
  );
};

export default ScreenHeader;
