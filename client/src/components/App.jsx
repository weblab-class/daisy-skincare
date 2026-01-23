import { Outlet, Link, useLocation } from "react-router-dom";
import React from "react";
import { Outlet } from "react-router-dom";
import "../utilities.css";
import "./App.css";

const App = () => {
  return (
    <>
      <div className="App-container">
        <Outlet />
      </div>
    </>
  );
};

export default App;
