import { useState } from "react";
import Puffin from "../../assets/puffin.png";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

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
              }}
              className="dropdown-button"
            >
              Create a Club
            </button>
            <button
              onClick={() => {
                navigate("/MyClubs");
              }}
              className="dropdown-button"
            >
              My Clubs
            </button>
            <button className="dropdown-button"></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
