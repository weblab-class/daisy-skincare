import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { get } from "../../utilities.js";
import { useParams } from "react-router-dom";

import SingleReview from "./SingleReview";
import "./Ratings.css";

import flower from "../../assets/margins/margin-flower.png";
import tie from "../../assets/margins/margin-tie.png";
import small from "../../assets/margins/margin-small.png";
import swim from "../../assets/margins/margin-swim.png";
import bow from "../../assets/margins/margin-bow.png";
import darktie from "../../assets/margins/margin-darktie.png";

const ducks = [flower, tie, small, swim, bow, darktie];

function getRandomDuck() {
  return ducks[Math.floor(Math.random() * ducks.length)];
}

export const Recent = () => {
  const { userID } = useParams();

  const [ratings, setRatings] = useState([]);
  const [leftDucks, setLeftDucks] = useState([]);
  const [rightDucks, setRightDucks] = useState([]);

  const contentRef = useRef(null);

  useEffect(() => {
    if (!userID) return;
    get("/api/userratings", { user_id: userID }).then((data) => {
      setRatings(Array.isArray(data) ? data : data.ratings);
    });
  }, [userID]);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const calculateDucks = () => {
      const reviewHeight = contentRef.current.clientHeight;
      const duckHeight = 150;
      const numDucks = Math.max(1, Math.floor(reviewHeight / duckHeight));

      setLeftDucks(Array.from({ length: numDucks }, getRandomDuck));
      setRightDucks(Array.from({ length: numDucks }, getRandomDuck));
    };

    calculateDucks();
    window.addEventListener("resize", calculateDucks);
    return () => window.removeEventListener("resize", calculateDucks);
  }, [ratings.length]);

  if (ratings.length === 0) {
    return <div className="Feed-container">No ratings yet!</div>;
  }

  return (
    <div className="Review-container">
      <div className="Review-left">
        {leftDucks.map((duck, i) => (
          <img key={i} src={duck} className="Review-duck" alt="decoration" />
        ))}
      </div>

      <div className="Review-center" ref={contentRef}>
        {ratings.map((review) => (
          <SingleReview key={review._id} {...review} />
        ))}
      </div>

      <div className="Review-right">
        {rightDucks.map((duck, i) => (
          <img key={i} src={duck} className="Review-duck" alt="decoration" />
        ))}
      </div>
    </div>
  );
};
