import React from 'react'
import {useAuth} from '../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Clubs from "../components/cards/clubs/ClubCard";
import { FaCheck, FaExternalLinkAlt, FaInstagram, FaGlobe, FaLinkedin, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa'
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
        link1: string;
        link2: string;
        link3: string;

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
    const [success, setSuccess] = useState(false)

    const [focused, setFocused] = useState(false);

    const [username, setUsername] = useState("")
    const [school, setSchool] = useState("")
    const [unis, setUnis] = useState<University[] | null>(null);
    const[desc, setDesc] = useState("")
    const [link1, setLink1] = useState("")
    const [link2, setLink2] = useState("")
    const [link3, setLink3] = useState("")
    const [uniSrch, setUniSrch] = useState("")
    

    useEffect(()=>{
        const token = localStorage.getItem("authToken")
        const fetchData = async ()=>{

        if(userID){
            const response = await fetch(`${backendUrl}/api/user/${userID}`,  {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
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

      const res = await fetch(`${backendUrl}/api/university`);
      const data = await res.json();
      if (data.success) {
        setUnis(data.unis);

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
        setLink1(userData.link1)
        setLink2(userData.link2)
        setLink3(userData.link3)
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
      
    },
    credentials: 'include',
    body: formData 

    });
     if (!response.ok) {

    const error = await response.json();
    console.error(error);
    return;
  }
  const data = await response.json();
  console.log("Upload successful:", data);
  setSuccess(true)
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
    
  },
  credentials: 'include',
  body: JSON.stringify({
    userId: user.id,
    username: username,
    school: school,
    desc: desc,
    link1: link1,
    link2: link2,
    link3: link3

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

    
    const getLinkIcon = (url: string) => {
      const domain = url.toLowerCase();
      if (domain.includes('instagram')) return <FaInstagram />;
      if (domain.includes('linkedin')) return <FaLinkedin />;
      if (domain.includes('twitter') || domain.includes('x.com')) return <FaTwitter />;
      if (domain.includes('github')) return <FaGithub />;
      if (domain.includes('youtube')) return <FaYoutube />;
      return <FaGlobe />;
    };

    
    const getLinkDisplayName = (url: string) => {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        
        
        if (domain.includes('instagram')) return 'Instagram';
        if (domain.includes('linkedin')) return 'LinkedIn';
        if (domain.includes('twitter')) return 'Twitter';
        if (domain.includes('x.com')) return 'X (Twitter)';
        if (domain.includes('github')) return 'GitHub';
        if (domain.includes('youtube')) return 'YouTube';
        
        
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      } catch {
        return 'Link';
      }
    };

    
    const validLinks = [
      { url: link1, label: 'Link 1' },
      { url: link2, label: 'Link 2' },
      { url: link3, label: 'Link 3' }
    ].filter(link => link.url && link.url.trim() !== '');

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
                    <div className = "setPfpDiv">
                      <button 
                        className="set-pfp-button"
                        //@ts-ignore
                        onClick={() => handleSet(selectedFile)}
                      >
                        Set as Profile Picture
                      </button>
                      {success && (<div><FaCheck size= {30} color = {"green"}/></div>)}
                    </div>
                  )}
                </div>
                
                <div className="profile-info">
                  <h1 className="profile-username">{username}</h1>
                  <h3 className="profile-school">{school}</h3>
                  <p className="profile-description">{desc}</p>
                  
                  {/* Links Section */}
                  {validLinks.length > 0 && (
                    <div className="profile-links">
                      <h4 className="links-title">Links</h4>
                      <div className="links-container">
                        {validLinks.map((linkItem, index) => (
                          <a
                            key={index}
                            href={linkItem.url.startsWith('http') ? linkItem.url : `https://${linkItem.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-link"
                          >
                            <span className="link-icon">
                              {getLinkIcon(linkItem.url)}
                            </span>
                            <span className="link-text">
                              {getLinkDisplayName(linkItem.url)}
                            </span>
                            <FaExternalLinkAlt className="external-icon" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
  <div className={
        focused ? "university-dropdown active" : "university-dropdown inactive"
      }>
                {filteredUnis ? (
  filteredUnis.map((uni, index) => (
    <div onMouseDown = {()=>setSchool(uni.name)}className = "searchItem"key={index}>{uni.name} </div>
  ))
) : null}

</div>
{school ? (<h1 className = "selectedSchool">Selected School: {school}</h1>):(null)}

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
                   
               <div className="input-group">
  <label className="input-label">Link1</label>
  <input
    className="text-input"
    value={link1}
    onChange={(e) => setLink1(e.target.value)} 
    placeholder="https://example.com"
  />
</div>
   
<div className="input-group">
  <label className="input-label">Link2</label>
  <input
    className="text-input"
    value={link2}
    onChange={(e) => setLink2(e.target.value)} 
    placeholder="https://instagram.com/yourclub"
  />
</div>
   
<div className="input-group">
  <label className="input-label">Link3</label>
  <input
    className="text-input"
    value={link3}
    onChange={(e) => setLink3(e.target.value)} 
    placeholder="https://portfolio.com"
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