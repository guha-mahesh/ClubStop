import { useState } from "react";
import Oval from "./components/Oval";
import Search from "./components/Search";
import Ratings from "./components/Ratings";
import puffinImage from "./assets/puffin.png";

function App() {
  return (
    <div>
      <div className="Top-Screen">
        <div className="ovarian-goats">
          <Oval
            color="red"
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
            color="blue"
            header="Description"
            onPress={console.log}
            reason="forButton"
          ></Oval>
        </div>
        <div className="SearchFlex">
          <Search placeholder="Search for Clubs, Orgs, etc"></Search>
        </div>
      </div>
      <div className="Middle-Screen">
        <Ratings
          id="Camraderie"
          header="Camraderie"
          rating="92"
          color="navy"
        ></Ratings>
        <Ratings
          id="Ascendancy"
          header="Ascendancy"
          rating="92"
          color="swamp"
        ></Ratings>
        <img id="Puffin" src={puffinImage} />
        <Ratings
          id="Prestige"
          header="Prestige"
          rating="92"
          color="orange"
        ></Ratings>
        <Ratings
          id="Obligation"
          header="Obligation"
          rating="92"
          color="green"
        ></Ratings>
        <Ratings
          id="Legacy"
          header="Legacy"
          rating="92"
          color="pinkred"
        ></Ratings>
        <div className="Positive">
          <h2 className="ReviewHeading">Top Review</h2>
          <p className="RatingText">
            ““The way they sucked my dick was EMPOWERING“”
          </p>
        </div>
        <div className="Negative">
          <h2 className="ReviewHeading">Bottom Review</h2>
          <p className="RatingText">““The way they ignored my dick was MID“”</p>
        </div>
      </div>
    </div>
  );
}

export default App;
