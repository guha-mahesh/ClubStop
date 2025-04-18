//THIS is a clubPage, we can prob make a lot of this stuff components but we need to be careful w the backend,,,

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ScreenHeader from "../../components/ScreenHeader";
import axios from "axios";
import { useGlobalContext } from "../../Global";
import { useNavigate } from "react-router-dom";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import feather from "../../assets/FeatherIcon.png";

axios.defaults.baseURL = "";
const clubUrl = "/ClubRate";
const joinClub = "/joinClub";

interface Ratings {
  camaraderie: number;
  ascendancy: number;
  prestige: number;
  obligation: number;
  legacy: number;
  total: number;
}
interface Club {
  clubID: string;
  clubName: string;
}
interface member {
  memberUserID: string;
  role: string;
}
interface ClubData {
  creator: string;
  ClubName: string;
  ClubDescription?: string;
  Ratings?: Ratings[];
  _id: string;
  members: member[];
}
interface RatedClubs {
  clubName: string;
  clubID: string;
}
interface JoinedClubs {
  clubName: string;
  clubID: string;
}
interface UserData {
  username: string;
  password: string;
  clubs: Club[];
  Ratedclubs: RatedClubs[];
  joinedClubs: JoinedClubs[];
  _id: string;
}
interface ClubRate {
  name: string;
  ascendancy: number;
  camaraderie: number;
  legacy: number;
  obligation: number;
  prestige: number;
  total: number;
  clubID: string;
  clubName: string;
}
interface Response {
  message: string;
}

const ClubPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { signed, setSigned } = useGlobalContext();
  const { clubID } = useParams<{ clubID: string }>();
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [rate, setRate] = useState<boolean>(false);
  const [camaraderie, setCamaraderie] = useState<string>("");
  const [ascendancy, setAscendancy] = useState<string>("");
  const [prestige, setPrestige] = useState<string>("");
  const [obligation, setObligation] = useState<string>("");
  const [legacy, setLegacy] = useState<string>("");
  const [ratingError, setRatingError] = useState<string>("");
  const [member, setMember] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [hasRated, setHasRated] = useState<boolean>(false);

  useEffect(() => {
    console.log(userData?._id);
    const member = clubData?.members.find(
      (m) => m.memberUserID === userData?._id
    );
    if (member) {
      setRole(member.role);
    } else {
      setRole("member");
    }
  }, [userData, clubData]);

  useEffect(() => {
    if (clubID) {
      console.log(clubID);
      fetch(`/clubs?club=${encodeURIComponent(clubID)}`)
        .then((response) => response.json())
        .then((data) => setClubData(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [clubID]);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const storedSigned = localStorage.getItem("signed") === "true";
    if (storedSigned === true) {
      setSigned(true);
    } else {
      setSigned(false);
    }
    if (user) {
      fetch(`/users?user=${encodeURIComponent(user)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Error occurred");
            });
          }
          return response.json();
        })
        .then((data) => setUserData(data))
        .catch((error) => {
          console.error("Error:", error);
          setUserData(null); // Set userData to null if an error occurs
          localStorage.clear();
          setSigned(false);
          navigate("/");
        });
    }
  }, []);
  useEffect(() => {
    if (userData && clubData && userData.joinedClubs) {
      if (userData.joinedClubs.some((club) => club.clubID === clubData._id)) {
        setMember(true);
      } else {
        setMember(false);
      }
    }
  }, [userData, clubData]);
  useEffect(() => {
    if (userData && userData.Ratedclubs) {
      if (userData.Ratedclubs.some((club) => club.clubID === clubID)) {
        setHasRated(false);
      }
    }
  }, [clubData, userData]);

  const clearInputs = () => {
    setCamaraderie("");
    setAscendancy("");
    setPrestige("");
    setObligation("");
    setLegacy("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    e.preventDefault();
    if (hasRated) {
      navigate("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }

    if (!user || !clubData) {
      return;
    }

    const total =
      (parseFloat(ascendancy) +
        parseFloat(camaraderie) +
        parseFloat(legacy) +
        parseFloat(prestige) +
        parseFloat(obligation)) /
      5;

    try {
      const response = await axios.post<ClubRate>(
        clubUrl,
        {
          name: user,
          clubID: clubID,
          ascendancy: parseFloat(ascendancy),
          camaraderie: parseFloat(camaraderie),
          legacy: parseFloat(legacy),
          prestige: parseFloat(prestige),
          obligation: parseFloat(obligation),
          total: total,
          clubName: clubData.ClubName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Club rated:", response.data);
      clearInputs();
      setRate(false);
      setHasRated(true);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  function calculateAverageTrait(club: ClubData, trait: keyof Ratings): number {
    if (!club.Ratings || club.Ratings.length === 0) {
      return 0;
    }

    const totalTrait = club.Ratings.reduce(
      (sum, rating) => sum + rating[trait],
      0
    );
    const averageTrait = totalTrait / club.Ratings.length;

    return averageTrait;
  }

  if (!clubData) {
    return null;
  }

  const avgAscendancy = calculateAverageTrait(clubData, "ascendancy");
  const avgCamaraderie = calculateAverageTrait(clubData, "camaraderie");
  const avgObligation = calculateAverageTrait(clubData, "obligation");
  const avgPrestige = calculateAverageTrait(clubData, "prestige");
  const avgLegacy = calculateAverageTrait(clubData, "legacy");
  const avgTotal = calculateAverageTrait(clubData, "total");

  const handleJoin = async () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user) {
      navigate("/Login");
      return;
    }

    try {
      const response = await axios.post<Response>(
        joinClub,
        {
          name: user,
          ClubID: clubID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Club Joined:", response.data);
        setMember(true);
        window.location.reload();
      } else {
        console.error(
          "Failed to join club:",
          response.data.message || "Unknown error."
        );
      }
    } catch (res) {
      // @ts-ignore
      if (response.status === 400) {
        console.log("Already a member");
      }
    }
  };

  return (
    <>
      <ScreenHeader />
      {!rate ? (
        <div>
          <div className="clubNameHeader">
            <div className="clubNameHeader topPart">
              <h1 className="clubNameText">{clubData.ClubName}</h1>
              <div className="iconic">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={member ? "valid membIcon" : "hide"}
                />
                <h4 className="tooltip">You are a {role}!</h4>
              </div>
            </div>
            <strong>By:</strong> {clubData.creator}
          </div>

          <div className="ClubContent">
            {clubData.Ratings ? (
              <div className="ratings">
                <h1 className="ratingBox ratingBox1">
                  Ascendancy: <span>{avgAscendancy}</span>
                </h1>
                <br />
                <h1 className="ratingBox ratingBox2">
                  Camaraderie: <span>{avgCamaraderie}</span>
                </h1>
                <br />
                <h1 className="ratingBox ratingBox3">
                  Prestige: <span>{avgPrestige}</span>
                </h1>
                <br />
                <h1 className="ratingBox ratingBox4">
                  Obligation: <span>{avgObligation}</span>
                </h1>
                <br />
                <h1 className="ratingBox ratingBox5">
                  Legacy: <span>{avgLegacy}</span>
                </h1>
                <br />
                <h1 className="ratingBox ratingBox6">
                  Overall: <span>{avgTotal}</span>
                </h1>
              </div>
            ) : (
              <div className="ratings">
                <h1 className="ratingBox ratingBox1">Ascendancy: none</h1>
                <br />
                <h1 className="ratingBox ratingBox2">Camaraderie: none</h1>
                <br />
                <h1 className="ratingBox ratingBox3">Prestige: none</h1>
                <br />
                <h1 className="ratingBox ratingBox4">Obligation: none</h1>
                <br />
                <h1 className="ratingBox ratingBox5">Legacy: none</h1>
                <br />
                <h1 className="ratingBox ratingBox6">Overall: none</h1>
              </div>
            )}
            <img className="featherIcon featherIconClubPage" src={feather} />
            <p className="description">
              {clubData.ClubDescription || "No description available."}
            </p>
            <img
              className="featherIcon featherIconClubPage"
              id="featherIcon2clubpage"
              src={feather}
            />
            <div className="rightScreen">
              {!member ? (
                <button className="clubPageBtn" onClick={handleJoin}>
                  Join Club
                </button>
              ) : null}
              <br />
              <button
                className="clubPageBtn"
                onClick={() => {
                  if (!userData) {
                    navigate("/Login");
                  }
                  if (clubID && userData && !hasRated) {
                    setRate(true);
                  }
                }}
              >
                Rate Club
              </button>
              {ratingError && <p className="error-message">{ratingError}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="rating-form">
          <button className="back-button" onClick={() => setRate(false)}>
            Back
          </button>
          <form className="rating-form-body" onSubmit={handleSubmit}>
            <div className="rating-input-group">
              <label htmlFor="camaraderie" className="rating-label">
                Camaraderie
              </label>
              <input
                id="camaraderie"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={camaraderie}
                onChange={(e) => setCamaraderie(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={camaraderie}
                onChange={(e) => setCamaraderie(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="ascendancy" className="rating-label">
                Ascendancy
              </label>
              <input
                id="ascendancy"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={ascendancy}
                onChange={(e) => setAscendancy(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={ascendancy}
                onChange={(e) => setAscendancy(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="prestige" className="rating-label">
                Prestige
              </label>
              <input
                id="prestige"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={prestige}
                onChange={(e) => setPrestige(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={prestige}
                onChange={(e) => setPrestige(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="obligation" className="rating-label">
                Obligation
              </label>
              <input
                id="obligation"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={obligation}
                onChange={(e) => setObligation(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={obligation}
                onChange={(e) => setObligation(e.target.value)}
                required
              />
            </div>

            <div className="rating-input-group">
              <label htmlFor="legacy" className="rating-label">
                Legacy
              </label>
              <input
                id="legacy"
                className="rating-slider"
                type="range"
                min="1"
                max="100"
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
                required
              />
              <input
                className="rating-number"
                type="number"
                min="1"
                max="100"
                value={legacy}
                onChange={(e) => setLegacy(e.target.value)}
                required
              />
            </div>

            <button className="submit-rating-button" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ClubPage;
