import React from "react";
import Oval from "./Oval";
import Search from "./Search";
import homeIcon from "../assets/home.png";
import logo from "../assets/logo.png";
interface Props {
  searchy?: boolean;
}

const ScreenHeader = ({ searchy = false }: Props) => {
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

      <Search placeholder="Search for Clubs, Orgs, etc"></Search>

      <div className="nav-right">
        <span>buy me a coffee lol if you want</span>
      </div>
    </nav>
  );
};

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

export default ScreenHeader;
