import React, { useState, useEffect } from "react";
import { get } from "../../utilities.js";
import { useParams } from "react-router-dom";

import Ratings from "./Ratings";
import "./Ratings.css";

// recent ratings show on user profile
const Recent = () => {
  let userID = useParams().userID;
  const [ratings, setRatings] = useState([]);

  // get user's recent
  useEffect(() => {
    if (!userID) return;
    get("/api/userratings", { user_id: userID }).then((data) => {
      setRatings(data);
    });
  }, [userID]);

  if (ratings.length === 0) {
    return <div className="Feed-container">No ratings yet!</div>;
  }

  return (
    <div className="Feed-container">
      {ratings.map((review) => (
        <Ratings
          key={`Review_${review._id}`}
          _id={review._id}
          creator_name={review.user_name}
          creator_id={review.user_id}
          content={review.content}
          image={review.image}
          product={review.product}
          product_id={review.product_id}
          brand={review.brand}
          rating_value={review.rating_value}
        />
      ))}
    </div>
  );
};

export { Recent };
