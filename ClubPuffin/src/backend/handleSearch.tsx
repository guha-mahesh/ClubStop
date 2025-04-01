import { clubLinks } from "./clubNames";

export const showAlert = (clubName: string) => {
  const lowerCaseClubName = clubName.toLowerCase() as keyof typeof clubLinks;

  if (clubLinks[lowerCaseClubName]) {
    window.location.href = clubLinks[lowerCaseClubName];
  } else {
    alert("Club not found!");
  }
};
