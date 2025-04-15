//This will prob not exist for long, but it's essentially just deleting the user then logging them out

import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Global";
axios.defaults.baseURL = "http://localhost:5000";

const Delete = () => {
  const navigate = useNavigate();
  const { signed, setSigned } = useGlobalContext();
  interface DeleteResponse {
    message: string;
  }

  const handleDeletion = async () => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!username) {
      alert("No user logged in");
      return;
    }

    try {
      const response = await axios.post<DeleteResponse>("/delete", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          collect: "Users",
          username: username,
        },
      });

      if (response.status === 200) {
        alert("User deleted successfully");
        localStorage.clear();
        setSigned(false);
        navigate("/");
      } else {
        alert(`Deletion failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <button onClick={handleDeletion}>Delete</button>
    </div>
  );
};

export default Delete;
