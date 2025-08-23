import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import EditMemberCard from '../../components/cards/EditMemberCard'
import { fetchExternalImage } from 'next/dist/server/image-optimizer'
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
    const [founded, setFounded] = useState("")
    const [edit, setEdit] = useState(false)
    const [flairs, setFlairs] = useState<clubFlair[] | null>(null)
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
            console.log("success")

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
                console.log(clubID)
                const response = await fetch(`${backendUrl}/api/editclub/${clubID}`,{
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`,
           }

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
  
  if (data.flairRows) {
  console.log(data.flairRows)
  setFlairs(data.flairRows);

}else{
  console.log("ni")
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

const handleEdit = async () =>{
    const token = localStorage.getItem("authToken")
    const sqlTimestamp = convertToSQLTimestamp(founded);

      const response = await fetch(`${backendUrl}/api/club`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clubID: clubID,
          name: name,
          description: desc,
          founded: sqlTimestamp,

      
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


const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const convertToSQLTimestamp = (dateStr: string) => {
  if (!dateStr) return null;

  return dateStr + " 00:00:00";
}
const handleFlairAdd = async () => {
  const token = localStorage.getItem("authToken");

  try {
    if (user && selected) {
      const response = await fetch(`${backendUrl}/api/flair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ClubID: clubID,
          Flair: selected.flair_name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Flair added successfully:", data.result);

      } else {
        console.log("Server error:", data.error);
      }

window.location.reload();

    }
  } catch (err) {
    console.log("Request failed:", err);
  }
};






  return (
  <>
    <div>
      {!edit ? (
  <>
    <form
      onSubmit={e => {
        e.preventDefault();
        handleEdit();
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Club Name"
        disabled
      />
      <br />
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Club Description"
        disabled
      />
      <br />
      <input
        value={formatDate(founded)}
        onChange={(e) => setFounded(e.target.value)}
        placeholder="Founded Date"
        disabled
      />
      <br />
    </form>
    <button type="button" onClick={() => setEdit(true)}>Edit</button>
  </>
) : (
  <form
    onSubmit={e => {
      e.preventDefault();
      handleEdit();
    }}
  >
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Club Name"
    />
    <br />
    <input
      value={desc}
      onChange={(e) => setDesc(e.target.value)}
      placeholder="Club Description"
    />
    <br />
    <input
      type="date"
      value={formatDate(founded)}
      onChange={(e) => setFounded(e.target.value)}
      placeholder="Founded Date"
    />
    <br />
    <button type="submit">Save</button>
  </form>
)}
    </div>

    <div>
      <h3>Members</h3>
      {members?.map((member) => (
        <div key={member.users_id}>
          <EditMemberCard
            userID={member.users_id}
            userrole={role}
            username={member.username}
            role={member.clubRole}
            clubID={clubID}
            canEdit={compareperms[role] > compareperms[member.clubRole]}
          />
          <br />
        </div>
      ))}
    </div>

    <div>
      <h3>Club Flairs</h3>

      {flairs && flairs.length === 5 ? (

        flairs.map((flair, index) => (
          <div key={index}>{<Flair Flair = {flair.flairName} ClubID={clubID}></Flair>}</div>
        ))
      ) : flairs && flairs.length > 0 ? (

        <>
          {flairs.map((flair, index) => (
            <div key={index}>{<Flair Flair = {flair.flairName} ClubID={clubID}></Flair>}</div>
          ))}
          {!adding && fetchingFlairs ? (
            <button onClick={() => setAdding(true)}>Add Flairs</button>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Search flairs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                console.log("hi")}}
              />
              {search && filteredFlairs.length > 0 && (
                <ul style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', margin: '10px 0' }}>
                  {filteredFlairs.map((flair, idx) => (
                    <li
                      key={idx}
                      onClick={() => setSelected(flair)}
                      style={{ 
                        cursor: "pointer", 
                        padding: '5px',
                        backgroundColor: selected?.flair_name === flair.flair_name ? '#e0e0e0' : 'transparent'
                      }}
                    >
                      {flair.flair_name}
                    </li>
                  ))}
                </ul>
              )}
              {selected && (
                <div style={{ margin: '10px 0' }}>
                  Selected: <strong>{selected.flair_name}</strong>
                  <button onClick = {handleFlairAdd}style={{ marginLeft: '10px' }}>
                    Add Flair
                  </button>
                  <button onClick={() => { setAdding(false); setSelected(null); setSearch(""); }} style={{ marginLeft: '10px' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (

        !adding && fetchingFlairs ? (
          <button onClick={() => setAdding(true)}>Add Flairs</button>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Search flairs..."
              value={search}
              onChange={(e) => {
                  setSearch(e.target.value)
                console.log("Options:", options?.slice(0, 5));}}
            />
            {search && filteredFlairs.length > 0 && (
              <ul style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', margin: '10px 0' }}>
                {filteredFlairs.map((flair, idx) => (
                  <li
                    key={idx}
                    onClick={() => setSelected(flair)}
                    style={{ 
                      cursor: "pointer", 
                      padding: '5px',
                      backgroundColor: selected?.flair_name === flair.flair_name ? '#e0e0e0' : 'transparent'
                    }}
                  >
                    {flair.flair_name}
                  </li>
                ))}
              </ul>
            )}
            {selected && (
              <div style={{ margin: '10px 0' }}>
                Selected: <strong>{selected.flair_name}</strong>
                <button onClick = {handleFlairAdd} style={{ marginLeft: '10px' }}>
                  Add Flair
                </button>
                <button onClick={() => { setAdding(false); setSelected(null); setSearch(""); }} style={{ marginLeft: '10px' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  </>
);
}

export default EditClubPage