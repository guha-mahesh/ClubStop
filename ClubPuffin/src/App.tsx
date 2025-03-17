import { useState } from "react";
import Oval from "./components/oval";

function App() {
  return (
    <div className="ovarian-goats">
      <Oval color="red" header="Ratings" onPress={console.log}></Oval>
      <Oval header="Photo Gallery" onPress={console.log}></Oval>
      <Oval color="blue" header="Description" onPress={console.log}></Oval>
    </div>
  );
}

export default App;
