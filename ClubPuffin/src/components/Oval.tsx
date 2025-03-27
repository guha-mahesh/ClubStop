import React from "react";
interface Props {
  color?: string;
  header: string;
  reason: string;
  onPress: () => void;
}
const Oval = ({ color = "", header, onPress, reason }: Props) => {
  return (
    <div className={"oval oval-" + reason + " oval-" + color}>
      <h1
        className={
          "ovalHeading ovalHeading-" + reason + " ovalHeading-" + color
        }
      >
        {header}
      </h1>
    </div>
  );
};

export default Oval;
