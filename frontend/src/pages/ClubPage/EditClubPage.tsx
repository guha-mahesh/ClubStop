import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContexts'
import { useNavigate } from 'react-router-dom'
import EditMemberCard from '../../components/cards/EditMemberCard'
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';


interface Member{
    users_id: string;
    username: string;
    clubRole: string;
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

    const [role, setRole] = useState("")
const [compareperms, setCompareperms] = useState<{ [key: string]: number }>({});

    const [fetching, setFetching] = useState(true);


    useEffect(()=>{
        if (!loading && !isAuthenticated){
            navigate("/")
        }
    },[navigate, isAuthenticated, loading])

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




  </>
);
}

export default EditClubPage