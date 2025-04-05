import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
const clubUrl = "/ClubCreate";

const CreateAClub: React.FC = () => {
  const [clubName, setClubName] = useState<string>("");
  const [clubDesc, setClubDesc] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const userRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log(localStorage);
    if (userRef.current) {
      userRef.current.focus();
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
      {!success ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="clubName">Club Name</label>
          <input
            ref={userRef}
            id="clubName"
            required
            type="text"
            value={clubName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setClubName(e.target.value);
            }}
          />
          <label htmlFor="clubDesc">Club Description</label>
          <input
            id="clubDesc"
            required
            type="text"
            value={clubDesc}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setClubDesc(e.target.value);
            }}
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <section>
          <h1>Club Created Succesfully!</h1>
          <br />
          <p>
            <a href="/">Go • to • Home</a>
          </p>
        </section>
      )}
    </>
  );
};

export default CreateAClub;
