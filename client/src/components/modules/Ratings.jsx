import React, { useState, useEffect } from "react";
import SingleReview from "./SingleReview";
import CommentsBlock from "./CommentsBlock";
import { get, post } from "../../utilities.js";

import "./Ratings.css";
import flower from "../../assets/margins/margin-flower.png";
import tie from "../../assets/margins/margin-tie.png";
import small from "../../assets/margins/margin-small.png";
import swim from "../../assets/margins/margin-swim.png";
import bow from "../../assets/margins/margin-bow.png";
import darktie from "../../assets/margins/margin-darktie.png";

// ratings that populate the feed

// ducks in the margins generating function
const ducks = [flower, tie, small, swim, bow, darktie];
function getRandomDuck() {
  return ducks[Math.floor(Math.random() * ducks.length)];
}

const Ratings = (props) => {
  const [comments, setComments] = useState([]);
  const [leftDuck] = useState(getRandomDuck);
  const [rightDuck] = useState(getRandomDuck);

  // renders existing comments
  useEffect(() => {
    get("/api/commentsfeed", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
  }, []);

  // add new comment function
  // reworked for clearer api organization
  const addNewComment = (contentObj) => {
    setComments(comments.concat([contentObj]));
  };

  return (
    <div className="Review-container">
      <div className="Review-left">
        <img src={leftDuck} className="Review-duck" alt="decoration" />
        <img src={rightDuck} className="Review-duck" alt="decoration" />
      </div>

      {/** ratings divided into duck margins
       * and review with comments in center */}
      <div className="Review-center">
        <SingleReview
        _id={props._id}
        creator_id={props.creator_id}
        creator_name={props.creator_name}
        content={props.content}
        image={props.image}
        product={props.product}
        product_id={props.product_id}
        brand={props.brand}
        rating_value={props.rating_value}
      />

      {/** comments grouped together into block */}
      <CommentsBlock
        review={props}
        comments={comments}
        addNewComment={addNewComment}
      />
      </div>

      {/** other duck margin on other side */}
      <div className="Review-right">
        <img src={rightDuck} className="Review-duck" alt="decoration" />
        <img src={leftDuck} className="Review-duck" alt="decoration" />
      </div>
    </div>
  );
};

export default Ratings;
