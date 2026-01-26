const ProductInfo = ({ name, price, description, children }) => (
  <div className="product-info">
    <h3>{name}</h3>
    <p className="price">${price != null && price !== "" ? price : "N/A"}</p>
    <p className="description">{description || "No description available"}</p>
    {children}
  </div>
);

export default ProductInfo;
