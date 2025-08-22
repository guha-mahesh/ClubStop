import React from 'react'
import {useAuth} from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Clubs from "../components/cards/clubs/ClubCard";
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

const UserPage = () => {

    interface userdata{
        username: string;
        School: string;
        userDesc: string;

    }

    interface Club{
        leaderName: string;
        clubName: string;
        clubDesc: String;
        School: String;
        club_id : string;

    }

    const { userID } = useParams<{ userID: string }>();
    const navigate = useNavigate();
    const {user, loading, isAuthenticated} = useAuth();
    const [userData, setUserData] = useState<userdata | null>(null)
    const [ledClubs, setLedClubs] = useState<Club[] | null>(null)
    const [joinedClubs, setJoinedClubs] = useState<Club[] | null>(null)
    const [fetching, setFetching] = useState(true);
    const [viewingOwn, setViewingOwn] = useState(false);
    const [edit, setEdit] = useState(false)

    const [username, setUsername] = useState("")
    const [school, setSchool] = useState("")
    const[desc, setDesc] = useState("")





    


    useEffect(()=>{
        const token = localStorage.getItem("authToken")
        const fetchData = async ()=>{

        if(userID){
            const response = await fetch(`${backendUrl}/api/user/${userID}`,  {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}` },
    });

    const data = await response.json();

    if(data.success){
        
        setUserData(data.userData)
        setLedClubs(data.clubsLed)
        setJoinedClubs(data.clubsJoined)
        
        if(userID == user?.id){
            console.log("yes")
            setViewingOwn(true);

        }
       
        setFetching(false);

    }
    else{
        console.log(data.error)
    }
        }


    }
    fetchData();

    }, [userID, user])


    useEffect(()=>{
        if(userData){

        setDesc(userData.userDesc)
        setUsername(userData.username)
        setSchool(userData.School)
    
    }

    }, [userData])


    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) =>{
        
        e.preventDefault();

        const token = localStorage.getItem("authToken")

if (user){

        const response = await fetch(`${backendUrl}/api/user`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    userId: user.id,
    username: username,
    school: school,
    desc: desc

  }),
});

    const data = await response.json();

    if(data.success){
        window.location.reload();
    }else{
        console.log(data.error)
    }

}


    }






  return (
    <div>{!fetching ?(
    
    
    !edit ?
    (<div>
    
    <h1>{username}</h1>
    <br></br>
    <h2>{desc}</h2>
    <h3>{school}</h3>
    <h2>President of</h2>
    {ledClubs?.map((club) => (
  <div key={club.club_id}>
    <Clubs leader = {club.leaderName} ClubName = {club.clubName} ClubDescription={club.clubDesc} School={club.School} id={club.club_id}></Clubs>
    
    
  </div>
))}
<h2>Joined</h2>

    {joinedClubs?.map((club) => (
  <div key={club.club_id}>
    <Clubs leader = {club.leaderName} ClubName = {club.clubName} ClubDescription={club.clubDesc} School={club.School} id={club.club_id}></Clubs>
    
  </div>
))}

    
     {viewingOwn && !edit &&<button onClick = {()=>{setEdit(true)}}>Edit Profile</button>}
    

    
    
    
    
    
    </div>) : (
        
        
        
    <form onSubmit={handleEdit}>
  <input
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <br />
  <input
    value={school}
    onChange={(e) => setSchool(e.target.value)}
  />
  <textarea
    value={desc}
    onChange={(e) => setDesc(e.target.value)}
  />
  <button type="submit">Save</button>
</form>)):
    
    
    
    
    
    
    (<h1>loading...</h1>)}</div>
  )
}

export default UserPage