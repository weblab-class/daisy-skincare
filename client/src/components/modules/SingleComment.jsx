import React from "react";

/** Individual Single Comment */

const SingleComment = (props) => {
  return (
    <div className="Review-commentBody">
      <span className="u-bold">{props.creator_name}</span>
      <span>{" | " + props.content}</span>
    </div>
  );
};

export default SingleComment;
