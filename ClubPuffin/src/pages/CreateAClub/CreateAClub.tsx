//This is a page that lets you create a club

import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "../../Global";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";
const clubUrl = "/ClubCreate";

const CreateAClub: React.FC = () => {
  const [clubName, setClubName] = useState<string>("");
  const [clubSchool, setClubSchool] = useState<string>("");
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
    user: string;
    school: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

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
          school: clubSchool,
          user: user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(success);
      console.log("Club created:", response.data);
      setSuccess(true);
      navigate("/");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating club:", error);
      setErrorMessage("Error creating club. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        {signed ? (
          !success ? (
            <form onSubmit={handleSubmit} className="club-form">
              <label htmlFor="clubName" className="label">
                Club Name
              </label>
              <input
                ref={userRef}
                id="clubName"
                maxLength={20}
                required
                type="text"
                value={clubName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClubName(e.target.value)
                }
                className="input-field"
              />

              <label htmlFor="clubDesc" className="label">
                Club Description
              </label>
              <textarea
                id="clubDesc"
                required
                value={clubDesc}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setClubDesc(e.target.value)
                }
                className="textarea-field"
              />
              <label htmlFor="clubSchool" className="label">
                What University/School is this club at?
              </label>
              <input
                ref={userRef}
                id="clubSchool"
                maxLength={30}
                required
                type="text"
                value={clubSchool}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setClubSchool(e.target.value)
                }
                className="input-field"
              />

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          ) : (
            <section className="success-message">
              <h1>Club Created Successfully!</h1>
              <p>
                <a href="/" className="home-link">
                  Go • to • Home
                </a>
              </p>
            </section>
          )
        ) : (
          <div className="login-prompt">Log in</div>
        )}
      </div>
    </>
  );
};

export default CreateAClub;
