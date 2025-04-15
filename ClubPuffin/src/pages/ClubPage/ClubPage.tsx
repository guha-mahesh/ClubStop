//THIS is a clubPage, we can prob make a lot of this stuff components but we need to be careful w the backend,,,

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ScreenHeader from "../../components/ScreenHeader";
import axios from "axios";
import { useGlobalContext } from "../../Global";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";
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
interface ClubData {
  creator: string;
  ClubName: string;
  ClubDescription?: string;
  Ratings?: Ratings[];
  _id: string;
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

  useEffect(() => {
    if (clubID) {
      console.log(clubID);
      fetch(`http://localhost:5000/clubs?club=${encodeURIComponent(clubID)}`)
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
      fetch(`http://localhost:5000/users?user=${encodeURIComponent(user)}`, {
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

  const hasRatedClub = (clubID: string, userData: UserData | null): boolean => {
    if (userData && userData.Ratedclubs) {
      return userData.Ratedclubs.some((club) => club.clubID === clubID);
    }
    return false;
  };
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
      console.error("User not found in localStorage.");
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

      <div>
        <div className="clubNameHeader">
          <h1>{clubData.ClubName}</h1>
          {member ? <h1>Member :)</h1> : null}
        </div>
        <button
          onClick={() => {
            if (clubID && userData) {
              if (hasRatedClub(clubID, userData)) {
                setRatingError("You have already rated this club.");
              } else {
                setRate(true);
              }
            }
          }}
        >
          Rate Club
        </button>

        {ratingError && <p className="error-message">{ratingError}</p>}
        <p>
          <strong>Creator:</strong> {clubData.creator}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {clubData.ClubDescription || "No description available."}
        </p>
        {clubData.Ratings ? (
          <div className="ratings">
            {`Ascendancy: ${avgAscendancy}`}
            <br />
            {`Camaraderie: ${avgCamaraderie}`}
            <br />
            {`Prestige: ${avgPrestige}`}
            <br />
            {`Obligation: ${avgObligation}`}
            <br />
            {`Legacy: ${avgLegacy}`}
            <br />
            {`Total: ${avgTotal}`}
          </div>
        ) : null}
        {!member ? <button onClick={handleJoin}>Join this Club</button> : null}
      </div>
    </>
  );
};

export default ClubPage;
