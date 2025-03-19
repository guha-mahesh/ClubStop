import { useState } from "react";
import Oval from "./components/Oval";
import Search from "./components/Search";
import Ratings from "./components/Ratings";
import homeIcon from "./assets/home.png";
import Puffin from "./components/Puffin";
import ScreenHeader from "./components/ScreenHeader";
import ScreenMiddle from "./components/ScreenMiddle";

function App() {
  return (
    <div>
      <ScreenHeader></ScreenHeader>
      <ScreenMiddle></ScreenMiddle>
    </div>
  );
}

export default App;
