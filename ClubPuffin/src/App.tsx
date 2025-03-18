import { useState } from "react";
import Oval from "./components/Oval";
import Search from "./components/Search";
import Ratings from "./components/Ratings";
import homeIcon from "./assets/home.png";
import Puffin from "./components/Puffin";

function App() {
  return (
    <div>
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
      <div className="Middle-Screen">
        <Ratings
          id="Camraderie"
          header="Camraderie"
          rating="81"
          color="navy"
        ></Ratings>
        <Ratings
          id="Ascendancy"
          header="Ascendancy"
          rating="73"
          color="swamp"
        ></Ratings>
        <Puffin
          getRandomInt={(min: number, max: number) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }}
        />
        <Ratings
          id="Prestige"
          header="Prestige"
          rating="46"
          color="orange"
        ></Ratings>
        <Ratings
          id="Obligation"
          header="Obligation"
          rating="94"
          color="green"
        ></Ratings>
        <Ratings
          id="Legacy"
          header="Legacy"
          rating="100"
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
