import { Link } from "react-router-dom";

const ProductLink = ({ productId, children = "View details" }) => (
  <Link to={`/product/${productId}`} className="browse-link">
    {children}
  </Link>
);

export default ProductLink;
