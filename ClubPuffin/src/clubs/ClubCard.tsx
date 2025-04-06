import { useEffect, useState } from "react";

interface Props {
  id?: string;
}

interface ClubData {
  creator: string;
  ClubName: string;
  ClubDescription?: string;
}

function Clubs({ id = "" }: Props) {
  const [clubData, setClubData] = useState<ClubData | null>(null);

  useEffect(() => {
    if (id) {
      console.log(id);
      fetch(`http://localhost:5000/clubs?club=${encodeURIComponent(id)}`)
        .then((response) => response.json())
        .then((data) => setClubData(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  return (
    <div>
      {clubData ? (
        <section>
          <div className="title">
            {clubData.ClubName}
            <br />
            <span>By: {clubData.creator}</span>
          </div>
          <div className="description">
            {clubData.ClubDescription
              ? clubData.ClubDescription
              : "No description available"}
          </div>
          <a href={`/club/${id}`}>Go to Club!</a>
        </section>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Clubs;
