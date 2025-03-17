import { useState } from "react";
import Oval from "./components/Oval";
import Search from "./components/Search";
import Ratings from "./components/Ratings";

function App() {
  return (
    <div>
      <div className="Top-Screen">
        <div className="ovarian-goats">
          <Oval
            color="red"
            header="Ratings"
            onPress={console.log}
            reason="forButton"
          ></Oval>
          <Oval
            header="Photo Gallery"
            onPress={console.log}
            reason="forButton"
          ></Oval>
          <Oval
            color="blue"
            header="Description"
            onPress={console.log}
            reason="forButton"
          ></Oval>
        </div>
        <div className="SearchFlex">
          <Search placeholder="Search for Clubs, Orgs, etc"></Search>
        </div>
      </div>
      <div className="Middle-Screen">
        <Ratings header="Camraderie" rating="92" color="navy"></Ratings>
        <Ratings header="Ascendancy" rating="92" color="swamp"></Ratings>
        <Ratings header="Prestige" rating="92" color="orange"></Ratings>
        <Ratings header="Obligation" rating="92" color="green"></Ratings>
        <Ratings header="Legacy" rating="92" color="pinkred"></Ratings>
      </div>
    </div>
  );
}

export default App;
