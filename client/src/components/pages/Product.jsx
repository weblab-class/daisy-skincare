import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Adjust the URL to match your backend endpoint
        const url = searchQuery
          ? `http://localhost:3000/api/products?search=${searchQuery}`
          : `http://localhost:3000/api/products`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]); 

  if (loading) {
    return <div className="product-page"><p>Loading products...</p></div>;
  }

  if (error) {
    return <div className="product-page"><p>Error: {error}</p></div>;
  }

  return (
    <div className="product-page">
      {searchQuery && (
        <h2>Search results for: "{searchQuery}"</h2>
      )}

      {products.length === 0 ? (
        <p>No products found {searchQuery && `matching "${searchQuery}"`}</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p className="description">{product.description}</p>
                <button className="add-to-cart">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
