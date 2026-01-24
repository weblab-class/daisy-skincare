import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import "../utilities.css";
import NavBar from "./modules/NavBar";
import Home from "./pages/Home";

/** Base Application (not homepage) */

const App = () => {
  return (
    <>
      <div className="App-container">
        <NavBar />
        <Outlet />
      </div>
    </>
  );
};

export default App;
