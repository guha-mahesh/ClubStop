import React from "react";
import Oval from "./Oval";
interface Props {
  rating: string;
  color?: string;
  header: string;
  id: string;
}
const Ratings = ({ rating, color, id, header = "white" }: Props) => {
  return (
    <div id={id} className="rating">
      <h1 className="Attribute">{header}</h1>
      <Oval
        header={rating}
        onPress={console.log}
        reason="forRating"
        color={color}
      ></Oval>
    </div>
  );
};

export default Ratings;
