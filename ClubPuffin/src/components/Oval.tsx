import React from "react";
interface Props {
  color?: string;
  header: string;
  onPress: () => void;
}
const Oval = ({ color = "", header, onPress }: Props) => {
  return (
    <div className={"oval oval-" + color}>
      <h1 className={"h1 h1-" + color}>{header}</h1>
    </div>
  );
};

export default Oval;
