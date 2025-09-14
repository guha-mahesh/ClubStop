import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import EditMemberCard from '../../components/cards/EditMemberCard'
import Flair from '../../components/Flair'


const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

interface Member{
    users_id: string;
    username: string;
    clubRole: string;
}
interface Flair{
  flair_name: string;
}
interface clubFlair{
  flairName: string;
}

const EditClubPage = () => {

    const { clubID } = useParams<{ clubID: string }>();
    const {user, loading, isAuthenticated} = useAuth();

    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[] | null>(null)
    const [desc, setDesc] = useState("")
    const [name, setName] = useState("")
    const [instagram, setInstagram] = useState("")
    const [linktree, setLinktree] = useState("")
    const [founded, setFounded] = useState("")
    const [edit, setEdit] = useState(false)
    const [flairs, setFlairs] = useState<string[] | null>(null)
    const [primaryFlair, setPrimaryFlair] = useState("")
    const [fetchingFlairs, setFetchingFlairs] = useState(true)

    const [adding, setAdding] = useState(false)

    const [options, setOptions] = useState<Flair[]| null>(null)
    const [selected, setSelected] = useState<Flair | null>(null)
    const [search, setSearch] = useState("");

    const [role, setRole] = useState("")
    const [compareperms, setCompareperms] = useState<{ [key: string]: number }>({});
    const [fetching, setFetching] = useState(true);

    const filteredFlairs = options
  ?.filter(u =>
    typeof u.flair_name === "string" &&
    u.flair_name.toLowerCase().startsWith(search.toLowerCase())
  )
  .slice(0, 5) || [];

    useEffect(()=>{
        if (!loading && !isAuthenticated){
            navigate("/")
        }
    },[navigate, isAuthenticated, loading])

    useEffect(()=>{
    
        const fetchFlairData = async ()=>{

          const result = await fetch(`${backendUrl}/api/flair`,
            {method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          
          }
    
    
          )
    
          const data = await result.json();
    
          if (data.success){
            setOptions(data.flairs)


          }else{
            console.log(data.error)
          }
    
        }
        fetchFlairData();
    
      }, [])

    useEffect(()=>{
        const token = localStorage.getItem("authToken")
        const fetchClubData = async ()=>{
            if (user){

                const response = await fetch(`${backendUrl}/api/editclub/${clubID}`,{
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 
           },
           credentials: 'include',

                })
                const data = await response.json();
                if(data.success){

    const comparePerms: { [key: string]: number } = {
    'Leader': 2,
    'Board': 1,
    'Member': 0
  };

  setCompareperms(comparePerms)

  const rolePriority: { [key: string]: number } = {
    'Leader': 0,
    'Board': 1,
    'Member': 2
  };

    const userInClub = data.memberData.find((member: Member) => member.users_id === user.id);
    const userRole = userInClub?.clubRole;
    setRole(userRole)

  const sortedMembers = data.memberData.sort((a: Member, b: Member) => {
    const roleDiff = rolePriority[a.clubRole] - rolePriority[b.clubRole];
    if (roleDiff !== 0) return roleDiff;
    return a.username.localeCompare(b.username);
  });

  setMembers(sortedMembers);
  setDesc(data.clubData.clubDesc);
  setName(data.clubData.clubName);
  setInstagram(data.clubData.instagram || "");
  setLinktree(data.clubData.linktree || "");

  if (data.otherFlairs) {

  setFlairs(data.otherFlairs);

}else{
  console.log(data)
}
if (data.clubData.primaryFlair){

  setPrimaryFlair(data.clubData.primaryFlair)
}else{
  console.log("None Found")
}
  setFounded(data.clubData.created_at);
  setFetching(false);
}else{
                    console.log(data.error)
                }

                
            }
        }
        fetchClubData();
    }, [user, clubID])
  
    const updateRole = (memberId: string, newRole: string) => {
      console.log("updatingRole", memberId, newRole)

  const rolePriority: { [key: string]: number } = {
    'Leader': 0,
    'Board': 1,
    'Member': 2
  };

  setMembers(prev => {
  if (!prev) return [];

  const updated = prev.map(m => m.users_id === memberId ? {...m, clubRole: newRole} : m);

  return [...updated].sort((a, b) => {
  const diff = rolePriority[a.clubRole] - rolePriority[b.clubRole];
  if (diff !== 0) return diff;
  return a.username.localeCompare(b.username);
});
});

};

