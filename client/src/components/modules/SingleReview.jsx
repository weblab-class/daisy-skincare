import React from "react";
import { Link } from "react-router-dom";
import "../modules/Ratings.css";

// individual review created by user

const SingleReview = (props) => {
  return (
    <div className="Review-body">
      {/** review photo (optional) */}
      <div className="Review-image">
        <img src={props.image} />
      </div>

      {/** review written text, ratings values and link to user */}
      <Link to={`/user/${props.creator_id}`} className="User-link User-bold">
        {props.creator_name}
      </Link>
      <Link to={`/product/${props.product_id}`} className="Review-link">Product Page</Link>
      <p className="Review-content">Product: {props.product}</p>
      <p className="Review-content">Brand: {props.brand}</p>
      <p className="Review-content">Rating: {props.rating_value}</p>
      <p className="Review-content">{props.content}</p>
    </div>
  );
};

export default SingleReview;
