import React from 'react'
import {useAuth} from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Clubs from "../components/cards/clubs/ClubCard";
import UploadPfp from '../components/UploadPfp'
import Navbar from '../components/layout/Navbar'
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

const UserPage = () => {

    interface userdata{
        username: string;
        School: string;
        userDesc: string;
        email: string;
        profilePic: string;
    }

    interface Club{
        leaderName: string;
        clubName: string;
        clubDesc: String;
        School: String;
        club_id : string;
    }

interface University{
  name: string;
}

    const { userID } = useParams<{ userID: string }>();
    
    const navigate = useNavigate();
    const {user, loading, isAuthenticated} = useAuth();
    const [userData, setUserData] = useState<userdata | null>(null)
    const [ledClubs, setLedClubs] = useState<Club[] | null>(null)
    const [joinedClubs, setJoinedClubs] = useState<Club[] | null>(null)
    const [fetching, setFetching] = useState(true);
    const [viewingOwn, setViewingOwn] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [edit, setEdit] = useState(false)

    const [username, setUsername] = useState("")
    const [school, setSchool] = useState("")
    const [unis, setUnis] = useState<University[] | null>(null);
    const[desc, setDesc] = useState("")
    const [uniSrch, setUniSrch] = useState("")
    

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
            setViewingOwn(true);
        }
       
        setFetching(false);

    }
    else{
        console.log(data.error)
    }
        }
    }
     const fetchUniData = async () => {
      console.log("fetching unis")
      const res = await fetch(`${backendUrl}/api/university`);
      const data = await res.json();
      if (data.success) {
        setUnis(data.unis);
        console.log(data.unis)
      }
    };
    fetchData();
    fetchUniData();

    }, [userID, user])

    useEffect(()=>{
        if(userData){
        setDesc(userData.userDesc)
        setUsername(userData.username)
        setSchool(userData.School)
    }

    }, [userData])

      const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSet = async (file: File) =>{
     if (!file) {
    alert("Please select a file first");
    return;
  }
    const token = localStorage.getItem("authToken")

      const formData = new FormData();
    formData.append("image", file);  

    if (user)
      {
        formData.append("userId", user.id);

    const response = await fetch(`${backendUrl}/api/image`,  {
      method: 'POST',
       headers: {
      "Authorization": `Bearer ${token}`,  
    },
    body: formData 

    });
     if (!response.ok) {

    const error = await response.json();
    console.error(error);
    return;
  }
  const data = await response.json();
  console.log("Upload successful:", data);
}else{navigate("/login")}

  }

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
        localStorage.setItem("school", JSON.stringify(school));

        localStorage.setItem("user", JSON.stringify({ id: userID, username: username }));

    }else{
        console.log(data.error)
    }
}
    }
const filteredUnis = uniSrch.trim()
    ? unis?.filter((uni) =>
        uni.name.toLowerCase().includes(uniSrch.trim().toLowerCase())
      ).slice(0,3)
    : null;
  return (
    <>
    <Navbar></Navbar>
    <div className="user-page-container">
      {!fetching ? (
        !edit ? (
          <div className="user-profile-wrapper">
            <div className="user-profile-card">
              <div className="profile-header">
                <div className="profile-image-section">
                  <UploadPfp 
                    onFileChange={handleFileChange}  
                    viewingOwn = {viewingOwn}
                    {...(userData?.profilePic ? { IMAGE_URL: userData.profilePic } : {})} 
                  />
                  {viewingOwn && (
                    <button 
                      className="set-pfp-button"
                      // @ts-ignore

                      onClick={() => handleSet(selectedFile)}
                    >
                      Set as Profile Picture
                    </button>
                  )}
                </div>
                
                <div className="profile-info">
                  <h1 className="profile-username">{username}</h1>
                  <h3 className="profile-school">{school}</h3>
                  <p className="profile-description">{desc}</p>
                  
                  {viewingOwn && (
                    <button 
                      className="edit-profile-button"
                      onClick={() => setEdit(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="clubs-section">
              {ledClubs && ledClubs.length > 0 && (
                <div className="clubs-category">
                  <h2 className="clubs-category-title">President of</h2>
                  <div className="clubs-grid">
                    {ledClubs.map((club) => (
                      <div key={club.club_id} className="club-item">
                        <Clubs 
                          leader={club.leaderName} 
                          ClubName={club.clubName} 
                          ClubDescription={club.clubDesc} 
                          School={club.School} 
                          id={club.club_id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {joinedClubs && joinedClubs.length > 0 && (
                <div className="clubs-category">
                  <h2 className="clubs-category-title">Member of</h2>
                  <div className="clubs-grid">
                    {joinedClubs.map((club) => (
                      <div key={club.club_id} className="club-item">
                        <Clubs 
                          leader={club.leaderName} 
                          ClubName={club.clubName} 
                          ClubDescription={club.clubDesc} 
                          School={club.School} 
                          id={club.club_id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-profile-wrapper">
            <div className="edit-profile-card">
              <div className="edit-header">
                <h2 className="edit-title">Edit Profile</h2>
                <p className="edit-subtitle">Update your profile information</p>
              </div>
              
              <form onSubmit={handleEdit} className="edit-form">
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <input
                    className="text-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                
                <div className="input-group universityInput">
                  <label className="input-label">University</label>
                  <input
                    className="text-input"
                    value={uniSrch}
                    onChange={(e) => setUniSrch(e.target.value)}
                    placeholder="Enter your school"
                  />
  <div className = "searchItems">
                {filteredUnis ? (
  filteredUnis.map((uni, index) => (
    <div onClick = {()=>setSchool(uni.name)}className = "searchItem"key={index}>{uni.name} </div>
  ))
) : null}
{school ? (<h1 className = "selectedSchool">Selected School: {school}</h1>):(null)}
</div>

                </div>
               
                
                <div className="input-group">
                  <label className="input-label">Description</label>
                  <textarea
                    className="textarea-input"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Tell us about yourself"
                  />
                </div>
                
                <div className="edit-buttons">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      ) : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2 className="loading-text">Loading profile...</h2>
        </div>
      )}
    </div>
    </>
  )
}

export default UserPage