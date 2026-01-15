import React from "react";
import "../utilities.css";
import "./App.css";

import Feed from "./pages/Feed"
import homepage from "../assets/homepage.png";

/** Homepage */

const App = () => {
  return (
    <>
      <div
      className="App-container"
      style={{ backgroundImage: `url(${homepage})` }}
      >
        <h1>Skincare Website</h1>
        <Feed />
      </div>
    </>
  );
};

export default App;
