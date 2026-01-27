import React, { useState, useEffect } from "react";
import { get } from "../../utilities.js";
import { useParams } from "react-router-dom";

import SingleReview from "./SingleReview";
import "./Ratings.css";

// user ratings without comments component
const UserRatings = (props) => {
  return (
    <div className="Review-container">
      <SingleReview
        _id={props._id}
        content={props.content}
        image={props.image}
        product={props.product}
        brand={props.brand}
        rating_value={props.rating_value}
      />
    </div>
  );
};

// recent ratings show on user profile
const Recent = () => {
  let userID = useParams().userID;
  const [ratings, setRatings] = useState([]);

  // get user's recent
  useEffect(() => {
    if (!userID) return;
    get("/api/userratings", { user_id: userID }).then((data) => {
      setRatings(data);
      console.log("data", data);
    });
  }, [userID]);

  if (ratings.length === 0) {
    return <div className="Feed-container">No ratings yet!</div>;
  }

  return (
    <div className="Feed-container">
      {ratings.map((review) => (
        <UserRatings
          key={`Review_${review._id}`}
          _id={review._id}
          content={review.content}
          image={review.image}
          product={review.product}
          brand={review.brand}
          rating_value={review.rating_value}
        />
      ))}
    </div>
  );
};

export { UserRatings, Recent };
