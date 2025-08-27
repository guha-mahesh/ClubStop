import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import "./pages/home/Home.css";
import "./pages/Register/Register.css";
import "./components/cards/Profile/Profile.css";
import "./components/cards/clubs/Clubs.css";
import "./components/ui/Search.css";
import "./pages/MyClubs/MyClubs.css";
import "./pages/ClubPage/ClubPage.css";
import "./pages/CreateAClub/CreateAClub.css";
import './components/Flair.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);