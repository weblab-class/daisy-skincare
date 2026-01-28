import React from "react";
import { Link } from "react-router-dom";
import "../modules/Ratings.css";

// individual review created by user

const SingleReview = (props) => {
  const hasValidImage = props.image && props.image.trim && props.image.trim() !== "";

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="reviewer-info">
          <Link to={`/user/${props.creator_id}`} className="reviewer-name">
            {props.creator_name}
          </Link>
        </div>

        <div className="rating-display">
          <div className="rating-circle">
            {Number(props.rating_value).toFixed(1)}
          </div>
        </div>
      </div>

      <Link to={`/product/${props.product_id}`} className="Review-link">
        <p className="Review-content">Product: {props.product}</p>
      </Link>

      <p className="Review-content">Brand: {props.brand}</p>
      <p className="review-text">Review: {props.content}</p>

      {hasValidImage && (
        <div className="review-image-row">
          <img
            src={props.image}
            alt={props.product}
            className="review-image"
          />
        </div>
      )}
    </div>

  );
};

export default SingleReview;
