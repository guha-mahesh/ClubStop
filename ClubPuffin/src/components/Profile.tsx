import { useState } from "react";

const Profile = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      {!open ? (
        <div className="Avatar">
          <button onClick={() => setOpen((prev) => !prev)}>
            <img src="https://via.placeholder.com/150" />
          </button>
        </div>
      ) : (
        <div className="Avatar">
          <button onClick={() => setOpen((prev) => !prev)}>
            <img src="https://via.placeholder.com/150" />
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
