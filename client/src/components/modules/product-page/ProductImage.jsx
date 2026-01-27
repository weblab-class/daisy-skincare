const ProductImage = ({ imageUrl, name }) => (
  <div className="product-image">
    {imageUrl ? (
      <img src={imageUrl} alt={name || "Product"} />
    ) : (
      <span>Product picture</span>
    )}
  </div>
);

export default ProductImage;
