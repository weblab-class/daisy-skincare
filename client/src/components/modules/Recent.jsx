import React, { useState, useEffect } from "react";
import SingleReview from "./SingleReview";
import { get } from "../../utilities.js";
import "./Ratings.css";

const RecentRatings = (props) => {

  return (
    <div className="Review-container">
      <SingleReview
        _id={props._id}
        creator_name={props.creator_name}
        content={props.content}
        image={props.image}
        product={props.product}
        brand={props.brand}
        rating_value={props.rating_value}
      />
    </div>
  );
};

const Recent = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    get("/api/ratings").then((data) => {
      setRatings(data);
    });
  }, []);

  if (ratings.length === 0) {
    return <div className="Feed-container">No ratings currently!</div>;
  }

  return (
    <div className="Feed-container">
      {ratings.map((review) => (
        <RecentRatings
          key={`Review_${review._id}`}
          _id={review._id}
          creator_name={review.user_name}
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

export { RecentRatings, Recent };
