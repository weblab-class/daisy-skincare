import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { get, post } from "../../utilities.js";
import { NewReview } from "../modules/NewInput.jsx";
import { UserContext } from "../context/UserContext";

import "./Feed.css";
import Ratings from "../modules/Ratings";


const Feed = () => {
  const [ratings, setRatings] = useState([]);
  const userID = useContext(UserContext);

  // ratings connected to backend
  useEffect(() => {
    get("/api/ratings").then((ratings) => {
      setRatings(ratings);
    });
  }, []);

  const submitNewReview = (reviewObj) => {
    post("/api/rating", reviewObj).then((rating) => {
      setRatings([rating, ...ratings]);
    });
  };

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
    <>
      <div className="Feed-container">
        <NewReview onSubmit={submitNewReview} />
        {ratingsList}
      </div>
    </>
  );
};

export default Feed;
