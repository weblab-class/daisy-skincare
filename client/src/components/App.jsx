import { Outlet, Link, useLocation } from "react-router-dom";
import React from "react";
import "../utilities.css";
import "./App.css";

const App = () => {
  return (
    <>
      <div className="App-container">
      </div>
      <Link to="/product" className="browse-link">
          Browse Product
      </Link>
      <Link to="/user" className="User-link">
          hgjhgjhgbjhbje
      </Link>
      <div className = "spacer"></div>
      <Outlet />

    </>
  );
};

export default App;
