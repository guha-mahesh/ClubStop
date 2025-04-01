import ScreenHeader from "../../components/ScreenHeader";
import Search from "../../components/Search";
import { showAlert } from "../../backend/handleSearch";

const Home = () => {
  return (
    <div>
      <ScreenHeader />

      <div className="content-app">
        <div className="left-section">
          <h1>
            Looking for a club at <br /> <span>Northeastern?</span>
          </h1>
          <p>Search for what you're interested in:</p>

          <Search onChange={showAlert} placeholder="Computer Science" />

          <button className="login-btn">Or log in to join clubs →</button>

          <div className="puffin">
            <img src="puffin.png" alt="Puffin Mascot" />
          </div>
        </div>

        <div className="right-section">
          <h2>Popular clubs</h2>

          <div className="club-list">
            <div className="club">
              <img src="club-placeholder.png" alt="Club Icon" />
              <span>Club Name</span>
            </div>

            <div className="club">
              <img src="club-placeholder.png" alt="Club Icon" />
              <span>Club Name</span>
            </div>

            <div className="club">
              <img src="club-placeholder.png" alt="Club Icon" />
              <span>Club Name</span>
            </div>

            <div className="club">
              <img src="club-placeholder.png" alt="Club Icon" />
              <span>Club Name</span>
            </div>
          </div>
        </div>
      </div>
    </div> // ✅ Removed semicolon
  );
};

export default Home;
