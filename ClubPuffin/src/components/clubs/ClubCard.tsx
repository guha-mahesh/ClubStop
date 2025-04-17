//this is NOT the page. This is for when the club shows up as a card that links to the page.
//it would be like what shows up when a user goes to "my clubs" or what shows up when you search up computer science clubs

import { useEffect, useState } from "react";
import home from "../../assets/react.svg";

interface Props {
  id?: string;
}

interface ClubData {
  creator: string;
  ClubName: string;
  ClubDescription?: string;
  School: string;
  _id: string;
}

function Clubs({ id = "" }: Props) {
  const [clubData, setClubData] = useState<ClubData | null>(null);

  useEffect(() => {
    if (id) {
      console.log(id);
      fetch(`/clubs?club=${encodeURIComponent(id)}`)
        .then((response) => response.json())
        .then((data) => setClubData(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  return (
    <div>
      {clubData ? (
        <a className="clubLink" href={`/club/${id}`}>
          <section className="clubCard">
            <div className="clubTop">
              <div className="clubTitle">
                {clubData.ClubName}
                <br />
                <div className="clubAuthor">By: {clubData.creator}</div>
              </div>

              <div className="clubDescription">
                {clubData.ClubDescription
                  ? clubData.ClubDescription
                  : "No description available"}
              </div>
            </div>
            <div className="clubPhotoContainer">
              <img className="clubPhoto" src={home}></img>
            </div>
          </section>
        </a>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Clubs;
