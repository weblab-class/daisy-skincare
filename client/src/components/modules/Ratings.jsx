import React, { useState, useEffect } from "react";
import SingleReview from "./SingleReview";
import CommentsBlock from "./CommentsBlock";
import { get, post } from "../../utilities.js";

import "./Ratings.css";

const Ratings = (props) => {
  const [comments, setComments] = useState([]);

  const addNewComment = (content) => {
    const body = { parent: props._id, content: content };
    post("/api/comment", body).then((comment) => {
      setComments(comments.concat(comment));
    });
  };

  useEffect(() => {
    get("/api/comments", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
  }, []);

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
      <CommentsBlock review={props} comments={comments} addNewComment={addNewComment} />
    </div>
  );
};

export default Ratings;
