import React from "react";
import ReactDOM from "react-dom/client";
import Overview from "./overview/Overview";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./Overview.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Overview />
  </React.StrictMode>
);
