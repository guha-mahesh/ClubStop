import React from "react";
import ReactDOM from "react-dom/client";
import Overview from "./overview/Overview";
import Clubs from "./clubs/Clubs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./overview/Overview.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Overview />
  </React.StrictMode>
);
