import React from "react";
import ReactDOM from "react-dom/client";
import Overview from "./Overview";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Overview />
  </React.StrictMode>
);
