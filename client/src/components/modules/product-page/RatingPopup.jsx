import { useState } from "react";
import { post } from "../../../utilities";
import "./RatingPopup.css";

const RatingPopup = ({
  productId,
  existingRating,
  existingComment,
  onClose,
  onSuccess,
  user
}) => {
  const [rating, setRating] = useState(existingRating ?? "");
  const [comment, setComment] = useState(existingComment ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    post("/api/rating", {
      productId,
      rating_value: rating,
      content: comment,
    }).then((res) => {
      onSuccess(res);
      onClose();
    });
  };

  return (
    <div className="rating-popup-overlay">
      <div className="rating-popup">
        <h3>{existingRating ? "Update your rating" : "Rate this product"}</h3>

        <label>Rating (1–5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <label>Comment (optional)</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="rating-popup-buttons">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
