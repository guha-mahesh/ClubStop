import React, { useEffect, useState } from "react";
import searchIcon from "../assets/search.png";

interface Props {
  placeholder: string;
  onChange: (value: string) => void;
}

interface ClubData {
  _id: string;
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
          {suggestion.map((name, idx) => {
            const club = clubData.find((club) => club.ClubName === name);
            return (
              <a key={idx} href={`/club/${club?._id}`}>
                {name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
