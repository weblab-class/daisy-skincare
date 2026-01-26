import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductLink from "./ProductLink";

const ProductsGrid = ({ products }) => (
  <div className="products-grid">
    {products.map((product) => (
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
  </div>
);

export default ProductsGrid;
