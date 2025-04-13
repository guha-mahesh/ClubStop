//This is a page that lets you create a club

import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "../Global";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";
const clubUrl = "/ClubCreate";

const CreateAClub: React.FC = () => {
  const [clubName, setClubName] = useState<string>("");
  const [clubDesc, setClubDesc] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const { signed, setSigned } = useGlobalContext();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const userRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
    if (!signed) {
      navigate("/Login");
    }
  }, []);

  interface ClubCreation {
    name: string;
    description: string;
    username: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = localStorage.getItem("user");

    if (!user) {
      setErrorMessage("No user logged in.");
      return;
    }

    try {
      const response = await axios.post<ClubCreation>(
        clubUrl,
        {
          name: clubName,
          description: clubDesc,
          user: user,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(success);
      console.log("Club created:", response.data);
      setSuccess(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating club:", error);
      setErrorMessage("Error creating club. Please try again.");
    }
  };

  return (
    <>
      <div>
        {signed ? (
          !success ? (
            <form onSubmit={handleSubmit}>
              <label htmlFor="clubName">Club Name</label>
              <input
                ref={userRef}
                id="clubName"
                required
                type="text"
                value={clubName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClubName(e.target.value)
                }
              />

              <label htmlFor="clubDesc">Club Description</label>
              <input
                id="clubDesc"
                required
                type="text"
                value={clubDesc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClubDesc(e.target.value)
                }
              />

              <button type="submit">Submit</button>
            </form>
          ) : (
            <section>
              <h1>Club Created Successfully!</h1>
              <br />
              <p>
                <a href="/">Go • to • Home</a>
              </p>
            </section>
          )
        ) : (
          <div>Log in</div>
        )}
      </div>
    </>
  );
};

export default CreateAClub;