const handleEdit = async () =>{
    const token = localStorage.getItem("authToken")
    const sqlTimestamp = convertToSQLTimestamp(founded);

      const response = await fetch(`${backendUrl}/api/club`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify({
          clubID: clubID,
          name: name,
          description: desc,
          founded: sqlTimestamp,
          instagram: instagram,
          linktree: linktree

      
        }),
      });
      
          const data = await response.json();
      
          if(data.success){
              console.log("success")
                setEdit(false)
          }else{
              console.log(data.error)
          }

}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};

const convertToSQLTimestamp = (dateStr: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const handleFlairAdd = async () => {
  const token = localStorage.getItem("authToken");
  console.log("Adding flair")

  try {
    if (user && selected) {
      const response = await fetch(`${backendUrl}/api/flair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify({
          ClubID: clubID,
          Flair: selected.flair_name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Flair added successfully:", data.result);
        window.location.reload()
      } else {
        console.log("Server error:", data.error);
      }


    }
  } catch (err) {
    console.log("Request failed:", err);
  }
};

return (
 <div className="edit-club-page">
   <div className="club-info-section">
     {!edit ? (
       <div className="club-details-view">
         <form className="club-form" onSubmit={e => { e.preventDefault(); handleEdit(); }}>
           <div className="form-group">
             <label className="form-label">Club Name</label>
             <input
               className="form-input disabled"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Club Name"
               disabled
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Club Description</label>
             <textarea
             
               className="form-input disabled"
               value={desc}
               onChange={(e) => setDesc(e.target.value)}
               placeholder="Club Description"
               disabled
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Founded On</label>
             <input
               className="form-input disabled"
               value={formatDate(founded)}
               onChange={(e) => setFounded(e.target.value)}
               placeholder="Founded Date"
               disabled
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Instagram</label>
             <input
               className="form-input disabled"
               value={instagram}
               onChange={(e) => setInstagram(e.target.value)}
               placeholder="Instagram"
               disabled
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Linktree</label>
             <input
               className="form-input disabled"
               value={linktree}
               onChange={(e) => setLinktree(e.target.value)}
               placeholder="Linktree"
               disabled
             />
           </div>
         </form>
         <button type="button" className="edit-button primary" onClick={() => setEdit(true)}>
           Edit Club Info
         </button>
       </div>
     ) : (
       <div className="club-details-edit">
         <form className="club-form edit-mode" onSubmit={e => { e.preventDefault(); handleEdit(); }}>
           <div className="form-group">
             <label className="form-label">Club Name</label>
             <input
               className="form-input"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Club Name"
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Club Description</label>
             <textarea
             
               className="form-input"
               value={desc}
               onChange={(e) => setDesc(e.target.value)}
               placeholder="Club Description"
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Founded On</label>
             <input
               className="form-input"
               type="date"
               value={formatDate(founded)}
               onChange={(e) => setFounded(e.target.value)}
               placeholder="Founded Date"
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Instagram</label>
             <input
               className="form-input"
               value={instagram}
               onChange={(e) => setInstagram(e.target.value)}
               placeholder="Instagram"
             />
           </div>
           
           <div className="form-group">
             <label className="form-label">Linktree</label>
             <input
               className="form-input"
               value={linktree}
               onChange={(e) => setLinktree(e.target.value)}
               placeholder="Linktree"
             />
           </div>
           
           <div className="form-actions">
             <button type="submit" className="save-button primary">Save Changes</button>
             <button type="button" className="cancel-button secondary" onClick={() => setEdit(false)}>
               Cancel
             </button>
           </div>
         </form>
       </div>
     )}
   </div>

   <div className="members-section">
     <h3 className="section-title">Members</h3>
     <div className="members-list">
       {members?.map((member) => (
         <div key={member.users_id} className="member-item">
           <EditMemberCard
             onRoleChange={updateRole}
             userID={member.users_id}
             userrole={role}
             username={member.username}
             role={member.clubRole}
             clubID={clubID}
             canEdit={compareperms[role] > compareperms[member.clubRole]}
           />
         </div>
       ))}
     </div>
   </div>

   <div className="flairs-section">
     <h3 className="section-title">Club Flairs</h3>

     {flairs && primaryFlair && flairs.length === 5 ? (
       <div className="flairs-container">
         <div className="primary-flair-container">
           <h4 className="flair-subtitle">Primary Flair</h4>
           <Flair primary={true} Flair={primaryFlair} ClubID={clubID} />
         </div>
         
         <div className="secondary-flairs-container">
           <h4 className="flair-subtitle">Secondary Flairs</h4>
           <div className="flairs-grid">
             {flairs.map((flair, index) => (
               <div key={index} className="flair-item">
                 <Flair primary={false} Flair={flair} ClubID={clubID} />
               </div>
             ))}
           </div>
         </div>
       </div>
     ) : primaryFlair ? (
       <div className="flairs-container">
         <div className="primary-flair-container">
           <h4 className="flair-subtitle">Primary Flair</h4>
           <Flair primary={false} Flair={primaryFlair} ClubID={clubID} />
         </div>
         
         <div className="secondary-flairs-container">
           <h4 className="flair-subtitle">Secondary Flairs</h4>
           <div className="flairs-grid">
             {flairs?.map((flair, index) => (
               <div key={index} className="flair-item">
                 <Flair primary={false} Flair={flair} ClubID={clubID} chngprm={true} />
               </div>
             ))}
           </div>
         </div>
         
         {!adding && !fetchingFlairs ? (
           <button className="add-flair-button primary" onClick={() => setAdding(true)}>
             Add Flairs
           </button>
         ) : (
           <div className="flair-search-container">
             <div className="search-input-wrapper">
               <input
                 className="flair-search-input"
                 type="text"
                 placeholder="Search flairs..."
                 value={search}
                 onChange={(e) => {
                   setSearch(e.target.value)
                   console.log("hi")
                 }}
               />
             </div>
             
             {search && filteredFlairs.length > 0 && (
               <ul className="flair-options-list">
                 {filteredFlairs.map((flair, idx) => (
                   <li
                     key={idx}
                     className={`flair-option ${selected?.flair_name === flair.flair_name ? 'selected' : ''}`}
                     onClick={() => setSelected(flair)}
                   >
                     {flair.flair_name}
                   </li>
                 ))}
               </ul>
             )}
             
             {selected && (
               <div className="flair-selection-actions">
                 <div className="selected-flair-info">
                   Selected: <strong>{selected.flair_name}</strong>
                 </div>
                 <div className="selection-buttons">
                   <button className="confirm-button primary" onClick={handleFlairAdd}>
                     Add Flair
                   </button>
                   <button 
                     className="cancel-selection-button secondary" 
                     onClick={() => { setAdding(false); setSelected(null); setSearch(""); }}
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>
     ) : (
       <div className="flairs-container">
         {!adding && fetchingFlairs ? (
           <button className="add-flair-button primary" onClick={() => setAdding(true)}>
             Add Flairs
           </button>
         ) : (
           <div className="flair-search-container">
             <div className="search-input-wrapper">
               <input
                 className="flair-search-input"
                 type="text"
                 placeholder="Search flairs..."
                 value={search}
                 onChange={(e) => {
                   setSearch(e.target.value)
                   console.log("Options:", options?.slice(0, 5));
                 }}
               />
             </div>
             
             {search && filteredFlairs.length > 0 && (
               <ul className="flair-options-list">
                 {filteredFlairs.map((flair, idx) => (
                   <li
                     key={idx}
                     className={`flair-option ${selected?.flair_name === flair.flair_name ? 'selected' : ''}`}
                     onClick={() => setSelected(flair)}
                   >
                     {flair.flair_name}
                   </li>
                 ))}
               </ul>
             )}
             
             {selected && (
               <div className="flair-selection-actions">
                 <div className="selected-flair-info">
                   Selected: <strong>{selected.flair_name}</strong>
                 </div>
                 <div className="selection-buttons">
                   <button className="confirm-button primary" onClick={handleFlairAdd}>
                     Add Flair
                   </button>
                   <button 
                     className="cancel-selection-button secondary" 
                     onClick={() => { setAdding(false); setSelected(null); setSearch(""); }}
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>
     )}
   </div>
   <br></br><br></br>
    <button type="button" className="edit-button primary endingButton" onClick={()=>navigate(`/club/${clubID}`)}>
          back to Club
         </button>
 </div>
);
}

export default EditClubPage