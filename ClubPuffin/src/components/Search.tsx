import React from "react";
import searchIcon from "../assets/search.png";
interface Props {
  placeholder: string;
  onChange: (value: string) => void;
}
const Search = ({ placeholder, onChange }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange(e.currentTarget.value);
    }
  };
  return (
    <div className="search">
      <input
        className="textbox"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onChange={() => console.log(localStorage)}
      />
    </div>
  );
};

export default Search;
