import { useState } from "react";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductLink from "./ProductLink";

const randomProducts = (array) => {
  const shuffledProducts = [...array];
  for (let i = shuffledProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
  }
  return shuffledProducts;
};

const ProductsGrid = ({ products }) => {

  // show 24 products at a time
  const [startIndex, setStartIndex] = useState(0);
  const productsPerPage = 24;
  const randomProductsList = randomProducts(products).slice(startIndex,
                                          startIndex + productsPerPage);

  // get next set of products
  const loadNextProducts = () => {
    setStartIndex((prevIndex) => prevIndex + productsPerPage);
  };

  return (
    <div className="products-grid">
      {randomProductsList.map((product) => (
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
      <button onClick={loadNextProducts} className="search-button">
        Load More Products
      </button>
    </div>
  );
};

export default ProductsGrid;
