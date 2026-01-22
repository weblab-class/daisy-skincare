import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Ratings from "../modules/Ratings";
import { get, post } from "../../utilities.js";
import { NewReview } from "../modules/NewInput.jsx"; // Import NewReview
import homepage from "../../assets/homepage.png";
import "./Feed.css";


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
    <>
      <div className="Feed-home" style={{ backgroundImage: `url(${homepage})` }}>
        <h1>Skincare Website</h1>
        <Link to="/user" className="User-link">
          User Profile
        </Link>
        <div className="spacer"></div>
      </div>
      <div className="Feed-container">
        <NewReview onSubmit={submitNewReview} />
        {ratingsList}
      </div>
    </>
  );
};

export default Feed;
