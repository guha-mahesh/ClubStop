import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from './contexts/AuthContexts'
import Home from "./pages/home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login";
import CreateAClub from "./pages/CreateAClub/CreateAClub";
import MyClubs from "./pages/MyClubs/MyClubs";
import ClubPage from "./pages/ClubPage/ClubPage";
import ConfigureProfile from "./components/ConfigureProfile";
import ViewYourReview from "./pages/ViewYourReview";
import UserPage from "./pages/UserPage";
import EditClubPage from "./pages/ClubPage/EditClubPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CreateClub" element={<CreateAClub />} />
          <Route path="/MyClubs" element={<MyClubs />} />
          <Route path="/club/:clubID" element={<ClubPage />} />
          <Route
            path="/configureProfile"
            element={<ConfigureProfile></ConfigureProfile>}
          />
           <Route
            path="/viewRating/:clubID"
            element={<ViewYourReview></ViewYourReview>}
          />
          <Route
            path="/UserPage/:userID"
            element={<UserPage></UserPage>}
            
          />
          <Route
            path="/editClub/:clubID"
            element={<EditClubPage></EditClubPage>}
          />
        </Routes>
         
      </Router>
      </AuthProvider>

  );
}

export default App;
