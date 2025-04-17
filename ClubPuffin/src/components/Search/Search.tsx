//the search bar with it's functionss

import React, { useEffect, useState } from "react";

interface Props {
  placeholder: string;
  onChange: (value: string) => void;
  reason?: string;
}

interface ClubData {
  _id: string;
  creator: string;
  ClubName: string;
  ClubDescription?: string;
}

const Search = ({ placeholder, onChange, reason = "" }: Props) => {
  const [clubData, setClubData] = useState<ClubData[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<ClubData[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("/clubs")
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
        className={`textboxbar textboxbar-${reason}`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleSearch}
      />

      {filteredClubs.length > 0 && (
        <ul className={`dropdown dropdown-${reason}`}>
          {filteredClubs.map((club) => (
            <li
              key={club._id}
              className="dropdown-item"
              onClick={() => (window.location.href = `/club/${club._id}`)}
            >
              {club.ClubName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
