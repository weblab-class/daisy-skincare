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

/** When creating a new review component */
export const NewReview = (props) => {
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = {
      product,
      brand,
      rating_value: rating,
      content,
      image,
    };

    // Basic validation
    if (!product || !brand || !rating || !content) {
      alert("Please fill out all fields except image (optional).");
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    props.onSubmit && props.onSubmit(body);
    setProduct("");
    setBrand("");
    setRating("");
    setContent("");
    setImage("");
  };

  return (
    <div className="NewInput-container u-flexColumn">
      <h2 className="u-textCenter">Create a New Review</h2>
      <input
        type="text"
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        className="NewInput-input"
      />
      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="NewInput-input"
      />
      <input
        type="number"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="NewInput-input"
        min="1"
        max="5"
      />
      <textarea
        placeholder="Review content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="NewInput-input"
        rows="4"
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="NewInput-input"
      />
      <button
        type="submit"
        onClick={handleSubmit}
        className="NewInput-button u-pointer"
      >
        Submit Review
      </button>
    </div>
  );
};