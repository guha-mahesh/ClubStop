//the search bar with it's functionss

import React, { useEffect, useState } from "react";

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
  const [filteredClubs, setFilteredClubs] = useState<ClubData[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/clubs")
      .then((res) => res.json())
      .then((data) => {
        setClubData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);

    if (value.trim()) {
      const matched = clubData.filter((club) =>
        club.ClubName.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredClubs(matched);
    } else {
      setFilteredClubs([]);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedClub = clubData.find((club) => club._id === selectedId);
    if (selectedClub) {
      window.location.href = `/club/${selectedClub._id}`;
    }
  };

  return (
    <div className="searchbar">
      <input
        className="textboxbar"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleSearch}
      />

      {filteredClubs.length > 0 && (
        <select onChange={handleSelect} className="dropdown">
          <option value="">Select a club</option>
          {filteredClubs.map((club) => (
            <option key={club._id} value={club._id}>
              {club.ClubName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Search;
