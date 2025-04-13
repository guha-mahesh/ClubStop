// this is the icon at the top right of the home page where the user can view their stuff

import { useState } from "react";
import Puffin from "../../assets/puffin.png";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Global";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { signed, setSigned } = useGlobalContext();

  const checkJwt = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token) as { exp: number };
      const time = Date.now() / 1000;

      if (decode.exp < time) {
        localStorage.clear();
        setSigned(false);
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
          <div className="dropdown">
            <button
              onClick={() => {
                navigate("/createClub");
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
                navigate("/deleteUser");
                checkJwt();
              }}
              className="dropdown-button"
            >
              delete user
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
