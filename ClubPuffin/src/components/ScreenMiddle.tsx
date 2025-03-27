import React from "react";
import Ratings from "./Ratings";
import Puffin from "./Puffin";
import Oval from "./Oval";

const ScreenMiddle = () => {
  return (
    <div className="Middle-Screen">
      <Puffin
        getRandomInt={(min: number, max: number) => {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }}
      />
    </div>
  );
};

export default ScreenMiddle;
