//the puffin, the random number dictates the CSS class and thusly the location of the puffin on the page :3

import React from "react";
import puffinImage from "../assets/puffin.png";

interface Props {
  getRandomInt: (min: number, max: number) => number;
}
const Puffin = ({ getRandomInt }: Props) => {
  const randomNumber = getRandomInt(1, 5).toString();
  return (
    <img className={"Puffin-" + randomNumber} id="Puffin" src={puffinImage} />
  );
};

export default Puffin;
