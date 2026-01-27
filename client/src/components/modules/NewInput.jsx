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
    <div className={`Input-container ${className || ""}`}>
      {fields && fields.length > 0 ? (
        fields.map((field) =>
          field.type === "textarea" ? (
            <textarea
              key={field.name}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => handleChange(e, field.name)}
              className={`Input-input ${className || ""}`}
              rows={field.rows || 4}
            />
          ) : field.type === "product" ? (
            <ProductAutocomplete
              key={field.name}
              value={values[field.name] ?? ""}
              onChange={(v) => handleChange({ target: { value: v } }, field.name)}
              placeholder={field.placeholder}
              className={`Input-input-wrap ${className || ""}`}
              inputClassName={`Input-input ${className || ""}`}
              aria-label={field.placeholder}
            />
          ) : field.type === "brand" ? (
            <BrandAutocomplete
              key={field.name}
              value={values[field.name] ?? ""}
              onChange={(v) => handleChange({ target: { value: v } }, field.name)}
              placeholder={field.placeholder}
              className={`Input-input-wrap ${className || ""}`}
              inputClassName={`Input-input ${className || ""}`}
              aria-label={field.placeholder}
            />
          ) : (
            <input
              key={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={values[field.name]}
              onChange={(e) => handleChange(e, field.name)}
              className={`Input-input ${className || ""}`}
              min={field.min}
              max={field.max}
            />
          )
        )
      ) : (
        <input
          type="text"
          placeholder={defaultText}
          value={values.value}
          onChange={handleChange}
          className={`Input-input ${className || ""}`}
        />
      )}
      <button onClick={handleSubmit} className="Input-button">
        Submit
      </button>
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

/** new review */
const NewReview = ({ addNewReview, submitNewReview }) => {
  const onSuccess = addNewReview || submitNewReview;
  const fields = [
    { name: "product", placeholder: "Product", type: "product" },
    { name: "brand", placeholder: "Brand", type: "brand" },
    { name: "rating_value", placeholder: "Rating (1-5)", type: "number", min: 1, max: 5 },
    { name: "content", placeholder: "Review content", type: "textarea", rows: 8 },
    { name: "image", placeholder: "Image URL (optional)", optional: true },
  ];
  const handleSubmit = (values) => {
    const body = {
      product: values.product,
      brand: values.brand,
      rating_value: values.rating_value,
      content: values.content,
      image: values.image,
    };
    console.log("NewReview body:", body);

    post("/api/rating", body)
      .then((review) => {
        onSuccess && onSuccess(review);
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
