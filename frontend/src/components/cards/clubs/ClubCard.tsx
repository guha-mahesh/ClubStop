//this is NOT the page. This is for when the club shows up as a card that links to the page.
//it would be like what shows up when a user goes to "my clubs" or what shows up when you search up computer science clubs

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../../assets/react.svg";
import Flair from "../../Flair";
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

const picPath = import.meta.env.VITE_PATH || ""

interface Props {
  leader: string,
  ClubName: string;
  ClubDescription: String;
  School: String;
  id? : string;
  

}


function Clubs({ leader, ClubName, ClubDescription, School, id = "" }: Props) {
  const [flairPic,setFlairPic] = useState("")
  const [total, setTotal]= useState(0)
  const [ascendancy, setAscendancy]= useState(0)
  const [camaraderie, setCamaraderie]= useState(0)
  const [obligation, setObligation]= useState(0)
  const [prestige, setPrestige]= useState(0)
  const [legacy, setLegacy]= useState(0)
  const [fetching,setFetching] = useState(true)
  const [primaryFlair,setPrimaryFlair] = useState("")
  useEffect(()=>{


    const fetchClub = async ()=>{

       const response = await fetch(`${backendUrl}/api/club/${id}`,  {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success){
          setFlairPic(data.clubData.flairPic)
          setFetching(false)
          console.log("success")
          console.log(data.clubData)
          setTotal(data.clubData.total)
          setAscendancy(data.clubData.ascendancy)
          setCamaraderie(data.clubData.camaraderie)
          setObligation(data.clubData.obligation)
          setPrestige(data.clubData.prestige)
          setLegacy(data.clubData.legacy)
          setPrimaryFlair(data.clubData.primaryFlair)

          

        }else{
          console.log("failure")
          console.log(data.error)
        }
    }

    fetchClub();



  }, [])
  const navigate = useNavigate();

  const handleClubClick = () => {
    if (id) {
      navigate(`/club/${id}`);
    }
  };

  const generateClubDescriptions = () => {
  const metrics = [
    { key: 'ascendancy', value: ascendancy, labels: ['Strong leadership', 'Influential community', 'Leadership focused'] },
    { key: 'camaraderie', value: camaraderie, labels: ['Strong community', 'Great friendships', 'Tight-knit group'] },
    { key: 'obligation', value: obligation, labels: ['High commitment', 'Dedicated members', 'Serious involvement'] },
    { key: 'prestige', value: prestige, labels: ['High prestige', 'Well-respected', 'Elite community'] },
    { key: 'legacy', value: legacy, labels: ['Rich tradition', 'Established history', 'Time-honored'] }
  ];


  const topTwo = metrics
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  return topTwo.map(metric => {

    const labelIndex = metric.value >= 80 ? 0 : metric.value >= 60 ? 1 : 2;
    return metric.labels[labelIndex] || metric.labels[0];
  });
};
const descriptions = generateClubDescriptions();






  return (
    (<div className="card" onClick = {()=>{navigate("/club/"+id)}}>
  <div className="card-left">   
    <img title={primaryFlair}
        alt={primaryFlair}
        className = "cardImg"src={`${picPath}/ClubIcons/${flairPic}`} />
  </div>
  <div className="card-right">
    <div className="card-right-top">
      <div className="text-holder">
      <h2>Rev</h2>
      <div className="card-desc">{ClubDescription}</div>
      </div>
      <div className="score-holder">
        <div className="score">{total}</div>
      </div>
    </div>
    <div className="card-right-bottom">


      <div className="pill"><div>{descriptions[0]}</div></div>
      <div className="pill"><div>{descriptions[1]}</div></div>
    </div>
  </div>

</div>
)
  );
}

export default Clubs;
