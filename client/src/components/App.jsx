import React from "react";
import { Outlet } from "react-router-dom";
import "../utilities.css";
import "./App.css";
import homepage from "../assets/homepage.png";

/** Homepage */

const App = () => {
  return (
    <>
      <div
        className="App-container"
        style={{ backgroundImage: `url(${homepage})` }}
      >
        <h1 className="text-purple-500">Skincare Website</h1>
        <div class="spacer"></div>

        <Outlet />
      </div>
    </>
  );
};

export default App;
