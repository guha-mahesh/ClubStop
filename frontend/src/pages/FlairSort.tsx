import React from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';
import ClubCard from '../components/cards/clubs/ClubCard';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";




interface Club {
    clubName: string;
    club_id: string;
    clubDesc: string;
    School: string;
    leaderName: string;



}


const FlairSort = () => {
    const [fetching, setFetching] = useState(true);
    const [clubs, setClubs] = useState<Club[] | null>(null);
    const { flairName } = useParams<{ flairName: string }>();
    const [noClubs, setNoClubs] = useState(false);



    useEffect(() => {
        const getClubsByFlair = async () => {
            try {
                console.log(flairName)

                const result = await fetch(`${backendUrl}/api/sort/${flairName}`,
            {method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          

          })
          const data = await result.json();
          if (data.success) {
            console.log(data, 
                "yipepeee"
            )
            const clubs: Club[] = data.club_id.map((_: number, i:number) => ({
    clubName: data.clubName[i],
    clubDesc: data.clubDesc[i], 
    club_id: data.club_id[i],
    School: data.School[i],
    leaderName: data.leaderName[i]

}));
    setClubs(clubs);

          }
          else{
            console.log(data.error)
            if(data.errorCode === 404){
                setNoClubs(true);
            }
          }
                
                
            } catch (error) {
                console.error('Error fetching clubs:', error);
            } finally {
                setFetching(false);
            }
        }
        getClubsByFlair();





    }, []);
  return (
  <>
    {!fetching ? ( noClubs? <div>No clubs found for this flair</div>:
      <div>
        <h1>
          Top Rated Clubs under{" "}
          <span style={{ color: "#469a0fff", fontWeight: "bold" }}>
            {flairName}
          </span>
        </h1>
        {clubs?.map((club, id) => (
          <ClubCard
            key={id}
            ClubName={club.clubName}
            ClubDescription={club.clubDesc}
            id={club.club_id}
            School={club.School}
            leader={club.leaderName}
          />
        ))}
      </div>
    ) : (
      <div>loading...</div>
    )}
  </>
);
}

export default FlairSort