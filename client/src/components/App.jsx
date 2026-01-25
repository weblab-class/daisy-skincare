import React from "react";
import { Outlet } from "react-router-dom";

import NavBar from "./modules/NavBar";
import "../utilities.css";
import "./App.css";

import { get, post } from "../utilities";
import { useState, useEffect } from "react";
import { UserContext } from "./context/UserContext";

/** base application (not homepage)
 *  includes navbar + homepage >> feed
*/

const App = () => {
  const [userId, setUserId] = useState(null);

  // check if registed user in the database and currently logged in
  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        setUserId(user._id);
      }
    });
  }, []);

  // login function
  // 'res' contains the response from Google's authentication servers
  const handleLogin = (res) => {
    console.log(res);

    // server verification of login
    const userToken = res.credential;
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      console.log(user);
    });
  };

  // logout function
  const handleLogout = () => {
    console.log("Logged out successfully!");
    post("/api/logout");
    setUserId(null);
  };

  return (
    <>
      <UserContext.Provider value={userId}>
        <NavBar handleLogin={handleLogin} handleLogout={handleLogout} />
        <div className="App-container">
          <Outlet />
        </div>
      </UserContext.Provider>
    </>
  );
};

export default App;
