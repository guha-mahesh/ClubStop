//this is NOT the page. This is for when the club shows up as a card that links to the page.
//it would be like what shows up when a user goes to "my clubs" or what shows up when you search up computer science clubs

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../../assets/react.svg";


interface Props {
  leader: string,
  ClubName: string;
  ClubDescription: String;
  School: String;
  id? : string;
}


function Clubs({ leader, ClubName, ClubDescription, School, id = "" }: Props) {
  const navigate = useNavigate();

  const handleClubClick = () => {
    if (id) {
      navigate(`/club/${id}`);
    }
  };

  return (
    <div>
      <div className="clubLink" onClick={handleClubClick} style={{ cursor: 'pointer' }}>
        <section className="clubCard">
          <div className="clubTop">
            <div className="clubTitle">
              {ClubName}
              <br />
              <div className="clubAuthor">By: {leader}</div>
            </div>

            <div className="clubDescription">
              {ClubDescription}
            </div>
          </div>
          <div className="clubPhotoContainer">
            <img className="clubPhoto" src={home} alt="Club" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Clubs;
