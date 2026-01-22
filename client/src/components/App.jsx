import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../utilities.css";
import "./App.css";

import homepage from "../assets/homepage.png";

/** Homepage */

const App = () => {
  return (
    <>
      <div className="App-container">
        <div className="App-home"
        style={{ backgroundImage: `url(${homepage})` }}
        >
        <h1>Skincare Website</h1>
        <Link to="/user" className="User-link">
          User Profile
        </Link>
        <div class="spacer"></div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
