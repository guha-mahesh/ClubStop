// this is the icon at the top right of the home page where the user can view their stuff

import { useState } from "react";
import Puffin from "../../../assets/puffin.png";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../../../contexts/AuthContexts'

import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const {user }= useAuth();


  const checkJwt = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decode = jwtDecode(token) as { exp: number };
      const time = Date.now() / 1000;

      if (decode.exp < time) {
        localStorage.clear();

        window.location.reload();
      }
    }
  };

  return (
    <div>
      {!open ? (
        <div className="Avatar">
          <button onClick={() => setOpen((prev) => !prev)}>
            <img className="tempPuff" src={Puffin} />
          </button>
        </div>
      ) : (
        <div className="Avatar">
          <button onClick={() => setOpen((prev) => !prev)}>
            <img className="tempPuff" src={Puffin} />
          </button>
          <div className="profileDrop">
            <button
              onClick={() => {
                navigate("/CreateClub");
                checkJwt();
              }}
              className="dropdown-button"
            >
              Create a Club
            </button>
            <button
              onClick={() => {
                navigate("/MyClubs");
                checkJwt();
              }}
              className="dropdown-button"
            >
              My Clubs
            </button>
            <button
              onClick={() => {
                navigate(`/UserPage/${user?.id}`);
                checkJwt();
              }}
              className="dropdown-button"
            >
              View Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
