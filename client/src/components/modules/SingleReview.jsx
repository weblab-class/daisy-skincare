import React from "react";
import "../modules/Ratings.css";

/** Individual Review
 * @param {string} _id of the review
 * @param {string} creator_name
 * @param {string} content of review
 * @param {string} image of review
 * @param {string} product of review
 * @param {string} brand of review
 * @param {string} rating_value of review
 */

const SingleReview = (props) => {
  return (
    <div className="Review-body">
      <div className="Review-image-container">
        <img src={props.image} className="Review-image" />
      </div>
      <div className="Review-content-container">
        <span className="u-bold">{props.creator_name}</span>
        <p className="Review-content">Product: {props.product}</p>
        <p className="Review-content">Brand: {props.brand}</p>
        <p className="Review-content">Rating: {props.rating_value}</p>
        <p className="Review-content">{props.content}</p>
      </div>
    </div>
  );
};

export default SingleReview;
