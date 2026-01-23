import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import "./ProductPage.css";

const ProductPage = ()=>{
    const {productID} = useParams()
    const[product,setProduct] = useState(null);
    const[loading,setLoading] = useState(true);
    const [error,setError] = useState(null)
    const [showFullIngredients,setShowFullIngredients] = useState(false)

    useEffect(()=>{
        loadProduct();
    }, [productID]);


const loadProduct = async()=>{
    try{
        setLoading(true);
        const response = await fetch(`/api/products/${productID}`)

        if (!response.ok){
            throw new Error("failed to get product")
        }

        const data = await response.json();
        setProduct(data);
        setError(null);
    } catch (err){
        setError(err.message);
        console.log("coudln't load product");
    } finally {
        setLoading(false);
    }
}

const toggleIngredients = ()=>{
    setShowFullIngredients(!showFullIngredients)
}

const openProductUrl = ()=>{
    if (product?.url){
        window.open(product.url, '_blank')
    }
}

if (loading){
    return (
        <div className = "product-page-container">
            <div className = "loading">Loading product...</div>
        </div>
    )
}

if (error){
    return(
        <div className = "product-page-container">
            <div className = 'error'> Error: {error}</div>
        </div>
    )
}

if (!product){
    return(
        <div className = "product-page-container">
            <div className = "error">Product not found</div>
        </div>
    )
}

return (
    <div className = "product-page-container">
        {/* heading */}
        <div className = "header">
            <div className = "product-image">
                {product.image_url? (
                    <img src = {product.image_url} alt = {product.name}/>
                ):(
                    <span>Product picture</span>
                )}
            </div>
            <div className = "product-info">
                <h1 className = "product-name"> {product.name} </h1>
                <div className = "product-brand"> {product.brand}</div>
                <div className = "product-price">
                    ${product.price? product.price: 'N/A'}
                </div>
                <div className = 'product-size'> {product.size}</div>

                {/* link button */}
                <div className = "actions">
                    <button className = 'action-btn' onClick = {openProductUrl}>
                        <svg className = "link-icon" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Product Link
                    </button>
                </div>

                <div className = "rating-section">
                    {/* TODO UPDATE LATER !!!! */}
                    <span className = "rating-value"> Rating: N/A (no reviews yet)</span>
                </div>
                {product.what_it_is && (<div className = "description">{product.what_it_is}</div>)}
            </div>
        </div>

        {/* info */}
        <div className = "info-grid">
            <div className = "info-section">
                <h3> Skincare Concerns</h3>
                <ul>
                    {product.skincare_concerns && product.skincare_concerns.length > 0 ? (
                        product.skincare_concerns.map((concern, index) => (
                            <li key={index}>{concern}</li>
                        ))
                    ) : (
                        <li>No concerns listed</li>
                    )}
                </ul>
            </div>

            <div className = "info-section">
                <h3>Skin Type</h3>
                    <ul>
                        {product.skin_type && product.skin_type.length > 0 ? (
                            product.skin_type.map((type, index) => (
                                <li key={index}>{type}</li>
                            ))
                        ) : (
                            <li>No skin types listed</li>
                        )}
                    </ul>
            </div>
        </div>

        {/* ingredients */}
        <div className="ingredients-section">
                <h3>Highlighted Ingredients</h3>
                <div className="highlighted-ingredients">
                    {(() => {
                        // Normalize highlighted_ingredients to always be an array
                        let ingredientsArray = [];

                        if (product.highlighted_ingredients) {
                            if (Array.isArray(product.highlighted_ingredients)) {
                                // If it's already an array, process each element
                                ingredientsArray = product.highlighted_ingredients.flatMap(ing => {
                                    if (typeof ing === 'string') {
                                        // Split on " -" (space-dash) pattern - this handles cases like
                                        // "ingredient1 -ingredient2" or "ingredient1 - ingredient2"
                                        const parts = ing.split(/\s+-/).map(item => {
                                            // Remove leading dash if present and trim
                                            return item.replace(/^-\s*/, '').trim();
                                        }).filter(item => item);
                                        return parts;
                                    }
                                    return ing ? [String(ing).trim()] : [];
                                }).filter(item => item);
                            } else if (typeof product.highlighted_ingredients === 'string') {
                                // If it's a string, split on " -" (space-dash) pattern
                                ingredientsArray = product.highlighted_ingredients
                                    .split(/\s+-/)
                                    .map(item => {
                                        // Remove leading dash if present and trim
                                        return item.replace(/^-\s*/, '').trim();
                                    })
                                    .filter(item => item);
                            }
                        }

                        return ingredientsArray.length > 0 ? (
                            ingredientsArray.map((ing, index) => (
                                <div key={index} className="ingredient-item">{ing}</div>
                            ))
                        ) : (
                            <div>No highlighted ingredients listed.</div>
                        );
                    })()}
                </div>
                <button className="see-more" onClick={toggleIngredients}>
                    {showFullIngredients ? 'Hide ingredient list' : 'See full ingredient list'}
                </button>

                {showFullIngredients && (
                    <div className="full-ingredients">
                        {product.ingredients && product.ingredients.length > 0 ? (
                            product.ingredients.join(', ')
                        ) : (
                            'No ingredients listed.'
                        )}
                    </div>
                )}
        </div>
    </div>
    );
};

export default ProductPage;
