import React from "react";
import "../utilities.css";
import "./App.css";
import homepage from "../assets/homepage.png";

/**
 * Define the "App" component as a function.
 */

const App = () => {
  return (
    <>
      <div
      className="App-container"
      style={{ backgroundImage: `url(${homepage})` }}
      >
        <h1>Skincare Website</h1>
      </div>
    </>
  );
};

export default App;
