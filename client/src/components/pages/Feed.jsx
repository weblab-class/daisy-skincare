import React, { useState, useEffect } from "react";
import Ratings from "../modules/Ratings";

const Feed = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const review1 = {
      _id: "id1",
      creator_name: "user1",
      content: "review1",
    };
    const review2 = {
      _id: "id2",
      creator_name: "user2",
      content: "review2",
    };
    const review3 = {
      _id: "id3",
      creator_name: "user3",
      content: "review3",
    };
    const hardcodedRatings = [review1, review2, review3];

    setRatings(hardcodedRatings);
  }, []);

  let ratingsList = null;
  const hasRatings = ratings.length !== 0;

  if (hasRatings) {
    ratingsList = ratings.map((reviewObj) => (
      <Ratings
        key={`Review_${reviewObj._id}`}
        _id={reviewObj._id}
        creator_name={reviewObj.creator_name}
        content={reviewObj.content}
      />
    ));

  } else {
    ratingsList = <div>No ratings currently!</div>;
  }

  return (
    <div>
      {ratingsList}
    </div>
  );
};

export default Feed;
