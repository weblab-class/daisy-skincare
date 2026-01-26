const ProductImage = ({ imageUrl, name }) => (
  <img
    src={imageUrl || "https://via.placeholder.com/300"}
    alt={name || "Product"}
    className="product-image"
  />
);

export default ProductImage;
