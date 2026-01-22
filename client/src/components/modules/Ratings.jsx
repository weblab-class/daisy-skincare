import React, { useState, useEffect } from "react";
import SingleReview from "./SingleReview";
import CommentsBlock from "./CommentsBlock";
import { get, post } from "../../utilities.js";

import "./Ratings.css";
import flower from "../../assets/margins/margin-flower.png";
import tie from "../../assets/margins/margin-tie.png";
import small from "../../assets/margins/margin-small.png";
import swim from "../../assets/margins/margin-swim.png";

const ducks = [flower, tie, small, swim];

function getRandomDuck() {
  return ducks[Math.floor(Math.random() * ducks.length)];
}

const Ratings = (props) => {
  const [comments, setComments] = useState([]);
  const [leftDuck] = useState(getRandomDuck);
  const [rightDuck] = useState(getRandomDuck);

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
      <div className="Review-left">
        <img src={leftDuck} className="Review-duck" alt="decoration" />
      </div>
      <div className="Review-center">
        <SingleReview
        _id={props._id}
        creator_name={props.creator_name}
        content={props.content}
        image={props.image}
        product={props.product}
        brand={props.brand}
        rating_value={props.rating_value}
      />
      <CommentsBlock
        review={props}
        comments={comments}
        addNewComment={addNewComment}
      />
      </div>
      <div className="Review-right">
        <img src={rightDuck} className="Review-duck" alt="decoration" />
      </div>
    </div>
  );
};

export default Ratings;
