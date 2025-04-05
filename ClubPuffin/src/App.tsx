import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { GlobalProvider } from "./Global";
import Home from "./pages/home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login";
import CreateAClub from "./pages/CreateAClub";
function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login></Login>} />
          <Route path="/CreateClub" element={<CreateAClub></CreateAClub>} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
