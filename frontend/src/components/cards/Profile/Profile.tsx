import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContexts';
import { FaBars } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);  
      setClosing(false);
    }, 500); 
  };

  return (
    <>
      {!user ? null : (
        <div>
          <FaBars
            className="hamburgerMenu"
            onClick={() => setOpen(true)}
            size={32}
          />


          {(open || closing) && (
            <div className={`sidebar ${open ? 'sidebar-open' : ''} ${closing ? 'sidebarfirst' : ''}`}>
              <div className="buttonFlex">
                <FaBars onClick={handleClose} size={32} />
                <button
                  onClick={() => navigate(`/UserPage/${user?.id}`)}
                  className="dropdown-button"
                >
                  View Profile
                </button>
                <button
                  onClick={() => navigate(`/`)}
                  className="dropdown-button"
                >
                  Saved Clubs
                </button>
                <button
                  onClick={() => navigate(`/`)}
                  className="dropdown-button"
                >
                  Club Lists
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
