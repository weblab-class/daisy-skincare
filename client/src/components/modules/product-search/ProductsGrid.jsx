import { useState } from "react";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductLink from "./ProductLink";

const ProductsGrid = ({ products }) => {
  const [startIndex, setStartIndex] = useState(0);
  const productsPerPage = 24;

  // slice products for current page
  const displayedProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // load next set of products
  const loadNextProducts = () => {
    setStartIndex((prevIndex) => prevIndex + productsPerPage);
  };

  return (
    <div className="products-grid">
      {displayedProducts.map((product) => (
        <div key={product._id} className="product-card">
          <ProductImage imageUrl={product.image_url} name={product.name} />
          <ProductInfo
            name={product.name}
            price={product.price}
            description={product.what_it_is}
          >
            <ProductLink productId={product._id} />
          </ProductInfo>
        </div>
      ))}

      {startIndex + productsPerPage < products.length && (
        <button onClick={loadNextProducts} className="more-button">
          Load More Products
        </button>
      )}
    </div>

  );
};

export default ProductsGrid;
