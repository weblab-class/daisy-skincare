import React from "react";
import { Link } from "react-router-dom";
import "../modules/Ratings.css";

// individual review created by user

const SingleReview = (props) => {
  const hasValidImage = props.image && props.image.trim && props.image.trim() !== "";

  return (
    <div className="Review-body">
      {hasValidImage && (
        <div className="Review-image-container">
          <img src={props.image} alt={props.product} className="Review-image"/>
        </div>
      )}

      {/** review written text, ratings values and link to user */}
      <Link to={`/user/${props.creator_id}`} className="User-link User-bold">
        {props.creator_name}
      </Link>

      <div className="Rating-display">
        <div className="Rating-circle">
          {Number(props.rating_value).toFixed(1)}
        </div>
      </div>

      <Link to={`/product/${props.product_id}`} className="Review-link">
        <p className="Review-content">Product: {props.product}</p>
      </Link>
      <p className="Review-content">Brand: {props.brand}</p>
      <p className="Review-content">Rating: {props.rating_value}</p>
      <p className="Review-content">{props.content}</p>
    </div>
  );
};

export default SingleReview;
