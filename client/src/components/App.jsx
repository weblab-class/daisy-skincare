import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import NavBar from "./modules/NavBar";
import "../utilities.css";
import "./App.css";

import { get, post } from "../utilities";
import { socket } from "../client-socket";
import { UserContext } from "./context/UserContext";

const App = () => {
  const [userID, setUserID] = useState(null);

  // check if registered user in the database and currently logged in
  useEffect(() => {
    get("/api/whoami")
      .then((user) => {
        console.log("whoami user:", user);
        if (user._id) {
          setUserID(user._id);
        }
      })
      .catch((err) => {
        console.log("whoami error:", err);
      });
  }, []);

  // login function
  const handleLogin = (res) => {
    const userToken = res.credential;
    post("/api/login", { token: userToken }).then((user) => {
      setUserID(user._id);
      console.log(user);
    });
  };

  // logout function
  const handleLogout = () => {
    post("/api/logout");
    setUserID(null);
  };

  return (
    <UserContext.Provider value={ userID }>
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} />
      <div className="App-container">
        <Outlet />
      </div>
    </UserContext.Provider>
  );
};

export default App;
