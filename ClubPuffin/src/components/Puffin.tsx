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
