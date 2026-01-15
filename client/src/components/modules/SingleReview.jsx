import React from "react";
import "../modules/Ratings.css";

/** Individual Review
 * @param {string} _id of the review
 * @param {string} creator_name
 * @param {string} content of review
 */

const SingleReview = (props) => {
  return (
    <div className="Review-body">
      <span className="u-bold">{props.creator_name}</span>
      <p className="Review-content">{props.content}</p>
    </div>
  );
};

export default SingleReview;
