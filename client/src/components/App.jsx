import { Outlet, Link, useLocation } from "react-router-dom";
import "../utilities.css";
import "./App.css";
import homepage from "../assets/homepage.png";


/** Homepage */

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <div
        className="App-container"
        style={isHomePage ? { backgroundImage: `url(${homepage})` } : { padding: 0 }}
      >
        {isHomePage && (
          <>
            <h1 className="text-purple-500">Skincare Website</h1>
            <Link to="/product" className="browse-link">
              Browse Products
            </Link>
            <Link to="/user" className="User-link">
              User Profile
            </Link>
            <div className="spacer"></div>
          </>
        )}

        <Outlet />
      </div>
    </>
  );
};

export default App;
