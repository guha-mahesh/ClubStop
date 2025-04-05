import { useState } from "react";
import Puffin from "../../assets/puffin.png";

const Profile = () => {
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
            <button className="dropdown-button"></button>
            <button className="dropdown-button"></button>
            <button className="dropdown-button"></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
