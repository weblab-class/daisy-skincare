import React from "react";
import SingleComment from "./SingleComment";
import { NewComment } from "./NewInput.jsx";


const CommentsBlock = (props) => {
  return (
    <div className="Review-commentSection">
      <div className="review-comments">
        {props.comments.map((comment) => (
          <SingleComment
            key={`SingleComment_${comment._id}`}
            _id={comment._id}
            creator_name={comment.creator_name}
            content={comment.content}
          />
        ))}
        <NewComment reviewId={props.review._id} addNewComment={props.addNewComment} />
      </div>
    </div>
  );
};

export default CommentsBlock;
