import React from "react";
import Oval from "./Oval";
import Search from "./Search";
import homeIcon from "../assets/home.png";

const ScreenHeader = () => {
  return (
    <div className="Top-Screen">
      <div className="ovarian-goats">
        <Oval
          color="selected"
          header="Ratings"
          onPress={console.log}
          reason="forButton"
        ></Oval>
        <Oval
          header="Photo Gallery"
          onPress={console.log}
          reason="forButton"
        ></Oval>
        <Oval
          header="Description"
          onPress={console.log}
          reason="forButton"
        ></Oval>
      </div>
      <div className="SearchFlex">
        <Search placeholder="Search for Clubs, Orgs, etc"></Search>
        <img className="home" src={homeIcon} />
      </div>
    </div>
  );
};

export default ScreenHeader;
