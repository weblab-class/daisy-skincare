import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProductImage from "../modules/product-page/ProductImage";
import ProductDescription from "../modules/product-page/ProductDescription";
import ProductInfo from "../modules/product-page/ProductInfo";
import ProductIngredients from "../modules/product-page/ProductIngredients";
import ProductReview from "../modules/product-page/ProductReview";
import "./ProductPage.css";
import homepage from "../../assets/homepage.png";

const ProductPage = ({user}) => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [ratingsData, setRatingsData] = useState(null); // Changed: store all data here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullIngredients, setShowFullIngredients] = useState(false);

  useEffect(() => {
    loadProduct();
    loadRatingsandReviews();
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

  const loadRatingsandReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productID}/ratings`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to get ratings and reviews");
      const data = await response.json();
      setRatingsData(data); // Changed: store entire response
    } catch (err) {
      console.error("Couldn't load ratings and reviews:", err);
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

  const handleRatingSuccess = () => {
    loadRatingsandReviews();
  };

  return (
    <div className="product-page-container"
    style={{ backgroundImage: `url(${homepage})` }}>
      <div className="product-page-main">
        <div className="header">
          <ProductImage imageUrl={product.image_url} name={product.name} />
          <ProductDescription
            product={product}
            onOpenProductUrl={openProductUrl}
            ratings={ratingsData} // Changed: pass entire ratingsData object
            user={user}
            onRatingSuccess={handleRatingSuccess}
          />
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

        <ProductReview
          productID={productID}
          user={user}
          userReview={ratingsData?.userReview}
          otherReviews={ratingsData?.otherReviews ?? []}
          onReviewSuccess={handleRatingSuccess} // Changed: use same handler
        />
      </div>
    </div>
  );
};

export default ProductPage;
