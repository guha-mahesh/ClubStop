import React from "react";
import Oval from "./Oval";
interface Props {
  rating: string;
  color?: string;
  header: string;
}
const Ratings = ({ rating, color, header = "white" }: Props) => {
  return (
    <div className="rating">
      <h1 className="Attribute">{header}</h1>
      <Oval
        header="92"
        onPress={console.log}
        reason="forRating"
        color={color}
      ></Oval>
    </div>
  );
};

export default Ratings;
