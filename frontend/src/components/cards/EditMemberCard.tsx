import { useAuth } from '@/contexts/AuthContexts';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const backendUrl =  import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';


interface Props{
    userID: string;
    username: string;
    role: string;
    userrole: string;
    clubID?: string;
    canEdit?:boolean;
    onRoleChange: (id:string , newRole:string) => void;



}

const EditMemberCard = ({userID, username, role, userrole, clubID="", onRoleChange, canEdit = false }: Props) => {
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)
    const [selectedRole, setSelectedRole] = useState(role)
    const [editable, setEditable] = useState(canEdit)
    const [actualRole, setActualRole] = useState(role)




    const handleChange = async ()=>{



    const comparePerms: { [key: string]: number } = {
    'Leader': 2,
    'Board': 1,
    'Member': 0
  };


      const token = localStorage.getItem("authToken")
      


      
        const response = await fetch(`${backendUrl}/api/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          memberRole: selectedRole,
          clubID: clubID,
          userID: userID
      
        }),
      });
      
          const data = await response.json();
      
          if(data.success){

              setActualRole(selectedRole)



              setEditable(comparePerms[userrole] > comparePerms[selectedRole])
              onRoleChange(userID , selectedRole);
              setEdit(false)
              

          }else{
              console.log(data.error)
          }
      
      



    }





  return (<>


    {!edit ? (
  <div className={`${actualRole}-memberCard memberCard`}>
    <div onClick={() => navigate(`/UserPage/${userID}`)}>
      <h1>{username}</h1>
      <br />
      <h2>{actualRole}</h2>
      <br />
    </div>
    {editable && (
      <button onClick={() => setEdit(true)}>Edit</button>
    )}
  </div>
) : (
  <div className={`${role}-memberCard memberCard`}>
    <h1>{username}</h1>
    <br />
    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
      <option value="Board">Board</option>
      <option value="Member">Member</option>
    </select>
    <button onClick={handleChange}>Save</button>
    <br />
  </div>
)}


    </>
  )
}

export default EditMemberCard