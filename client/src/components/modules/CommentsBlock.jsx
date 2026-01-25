import React, { useContext } from "react";
import SingleComment from "./SingleComment";
import { NewComment } from "./NewInput.jsx";
import { UserContext } from "../context/UserContext";

// comments section for each review

const CommentsBlock = (props) => {
  const userID = useContext(UserContext);
  return (
    <div className="Review-commentSection">
      <div className="Review-comments">
        {props.comments.map((comment) => (
          <SingleComment
            key={`SingleComment_${comment._id}`}
            _id={comment._id}
            creator_name={comment.creator_name}
            content={comment.content}
          />
        ))}
        {userID &&
        <NewComment reviewId={props.review._id} addNewComment={props.addNewComment} />
        }
      </div>
    </div>
  );
};

export default CommentsBlock;
