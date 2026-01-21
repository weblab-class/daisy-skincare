import React, { useState, useEffect } from "react";
import Ratings from "../modules/Ratings";
import { get, post } from "../../utilities.js";
import { NewReview } from "../modules/NewInput.jsx"; // Import NewReview


const Feed = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    get("/api/ratings").then((ratings) => {
      setRatings(ratings);
    });
  }, []);

  const submitNewReview = (reviewObj) => {
    post("/api/rating", reviewObj).then((rating) => {
      setRatings([rating, ...ratings]); // Add new rating to the top
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
    <div className="Feed-container">
      <NewReview onSubmit={submitNewReview} /> {/* Render NewReview component */}
      {ratingsList}
    </div>
  );
};

export default Feed;
