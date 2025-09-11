import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import SearchItem from './SearchItem';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

interface University{
  name: string;
}

interface props{
  api: string[];
  placeholder?: string;
  setSpecified: (e: string) => void;
  setApis: (apis: string[] | null) => void;
 specified?:string;
}

interface Flair{
  flair_name: string;
}

interface Club {
  clubName: string;
  club_id: string;
  School: string;
}
const SearchBar = ({api, placeholder = "Ex. Computer Science...", specified = "", setSpecified, setApis}: props) => {
  const [unis, setUnis] = useState<University[] | null>(null);
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [flairs, setFlairs] = useState<Flair[] | null>(null);

  const [clubSrch, setClubSrch] = useState("");
  const [uniSrch, setUniSrch] = useState("");



  useEffect(() => {

    const fetchFlairData = async () => {
      console.log("fetching Flairs")
      const res = await fetch(`${backendUrl}/api/flair`);
      const data = await res.json();
      if (data.success) setFlairs(data.flairs);
    };

    const fetchClubData = async () => {
      console.log("fetching clubs")
      const res = await fetch(`${backendUrl}/api/club/""`);
      const data = await res.json();
      if (data.success) setClubs(data.clubData);
    };

    const fetchUniData = async () => {
      console.log("fetching unis")
      const res = await fetch(`${backendUrl}/api/university`);
      const data = await res.json();
      if (data.success) {
        setUnis(data.unis);
      }
    };

    if (api.includes("clubs")) fetchClubData();
    if (api.includes("flairs")) fetchFlairData();
    if (api.includes("universities")) fetchUniData();
  }, [api]);

  const filteredResults = clubSrch.trim()
  ? [
      ...(clubs
        ?.filter(
          (club) =>
            club.clubName.toLowerCase().includes(clubSrch.toLowerCase()) &&
            club.School === specified
        ) || []),
      ...(flairs
        ?.filter((flair) =>
          flair.flair_name.toLowerCase().includes(clubSrch.toLowerCase())
        ) || []),
    ]
  : [];
  const displayedResults = filteredResults.slice(0, 5);


  const filteredUnis = uniSrch.trim()
    ? unis?.filter((uni) =>
        uni.name.toLowerCase().includes(uniSrch.trim().toLowerCase())
      ).slice(0,5)
    : null;





  return (
    <>
      {specified ? (
        <>
          <div className={!filteredResults ? "search" : "search searchCurve"}>
            <input
              type="text"
              placeholder={placeholder}
              onChange={(e) => setClubSrch(e.target.value)}
              value={clubSrch}
            />
            <button type="submit" className="search-button">
              🔎
            </button>
          </div>
          {filteredResults && (
            <div className="searchResults">
  {displayedResults.map((item, idx) =>
    "club_id" in item ? (
      <SearchItem
        key={idx}
        type={0} 
        club={item.clubName}
        school={item.School}
        id={item.club_id}
      />
    ) : (
      <SearchItem
        key={idx}
        type={2} 
        flairName={item.flair_name}
        school = {specified}
      />
    )
  )}
</div>
          )}
        </>
      ) : (
        <>
          <div className={!filteredUnis ? "search" : "search searchCurve"}>
            <input
              type="text"
              placeholder={placeholder}
              onChange={(e) => setUniSrch(e.target.value)}
              value={uniSrch}
            />
            <button type="submit" className="search-button">
              🔎
            </button>
          </div>
          {filteredUnis && (
            <div className="searchResults">
              {filteredUnis.map((uni, idx) => (
                <SearchItem onSelecttwo = {(ls) => setApis(ls)}onSelect = {(name) => setSpecified(name)} key={idx} type={1} uniName={uni.name} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};
export default SearchBar;