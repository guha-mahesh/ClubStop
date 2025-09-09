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
  School?: string;
}

interface Flair{
  flair_name: string;
}

interface Club {
  clubName: string;
  club_id: string;
  School: string;
}
const SearchBar = ({api, placeholder = "Ex. Computer Science...", School = ""}:props) => {



const [unis, setUnis] = useState<University[] | null>(null)

  const [fetching, setFetching] = useState(true)
  const navigate = useNavigate();
  const [flairs, setFlairs] = useState<Flair[] | null>(null)
  const [clubs, setClubs] = useState<Club[] | null>(null)
  const [filteredClubs, setFilteredClubs] = useState<Club[] | null>(null)
  const [filteredUnis, setFilteredUnis] = useState<University[] | null>(null)
  const [specified, setSpecified] = useState(School)

  const [clubSrch, setClubSrch] = useState("")
  const [uniSrch, setUniSrch] = useState("")


useEffect(()=>{ 

  const fetchFlairData = async ()=>{



          const result = await fetch(`${backendUrl}/api/flair`,
            {method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          
          }
    
    
          )
    
          const data = await result.json();
    
          if (data.success){
            setFlairs(data.flairs)


          }else{
            console.log(data.error)
          }
    
        }

        const fetchClubData = async ()=>{

            const result = await fetch(`${backendUrl}/api/club/""`,
            {method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          
          }
    
    
          )
    
          const data = await result.json();
    
          if (data.success){
            console.log(data.clubData)
            setClubs(data.clubData)



          }else{
            console.log(data.error)
          }



        }



        const fetchUniData = async ()=>{
      const result = await fetch(`${backendUrl}/api/university`,
        {method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      
      }


      )

      const data = await result.json();

      if (data.success){
        setUnis(data.unis)
        console.log("success")
      }else{
        console.log(data.error)
      }



    }

        if(api.includes("clubs")){
          
        fetchClubData();
        }
        if(api.includes("flairs")){
          fetchFlairData();
        }

        if (api.includes("universities")){
          fetchUniData();
        }
        
        setFetching(false)








    },[])

  useEffect(() => {
  if (!clubSrch.trim()) {
    setFilteredClubs(null);
    return;
  }

  const results = clubs?.filter(
    (club) =>
      club.clubName.toLowerCase().startsWith(clubSrch.toLowerCase()) &&
      club.School === School
  );
  console.log(clubSrch)
  console.log("reuslts:",results)
  setFilteredClubs(results || null);
}, [clubSrch, clubs, School]);

useEffect(() => {
  if (!uniSrch.trim()) {
    setFilteredUnis(null);
    return;
  }

  const results = unis?.filter((uni) =>
    uni.name.toLowerCase().startsWith(uniSrch.toLowerCase())
  );
  setFilteredUnis(results || null);
}, [uniSrch, unis]);

  return (
    <>

    {specified ? (<>
  <div className={!filteredClubs ? "search" : "search searchCurve"}>
    <input 
      type="text" 
      name="query" 
      placeholder={placeholder}
      onChange={(e) => setClubSrch(e.target.value)}
    />
    <button type="submit" className="search-button">🔎</button>
    
  </div>
  {filteredClubs && (
      <div className="searchResults">
        {filteredClubs.map((club, idx) => (
          <SearchItem 
            type = {0}
            key={idx}
            club={club.clubName} 
            school={club.School} 
            id={club.club_id} 
          />
        ))}
      </div>
    )}</>
) : 


(
<>
<div className={!filteredUnis? "search" : "search searchCurve"}>
    <input 
      type="text" 
      name="query" 
      placeholder={placeholder}
      onChange={(e)=>setUniSrch(e.target.value)}
    />
    <button type="submit" className="search-button">🔎</button>
    
  </div>
  {filteredUnis && (
      <div className="searchResults">
        {filteredUnis.map((uni, idx) => (
          <SearchItem 
            key={idx}
            type = {1}
            uniName={uni.name}

          />
        ))}
      </div>
    )}

</>

)}

    </>
  );
};

export default SearchBar; 