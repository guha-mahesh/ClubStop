import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import "./pages/home/Home.css";
import "./pages/Register/Register.css";
import "./components/Profile/Profile.css";
import "./components/clubs/Clubs.css";
import "./components/Search/Search.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
