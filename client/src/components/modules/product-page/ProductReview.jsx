// modules/product-page/ProductReview.jsx
import React from "react";
import "./ProductReview.css";

const ProductReview = ({ productID, user, userReview, otherReviews, onReviewSuccess }) => {
  return (
    <div className="product-review-section">
      <h2>Reviews</h2>

      {/* User's Review */}
      <div className="user-review-container">
        <h3>Your Review</h3>
        {userReview && userReview.rating_value && (
          <div className="review-card user-review">
            <div className="review-card-header">
              <div className="reviewer-info">
                <span className="reviewer-name">{userReview.user_name || "Anonymous"}</span>
              </div>
              <div className="rating-display">
                <div className="rating-circle">{userReview.rating_value.toFixed(1)}</div>
              </div>
            </div>
            <p className="review-text">{userReview.content}</p>
          </div>
        )}
      </div>

      {/* Other People's Reviews */}
      <div className="other-reviews-container">
        <h3>Customer Reviews</h3>
        {otherReviews && otherReviews.length > 0 ? (
          <div className="reviews-list">
            {otherReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.user_name || "Anonymous"}</span>
                  </div>
                  <div className="rating-display">
                    <div className="rating-circle">{review.rating_value.toFixed(1)}</div>
                  </div>
                </div>
                <p className="review-text">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductReview;
