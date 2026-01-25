import React from "react";

// individual single comment

const SingleComment = (props) => {
  return (
    <div className="Review-commentBody">
      <span className="User-bold">{props.creator_name}</span>
      <span>{" | " + props.content}</span>
    </div>
  );
};

export default SingleComment;
