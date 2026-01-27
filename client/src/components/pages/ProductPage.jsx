import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProductImage from "../modules/product-page/ProductImage";
import ProductDescription from "../modules/product-page/ProductDescription";
import ProductInfo from "../modules/product-page/ProductInfo";
import ProductIngredients from "../modules/product-page/ProductIngredients";
import ProductRatings from "../modules/product-page/ProductRatings";
import "./ProductPage.css";

const ProductPage = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullIngredients, setShowFullIngredients] = useState(false);

  useEffect(() => {
    loadProduct();
    loadRatings();
  }, [productID]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productID}`);
      if (!response.ok) throw new Error("Failed to get product");
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Couldn't load product:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      console.log('Loading ratings for product:', productID);
      const response = await fetch(`/api/products/${productID}/ratings`, {
        credentials: 'include'
      });
      console.log('Ratings response status:', response.status);
      if (!response.ok) throw new Error("Failed to get ratings");
      const data = await response.json();
      console.log('Ratings data received:', data);
      setRatings(data);
    } catch (err) {
      console.error("Couldn't load ratings:", err);
    }
  };

  const toggleIngredients = () => setShowFullIngredients((prev) => !prev);

  const openProductUrl = () => {
    if (product?.url) window.open(product.url, "_blank");
  };

  if (loading) {
    return (
      <div className="product-page-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-container">
        <div className="error">Product not found</div>
      </div>
    );
  }


  return (
    <div className="product-page-container">
      <div className="header">
        <ProductImage imageUrl={product.image_url} name={product.name} />
        <ProductDescription product={product} onOpenProductUrl={openProductUrl} ratings = {ratings}/>
      </div>
      
      <ProductInfo
        skincareConcerns={product.skincare_concerns ?? []}
        skinType={product.skin_type ?? []}
      />

      <ProductIngredients
        highlightedIngredients={product.highlighted_ingredients}
        ingredients={product.ingredients ?? []}
        showFullIngredients={showFullIngredients}
        onToggleIngredients={toggleIngredients}
      />

    </div>
  );
};

export default ProductPage;
