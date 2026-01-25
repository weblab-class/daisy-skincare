import React, { useState } from "react";
import "./NewInput.css";
import { post } from "../../utilities";

/** generic new input with wrappers on top */
const NewInput = ({ defaultText, onSubmit, fields, className }) => {

  // dynamic initial states
  const initialState = {};
  if (fields && fields.length > 0) {
    fields.forEach((f) => (initialState[f.name] = ""));
  } else {
    initialState.value = "";
  }

  const [values, setValues] = useState(initialState);

  // handle when user starts to change
  const handleChange = (e, name) => {
    if (name) {
      setValues({ ...values, [name]: e.target.value });
    } else {
      setValues({ value: e.target.value });
    }
  };

  // when submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    if (fields && fields.length > 0) {
      for (const field of fields) {
        /** optional for now out of convenience
        if (!field.optional && !values[field.name].trim()) {
          alert(`${field.placeholder} cannot be empty.`);
          return;
        }
        */
        if (field.type === "number") {
          const val = Number(values[field.name]);
          if ((field.min && val < field.min) || (field.max && val > field.max)) {
            alert(`${field.placeholder} must be between ${field.min} and ${field.max}`);
            return;
          }
        }
      }
      onSubmit && onSubmit(values);
      const reset = {};
      fields.forEach((f) => (reset[f.name] = ""));
      setValues(reset);
    } else {
      if (!values.value.trim()) {
        alert("Input cannot be empty.");
        return;
      }
      onSubmit && onSubmit(values.value);
      setValues({ value: "" });
    }
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

/** new comment with api endpoint */
const NewComment = ({ reviewId, addNewComment }) => {
  const handleSubmit = (value) => {
    const body = { parent: reviewId, content: value };
    post("/api/comment", body).then((comment) => addNewComment && addNewComment(comment));
  };
  return <NewInput onSubmit={handleSubmit} className="Comment-input" />;
};

/** new review */
const NewReview = ({ addNewReview }) => {
  const fields = [
    { name: "product", placeholder: "Product" },
    { name: "brand", placeholder: "Brand" },
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

    // api post endpoint for new rating
    post("/api/rating", body).then((review) => {
      addNewReview && addNewReview(review);
    });
  };
  return <NewInput fields={fields} onSubmit={handleSubmit} />;
};

export { NewComment, NewReview };
