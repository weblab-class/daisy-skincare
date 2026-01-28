import { useState } from "react";
import "./ProductFilters.css";

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState({
    category: true,
    price: true,
    skinType: false,
    skinConcerns: false,
  });

  const categories = [
    { value: "moisturizers", label: "Moisturizers" },
    { value: "lip balms & treatments", label: "Lip Balms & Treatments" },
    { value: "treatments", label: "Treatments" },
    { value: "masks", label: "Masks" },
    { value: "cleansers", label: "Cleansers" },
    { value: "Sunscreens", label: "Sunscreens" },
    { value: "eye care", label: "Eye Care" },
    { value: "Body care", label: "Body Care" },
  ];

  const subcategories = {
    moisturizers: ["face cream", "mists & essences", "face oils"],
    "lip balms & treatments": ["lip balms & treatments"],
    treatments: [
      "face serums",
      "blemish & acne treatments",
      "facial peels",
      "exfoliators",
      "toners",
    ],
    masks: ["masks"],
    cleansers: ["face wash & cleansers"],
    Sunscreens: ["spf over 30", "spf under 30"],
    "eye care": ["eye masks", "eye creams & treatments"],
    "Body care": ["Body lotions"],
  };

  const skinTypes = ["Dry", "Normal", "Combination", "Oily", "Sensitive"];

  const skinConcerns = [
    "Dryness",
    "Redness",
    "Oiliness",
    "Loss of firmness and elasticity",
    "Fine lines and wrinkles",
    "Pores",
    "Uneven texture",
    "Uneven skin tone",
    "Dark spots",
    "Acne and blemishes",
    "Puffiness",
  ];

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange(filterType, newValues);
  };

  const handlePriceChange = (type, value) => {
    onFilterChange(type, value);
  };

  const hasActiveFilters = () => {
    return (
      filters.category ||
      filters.subcategory ||
      filters.minprice ||
      filters.maxprice ||
      (filters.skin_type && filters.skin_type.length > 0) ||
      (filters.skincare_concerns && filters.skincare_concerns.length > 0)
    );
  };

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters() && (
          <button onClick={onClearFilters} className="clear-filters-btn">
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => toggleSection("category")}
        >
          <span>Category</span>
          <span className="toggle-icon">{isExpanded.category ? "−" : "+"}</span>
        </button>
        {isExpanded.category && (
          <div className="filter-options">
            {categories.map((cat) => (
              <div key={cat.value}>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={filters.category === cat.value}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                  />
                  <span>{cat.label}</span>
                </label>
                {/* Show subcategories if this category is selected */}
                {filters.category === cat.value &&
                  subcategories[cat.value] && (
                    <div className="subcategory-options">
                      {subcategories[cat.value].map((subcat) => (
                        <label key={subcat} className="filter-option subcategory">
                          <input
                            type="radio"
                            name="subcategory"
                            value={subcat}
                            checked={filters.subcategory === subcat}
                            onChange={(e) =>
                              onFilterChange("subcategory", e.target.value)
                            }
                          />
                          <span>{subcat}</span>
                        </label>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => toggleSection("price")}
        >
          <span>Price Range</span>
          <span className="toggle-icon">{isExpanded.price ? "−" : "+"}</span>
        </button>
        {isExpanded.price && (
          <div className="filter-options price-inputs">
            <div className="price-input-group">
              <label>Min Price</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="$0"
                value={filters.minprice || ""}
                onChange={(e) => handlePriceChange("minprice", e.target.value)}
              />
            </div>
            <div className="price-input-group">
              <label>Max Price</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="$100"
                value={filters.maxprice || ""}
                onChange={(e) => handlePriceChange("maxprice", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Skin Type Filter */}
      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => toggleSection("skinType")}
        >
          <span>Skin Type</span>
          <span className="toggle-icon">{isExpanded.skinType ? "−" : "+"}</span>
        </button>
        {isExpanded.skinType && (
          <div className="filter-options">
            {skinTypes.map((type) => (
              <label key={type} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters.skin_type || []).includes(type)}
                  onChange={() => handleCheckboxChange("skin_type", type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Skin Concerns Filter */}
      <div className="filter-section">
        <button
          className="filter-section-header"
          onClick={() => toggleSection("skinConcerns")}
        >
          <span>Skin Concerns</span>
          <span className="toggle-icon">
            {isExpanded.skinConcerns ? "−" : "+"}
          </span>
        </button>
        {isExpanded.skinConcerns && (
          <div className="filter-options">
            {skinConcerns.map((concern) => (
              <label key={concern} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters.skincare_concerns || []).includes(concern)}
                  onChange={() =>
                    handleCheckboxChange("skincare_concerns", concern)
                  }
                />
                <span>{concern}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
