import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { useParams } from "react-router-dom";

import "../../utilities.css";
import "./User.css";
import vines from "../../assets/vines.png";
import { Recent } from "../modules/Recent.jsx";
import SingleReview from "../modules/SingleReview";
import "../modules/Ratings.css"; // Import the Ratings.css

const User = () => {
  let userID = useParams().userID;
  const [user, setUser] = useState();
  const [ratings, setRatings] = useState([]);

  // user verification + tracking
  useEffect(() => {
    document.title = "User Profile Page";
    get(`/api/user`, { userid: userID }).then((userObj) => setUser(userObj));
  }, [userID]);

  // get user's ratings
  useEffect(() => {
    if (!userID) return;

    get("/api/userratings", { user_id: userID }).then((data) => {
      console.log("Fetched ratings:", data);
      setRatings(data);
    });
  }, [userID]);

  // wrong user
  if (!user) {
    return <div> Loading! Please sign in again. </div>;
  }

  return (
    <div className="max-w-4xl mx-auto min-h-screen">
      {/* Profile Header*/}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border
      border-white/40 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a3d0c9] to-[#00d4ff]
          rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <div className="relative w-100% h-100% bg-gray-200 rounded-full border-4 border-white
          overflow-hidden shadow-inner">
            {/* User initial */}
            <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center text-4xl text-gray-400">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className="mt-6 text-4xl font-serif italic text-slate-800 tracking-tight">
          {user.name}
        </h1>

        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full
        bg-[#a3d0c9]/20 text-[#5ba197] text-xs font-semibold uppercase tracking-widest">
          Skincare Enthusiast
        </div>
      </div>
      <div className="p-5"></div>
      <div className="flex items-center justify-between mb-6 p-5">
        <h4 className="text-3xl font-serif italic text-slate-800">
          My Recent Ratings
        </h4>
        <div className="h-[1px] flex-grow mx-4 bg-slate-200"></div>
      </div>
      <div className="space-y-4">
        <Recent />

      {/* Main Content Grid */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-serif italic text-slate-800">
            Reviews
          </h4>
          <div className="h-[1px] flex-grow mx-4 bg-slate-200"></div>
        </div>

        <div className="space-y-4">
          {ratings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No reviews yet!
            </div>
          ) : (
            ratings.map((review) => (
              <div key={`Review_${review._id}`} className="Review-container">
                <SingleReview
                  _id={review._id}
                  content={review.content}
                  image={review.image}
                  product={review.product}
                  product_id={review.product_id}
                  brand={review.brand}
                  rating_value={review.rating_value}
                  creator_id={review.creator_id || userID}
                  creator_name={review.creator_name || user.name}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
