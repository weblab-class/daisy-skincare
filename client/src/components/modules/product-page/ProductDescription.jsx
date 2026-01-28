import { useState } from "react";
import ProductRatings from "./ProductRatings";
import RatingPopup from "./RatingPopup";

const ProductDescription = ({ product, onOpenProductUrl, ratings, user, onRatingSuccess }) => {
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const hasUserRated = ratings?.userRating !== null && ratings?.userRating !== undefined;


  return (
    <div className="product-info">
      <h1 className="product-name">{product.name}</h1>
      <div className="product-brand">{product.brand}</div>
      <div className="product-price">
        ${product.price != null ? product.price : "N/A"}
      </div>
      <div className="product-size">{product.size}</div>

      <div className="actions">
        <button type="button" className="action-btn" onClick={onOpenProductUrl}>
          <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Product Link
        </button>

        {user && (
          <button
            type="button"
            className="action-btn"
            onClick={() => setShowRatingPopup(true)}
          >
            {hasUserRated ? "Rate Again" : "Rate"}
          </button>
        )}
      </div>

      <ProductRatings ratings={ratings} />

      {product.what_it_is && <div className="description">{product.what_it_is}</div>}

      {showRatingPopup && (
        <RatingPopup
          product={product.name}
          brand = {product.brand}
          product_id = {product._id}
          existingRating={ratings?.userRating?.rating_value}
          existingComment={ratings?.userRating?.content}
          onClose={() => setShowRatingPopup(false)}
          onSuccess={onRatingSuccess}
          user={user}
        />
      )}
    </div>
  );
};

export default ProductDescription;
