import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../Global";
const profileURL = "/profilePic";
axios.defaults.baseURL = "http://localhost:5000";

const ConfigureProfile = () => {
  const { signed, setSigned } = useGlobalContext();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = localStorage.getItem("user");

    const formData = new FormData();
    if (user && file) {
      formData.append("name", user);
      formData.append("file", file);
    } else {
      console.log("User or file upload Missing");
    }

    try {
      const response = await axios.post(profileURL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("Profile Picture Set:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting profile picture:", error);
    }
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
