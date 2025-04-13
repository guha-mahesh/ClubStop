import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../Global";
const profileURL = "/profilePic";

const ConfigureProfile = () => {
  const { signed, setSigned } = useGlobalContext();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <form>
        <label htmlFor="profilePicture">Profile Picture</label>
        <input
          id="profilePicture"
          type="file"
          onChange={(e) => {
            // @ts-ignore
            setFile(e.target.files[0]);
          }}
          required
        ></input>
      </form>
    </div>
  );
};

export default ConfigureProfile;
