import React, { useState, useEffect, useContext } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { get, post } from "../../utilities.js";
import { NewReview } from "../modules/NewInput.jsx";
import { UserContext } from "../context/UserContext";
import Ratings from "../modules/Ratings";


const Feed = () => {
  const [ratings, setRatings] = useState([]);
  const userID = useContext(UserContext);

  // ratings connected to backend (chronologically reversed)
  // where most recent ratings are on top
  useEffect(() => {
    get("/api/feed").then((ratingsObjs) => {
      let reversedRatingsObjs = ratingsObjs.reverse();
      setRatings(reversedRatingsObjs);
    });
  }, []);

  // submit new skincare review
  // modified from before to handle ratings list better
  const submitNewReview = (reviewObj) => {
    setRatings([reviewObj].concat(ratings));
  };

  // combine ratings into list
  let ratingsList = null;
  const hasRatings = ratings.length !== 0;

  if (hasRatings) {
    ratingsList = ratings.map((reviewObj) => (
      <Ratings
        key={`Review_${reviewObj._id}`}
        _id={reviewObj._id}
        creator_name={reviewObj.user_name}
        content={reviewObj.content}
        image={reviewObj.image}
        product={reviewObj.product}
        brand={reviewObj.brand}
        rating_value={reviewObj.rating_value}
      />
    ));
  } else {
    ratingsList = <div>No ratings currently!</div>;
  }

  return (
    <>
      <div className="spacer"></div>
      {userID && <NewReview submitNewReview={submitNewReview} />}
      {ratingsList}
    </>
  );
};

export default Feed;
