import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
  const [leftDucks, setLeftDucks] = useState([]);
  const [rightDucks, setRightDucks] = useState([]);
  const contentRef = useRef(null);

  // renders existing comments
  useEffect(() => {
    get("/api/commentsfeed", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
  }, [props._id]);

  useLayoutEffect(() => {
    const calculateDucks = () => {
      if (contentRef.current) {
        const reviewHeight = contentRef.current.clientHeight;
        const duckHeight = 150; // Assuming a fixed height for the duck images
        const numDucks = Math.floor(reviewHeight / duckHeight) || 1;

        if (leftDucks.length === numDucks) {
          return;
        }

        const newLeftDucks = [];
        const newRightDucks = [];
        for (let i = 0; i < numDucks; i++) {
          newLeftDucks.push(getRandomDuck());
          newRightDucks.push(getRandomDuck());
        }
        setLeftDucks(newLeftDucks);
        setRightDucks(newRightDucks);
      }
    };

    calculateDucks();
    // Recalculate on window resize
    window.addEventListener("resize", calculateDucks);
    return () => window.removeEventListener("resize", calculateDucks);
  }, [comments, props]);

  // add new comment function
  // reworked for clearer api organization
  const addNewComment = (contentObj) => {
    setComments(comments.concat([contentObj]));
  };

  return (
    <div className="Review-container">
      <div className="Review-left">
        {leftDucks.map((duck, i) => (
          <img key={i} src={duck} className="Review-duck" alt="decoration" />
        ))}
      </div>

      {/** ratings divided into duck margins
       * and review with comments in center */}
      <div className="Review-center">
        <div ref={contentRef} className="Review-content-wrapper">
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
          <CommentsBlock review={props} comments={comments} addNewComment={addNewComment} />
        </div>
      </div>

      {/** other duck margin on other side */}
      <div className="Review-right">
        {rightDucks.map((duck, i) => (
          <img key={i} src={duck} className="Review-duck" alt="decoration" />
        ))}
      </div>
    </div>
  );
};

export default Ratings;
