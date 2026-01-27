import ProductUserRating from "./ProductUserRating";
import ProductFriendRating from "./ProductFriendRating";

const ProductDescription = ({ product, onOpenProductUrl }) => (
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
    </div>

    {/* <div className="rating-section">
      <span className="rating-value">Rating: N/A (no reviews yet)</span>
    </div> */}

    <ProductUserRating rating={product.rating} />
    <ProductFriendRating rating={product.rating} />
    {product.what_it_is && <div className="description">{product.what_it_is}</div>}
  </div>
);

export default ProductDescription;
