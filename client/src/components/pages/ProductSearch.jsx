import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Search from "../modules/product-search/Search";
import ProductsGrid from "../modules/product-search/ProductsGrid";

import "./ProductSearch.css";

const ProductSearch = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
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
        const url = searchQuery
          ? `/api/products?search=${encodeURIComponent(searchQuery)}`
          : "/api/products";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="product-page">
      <Search
        searchQuery={searchQuery}
        inputQuery={inputQuery}
        onInputChange={setInputQuery}
        onSubmit={handleSearch}
      />

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
        <p className="no-products">
          No products found {searchQuery && `matching "${searchQuery}"`}
        </p>
      )}

      {!loading && products.length > 0 && <ProductsGrid products={products} />}
    </div>
  );
};

export default ProductSearch;
