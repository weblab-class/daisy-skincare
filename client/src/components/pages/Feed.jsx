import React, { useState, useEffect, useContext } from "react";
import { get, post } from "../../utilities.js";
import { NewReview } from "../modules/NewInput.jsx";
import { UserContext } from "../context/UserContext";

import "./Feed.css"
import Ratings from "../modules/Ratings";
import newreview from "../../assets/newreview.png"; // Import the image


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

  const submitNewReview = (reviewObj) => {
    setRatings((prevRatings) => [reviewObj, ...prevRatings]);
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
        creator_id={reviewObj.user_id}
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
      <div className="Feed-container">
      <div className="Feed-review"
      style={{ backgroundImage: `url(${newreview})` }}>
        <div className="spacer"></div>
        {userID && (<NewReview addNewReview={submitNewReview} />)}
      </div>
      {ratingsList}
      </div>
    </>
  );
};

export default Feed;
