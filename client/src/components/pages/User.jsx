import React, { useState, useEffect } from "react";
import { Recent } from "../modules/Recent.jsx";

import "../../utilities.css";
import "./User.css";

const User = () => {
  useEffect(() => {
    document.title = "User Profile Page";
  }, []);
  return (
    <div className="user-page-wrapper">
      <div className="Profile-avatarContainer">
        <div className="Profile-avatar" />
      </div>
      <h1 className="Profile-name u-textCenter">Anonymous User</h1>
      <hr className="Profile-line" />
      <div className="u-flex">
        <div id="profile-description">
          beli but for skincare user
        </div>
        <div className="Profile-subContainer u-textCenter">
          <h4 className="Profile-subTitle">Recent Products Rated</h4>
          <Recent />
        </div>
        <h1 className="Profile-name">Anonymous User</h1>
        <hr className="Profile-line" />
        <div id="Profile-description">beli but for skincare user</div>
      </div>
      {/** profile ratings start here */}
      <div className="Profile-subContainer">
        <h4 className="Profile-subTitle">Recent Products Rated</h4>
        <Recent />
      </div>
    </div>
  );
};

export default User;
