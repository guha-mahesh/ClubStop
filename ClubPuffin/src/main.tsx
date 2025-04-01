import React from "react";
import ReactDOM from "react-dom/client";
import Overview from "./pages/overview/Overview";
import Clubs from "./clubs/Clubs";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./pages/overview/Overview.css";
import "./pages/home/Home.css";
import "./components/Register/Register.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
