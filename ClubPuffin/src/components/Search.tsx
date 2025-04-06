import React, { useEffect, useState } from "react";
import searchIcon from "../assets/search.png";

interface Props {
  placeholder: string;
  onChange: (value: string) => void;
}

interface ClubData {
  creator: string;
  ClubName: string;
  ClubDescription?: string;
}

const Search = ({ placeholder, onChange }: Props) => {
  const [clubData, setClubData] = useState<ClubData[]>([]);
  const [suggestion, setSuggestion] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/clubs")
      .then((res) => res.json())
      .then((data) => {
        setClubData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();

    if (value.trim()) {
      const matchedClubs = clubData
        .filter((club) => club.ClubName.toLowerCase().includes(value))
        .map((club) => club.ClubName);

      setSuggestion(matchedClubs);
    } else {
      setSuggestion([]);
    }
  };

  return (
    <div className="search">
      <input
        className="textbox"
        placeholder={placeholder}
        onChange={handleSearch}
      />
      {suggestion.length > 0 && (
        <div className="suggestions">
          {suggestion.map((name, idx) => (
            <div key={idx}>{name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
