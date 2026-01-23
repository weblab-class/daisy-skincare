import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const navigate = useNavigate();
  const [inputQuery, setInputQuery] = useState(searchQuery);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(inputQuery)}`);
    }
  };

  useEffect(() => {
    setInputQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use relative URL to avoid CORS issues
        const url = searchQuery
          ? `/api/products?search=${encodeURIComponent(searchQuery)}`
          : `/api/products`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Set empty array on error so UI still renders
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="product-page">
      <h1 className="product-page-title">Browse Products</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for products..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {searchQuery && (
        <h2>Search results for: "{searchQuery}"</h2>
      )}

      {loading && (
        <div className="loading-message">
          <p>Loading products...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please try again or check if the server is running.</p>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <p className="no-products">No products found {searchQuery && `matching "${searchQuery}"`}</p>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img
                src={product.image_url || "https://via.placeholder.com/300"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price || 'N/A'}</p>
                <p className="description">{product.what_it_is || 'No description available'}</p>
                <Link to={`/product/${product._id}`} className="browse-link">
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
