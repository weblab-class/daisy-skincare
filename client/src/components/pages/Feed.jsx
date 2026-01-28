import React, { useState, useEffect, useContext } from "react";
import { get, post } from "../../utilities.js";
import { NewReview } from "../modules/NewInput.jsx";
import { UserContext } from "../context/UserContext";
import { useLocation, Link, Outlet } from "react-router-dom";
import Review from "../pages/Review.jsx";

import "./Feed.css";
import Ratings from "../modules/Ratings";
import newreview from "../../assets/newreview.png"; // Import the image

const Feed = () => {
  const [ratings, setRatings] = useState([]);
  const userID = useContext(UserContext);
  const location = useLocation();

  // ratings connected to backend (chronologically reversed)
  // where most recent ratings are on top
  useEffect(() => {
    get("/api/feed").then((ratingsObjs) => {
      let reversedRatingsObjs = ratingsObjs.reverse();
      setRatings(reversedRatingsObjs);
    });
  }, []);

  // submit new skincare review
  // modified from before to handle ratings list better
  const submitNewReview = (reviewObj) => {
    setRatings([reviewObj].concat(ratings));
  };

  // combine ratings into list
  let ratingsList = null;
  const hasRatings = ratings.length !== 0;

  if (hasRatings) {
    ratingsList = ratings.map((reviewObj) => (
      <Ratings
        key={`Review_${reviewObj._id}`}
        _id={reviewObj._id}
        creator_name={reviewObj.user_name}
        content={reviewObj.content}
        image={reviewObj.image}
        product={reviewObj.product}
        brand={reviewObj.brand}
        rating_value={reviewObj.rating_value}
      />
    ));
  } else {
    ratingsList = <div>No ratings currently!</div>;
  }

  return (
    <div className="Feed-container relative">
      <Link
        to="/feed/newReview"
        className="fixed bottom-10 right-10 w-23 h-23 bg-[#a3d0c9] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30 text-3xl"
      >
        +
      </Link>

      <Outlet context={{ addNewReview: submitNewReview }} />
      <div className="Feed-list">{ratingsList}</div>
    </div>
  );
};

export default Feed;
