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
    <div className="max-w-4xl mx-auto min-h-screen pt-12 px-6">
      {/* Profile Header Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white/40 flex flex-col items-center">
        {/* Avatar with a 'Glow' ring */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a3d0c9] to-[#00d4ff] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative w-32 h-32 bg-gray-200 rounded-full border-4 border-white overflow-hidden shadow-inner">
            {/* If user has an image, put it here */}
            <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-4xl text-gray-400">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="mt-6 text-4xl font-serif italic text-slate-800 tracking-tight">
          {user.name}
        </h1>

        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#a3d0c9]/20 text-[#5ba197] text-xs font-semibold uppercase tracking-widest">
          Skincare Enthusiast
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Right Side: Recent Products */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-serif italic text-slate-800">
              Recent Ratings
            </h4>
            <div className="h-[1px] flex-grow mx-4 bg-slate-200"></div>
          </div>

          <div className="space-y-4">
            <Recent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
