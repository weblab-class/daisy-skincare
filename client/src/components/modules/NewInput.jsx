import React, { useState } from "react";
import { post } from "../../utilities";

import "./NewInput.css";

/** NewComment Component */
const NewComment = ({ reviewId, addNewComment }) => {
  const [content, setContent] = useState("");

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  // submission and validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    const body = { parent: reviewId, content };
    // POST api
    post("/api/comment", body)
      .then((comment) => addNewComment && addNewComment(comment))
      .catch((err) => console.error("Error posting comment:", err));

    setContent(""); // Reset content after submit
  };

  return (
    <div className="New-commentContainer">
      <textarea
        placeholder="Write your comment..."
        value={content}
        onChange={handleChange}
        className="New-input"
        rows={4}
      />
      <button onClick={handleSubmit} className="New-button">Submit</button>
    </div>
  );
};

/** NewReview Component */
const NewReview = ({ addNewReview }) => {
  const [values, setValues] = useState({
    product: "",
    brand: "",
    rating_value: "",
    content: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // submission and validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const { product, brand, rating_value, content, image } = values;

    if (!product.trim() || !brand.trim() || !rating_value.trim() || !content.trim()) {
      alert("All fields except Image are required.");
      return;
    }

    if (Number(rating_value) < 1 || Number(rating_value) > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    const body = { product, brand, rating_value, content, image };
    console.log("NewReview body:", body);

    post("/api/rating", body)
      .then((review) => {
        addNewReview && addNewReview(review);
      })
      .catch((err) => console.error("Error posting review:", err));

    setValues({
      product: "",
      brand: "",
      rating_value: "",
      content: "",
      image: "",
    }); // Reset fields after submit
  };

  return (
    <div className="New-reviewContainer">
      <input
        type="text"
        name="product"
        placeholder="Product"
        value={values.product}
        onChange={handleChange}
        className="New-input"
      />
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={values.brand}
        onChange={handleChange}
        className="New-input"
      />
      <input
        type="number"
        name="rating_value"
        placeholder="Rating (1-5)"
        value={values.rating_value}
        onChange={handleChange}
        className="New-input"
        min={1}
        max={5}
      />
      <textarea
        name="content"
        placeholder="Review content"
        value={values.content}
        onChange={handleChange}
        className="New-input"
        rows={8}
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL (optional)"
        value={values.image}
        onChange={handleChange}
        className="New-input"
      />
      <button onClick={handleSubmit} className="New-button">Submit</button>
    </div>
  );
};

export { NewComment, NewReview };
