import React from "react";
import Ratings from "./Ratings";
import Puffin from "./Puffin";
import Oval from "./Oval";

const ScreenMiddle = () => {
  return (
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
    </div>
  );
};

export default ScreenMiddle;
