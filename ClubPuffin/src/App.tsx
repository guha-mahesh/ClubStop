import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { GlobalProvider } from "./Global";
import Home from "./pages/home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login";
import CreateAClub from "./pages/CreateAClub";
import MyClubs from "./pages/MyClubs/MyClubs";
import ClubPage from "./pages/ClubPage/ClubPage";
import Delete from "./pages/Delete";
import ConfigureProfile from "./components/ConfigureProfile";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CreateClub" element={<CreateAClub />} />
          <Route path="/MyClubs" element={<MyClubs />} />
          <Route path="/club/:clubID" element={<ClubPage />} />
          <Route path="/deleteUser" element={<Delete></Delete>} />
          <Route
            path="/configureProfile"
            element={<ConfigureProfile></ConfigureProfile>}
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
