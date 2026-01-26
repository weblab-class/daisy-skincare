import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { useParams } from "react-router-dom";

import "../../utilities.css";
import "./User.css";
import { Recent } from "../modules/Recent.jsx";

const User = () => {
  let userID = useParams().userID;
  const [user, setUser] = useState();

  // user verification + tracking
  useEffect(() => {
    document.title = "User Profile Page";
    get(`/api/user`, { userid: userID }).then((userObj) => setUser(userObj));
  }, []);

  // wrong user
  if (!user) {
    return <div> Loading! Please sign in again. </div>;
  }

  return (
    <div className="user-page-wrapper">
      <div className="Profile-avatarContainer">
        <div className="Profile-avatar" />
      </div>
      <h1 className="Profile-name u-textCenter"> {user.name} </h1>
      <hr className="Profile-line" />
      <div className="u-flex">
        <div id="profile-description">
          beli but for skincare user
        </div>
        <div className="Profile-subContainer u-textCenter">
          <h4 className="Profile-subTitle">Recent Products Rated</h4>
          <Recent />
        </div>
      </div>
    </div>
  );
};

export default User;
