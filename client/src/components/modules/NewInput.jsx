import React, { useState } from "react";
import "./NewInput.css";

/** A generic component for adding custom text in a text box */
const NewInput = (props) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        className="NewInput-input"
      />
      <button
        type="submit"
        onClick={handleSubmit}
        className="NewInput-button u-pointer"
      >
        Submit
      </button>
    </div>
  );
};


/** When creating a new comment component */

export const NewComment = (props) => {
  const addComment = (content) => {
    props.addNewComment(content);
  };

  return <NewInput defaultText="New Comment" onSubmit={addComment} />;
};