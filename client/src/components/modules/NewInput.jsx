import React, { useState } from "react";
import { post } from "../../utilities";
import ProductAutocomplete from "./ProductAutocomplete";
import BrandAutocomplete from "./BrandAutocomplete";

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
    product_id: "",
    brand: "",
    rating_value: "",
    content: "",
    image: "",
  });

  const handleChange = (eOrValue, fieldName) => {
    if (eOrValue && eOrValue.target) {
      // Normal <input> or <textarea>
      const { name, value } = eOrValue.target;
      setValues(prev => ({ ...prev, [name]: value }));
    } else if (fieldName) {
      // Autocomplete value
      setValues(prev => ({ ...prev, [fieldName]: eOrValue }));
    } else {
      console.error("handleChange called incorrectly", eOrValue, fieldName);
    }
  };

  // submission and validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const { product, brand, rating_value, content, image , product_id} = values;

    if (!product.trim() || !brand.trim() || !rating_value.trim() || !content.trim()) {
      alert("All fields except Image are required.");
      return;
    }

    if (Number(rating_value) < 1 || Number(rating_value) > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    const body = { product, product_id, brand, rating_value, content, image };
    console.log("NewReview body:", body);

    post("/api/rating", body)
      .then((review) => {
        addNewReview && addNewReview(review);
      })
      .catch((err) => console.error("Error posting review:", err));

    setValues({
      product: "",
      brand: "",
      product_id: "",
      rating_value: "",
      content: "",
      image: "",
    }); // Reset fields after submit
  };

  return (
    <div className="New-reviewContainer">
      <ProductAutocomplete
        value={values.product}
        onChange={(productName, productId) =>{
          console.log("ProductAutocomplete onChange called with:", { productName, productId });
          setValues(prev => ({
            ...prev,
            product: productName,
            product_id: productId || ""
          }));
        }}
        className="New-input-wrap"
        inputClassName="New-input"
        aria-label="Product"
      />
      <BrandAutocomplete
        value={values.brand}
        onChange={(v) => handleChange(v, "brand")}
        className="New-input-wrap"
        inputClassName="New-input"
        aria-label="Brand"
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
