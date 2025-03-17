import React from "react";
import searchIcon from "../assets/search.png";
interface Props {
  placeholder: string;
}
const Search = ({ placeholder }: Props) => {
  return (
    <div className="search">
      <img className="icon" src={searchIcon} />
      <input className="textbox" placeholder={placeholder} />
    </div>
  );
};

export default Search;
