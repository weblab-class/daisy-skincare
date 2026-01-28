import { useState, useEffect, useRef, useCallback } from "react";
import { get } from "../../utilities";
import { fuzzyFilter, highlightMatches } from "./FuzzySearch.jsx";
import "./ProductAutocomplete.css";

const SUGGESTION_LIMIT = 20;
const DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 1;
const MAX_RETRIES = 2;
const FUZZY_MIN_SCORE = 0.5;

const ProductAutocomplete = ({
  value,
  onChange,
  placeholder = "Search for products...",
  onSubmit,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabel,
  disabled = false,
  minSearchLength = MIN_SEARCH_LENGTH,
  enableFuzzySearch = true,
  highlightMatch = true,
}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [displayedSuggestions, setDisplayedSuggestions] = useState([]); // What user sees
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Background search indicator
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  const hasInitialResults = useRef(false);

  // Fetch products from API
  const fetchProducts = useCallback(async (q) => {
    const trimmed = (q || "").trim();

    setError(null);

    if (trimmed.length < minSearchLength) {
      setAllProducts([]);
      setSuggestions([]);
      setDisplayedSuggestions([]);
      setLoading(false);
      setIsSearching(false);
      hasInitialResults.current = false;
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // Only show loading spinner on first search or if we have no results
    if (!hasInitialResults.current) {
      setLoading(true);
    } else {
      // Show subtle background indicator instead
      setIsSearching(true);
    }

    try {
      const searchTerm = enableFuzzySearch
        ? trimmed.replace(/[^\w\s]/g, ' ').trim().split(/\s+/)[0]
        : trimmed;

      const data = await get("/api/products", {
        search: searchTerm,
        limit: SUGGESTION_LIMIT,
      }, {
        signal: abortControllerRef.current.signal
      });

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      const validProducts = data.filter(item =>
        item &&
        typeof item === 'object' &&
        item._id &&
        item.name
      );

      setAllProducts(validProducts);
      hasInitialResults.current = true;
      retryCountRef.current = 0;

    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }

      console.error("Product autocomplete error:", err);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(() => fetchProducts(q), 1000 * retryCountRef.current);
        return;
      }

      setError("Unable to load suggestions. Please try again.");
      setAllProducts([]);
      setSuggestions([]);
      setDisplayedSuggestions([]);
      retryCountRef.current = 0;
      hasInitialResults.current = false;

    } finally {
      setLoading(false);
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  }, [minSearchLength, enableFuzzySearch]);

  // Apply fuzzy filtering client-side
  useEffect(() => {
    if (!value || value.trim().length < minSearchLength) {
      setSuggestions([]);
      return;
    }

    if (enableFuzzySearch && allProducts.length > 0) {
      const filtered = fuzzyFilter(
        allProducts,
        value,
        (product) => product.name,
        FUZZY_MIN_SCORE
      );
      setSuggestions(filtered.slice(0, 10));
    } else {
      setSuggestions(allProducts.slice(0, 10));
    }
  }, [value, allProducts, minSearchLength, enableFuzzySearch]);

  // Update displayed suggestions only when loading completes
  useEffect(() => {
    if (!loading && !isSearching) {
      // Small delay to batch updates and reduce flashing
      const timer = setTimeout(() => {
        setDisplayedSuggestions(suggestions);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [suggestions, loading, isSearching]);

  // Debounced API fetch
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchProducts(value);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, fetchProducts]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [displayedSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Show dropdown if we have displayed results OR if we're loading for the first time
  const showDropdown = open && !disabled && (
    displayedSuggestions.length > 0 ||
    (loading && !hasInitialResults.current) ||
    error
  );

  const selectItem = (product) => {
    if (!product || !product.name || !product._id) {
      console.warn("Invalid product selected:", product);
      return;
    }

    onChange(product.name, product._id);
    setOpen(false);
    setAllProducts([]);
    setSuggestions([]);
    setDisplayedSuggestions([]);
    setHighlightedIndex(-1);
    hasInitialResults.current = false;

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (showDropdown && highlightedIndex >= 0 && displayedSuggestions[highlightedIndex]) {
        selectItem(displayedSuggestions[highlightedIndex]);
      } else if (onSubmit) {
        onSubmit(e);
      }
      return;
    }

    if (!showDropdown || displayedSuggestions.length === 0) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < displayedSuggestions.length - 1 ? prev + 1 : prev
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (e.key === "Tab") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      highlightedElement?.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [highlightedIndex]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue, "");

    if (newValue.trim().length >= minSearchLength && !open) {
      setOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
      if (value && value.trim().length >= minSearchLength && allProducts.length === 0) {
        fetchProducts(value);
      }
    }
  };

  // Render product name with highlighting
  const renderProductName = (product) => {
    if (!highlightMatch || !value) {
      return product.name;
    }

    const parts = highlightMatches(product.name, value);

    if (typeof parts === 'string') {
      return parts;
    }

    return (
      <>
        {parts.before}
        <strong className="ProductAutocomplete-highlight">{parts.match}</strong>
        {parts.after}
      </>
    );
  };

  return (
    <div
      ref={wrapperRef}
      className={`ProductAutocomplete ${className} ${disabled ? 'ProductAutocomplete--disabled' : ''}`}
      aria-expanded={showDropdown}
      aria-haspopup="listbox"
      role="combobox"
    >
      <div className="ProductAutocomplete-inputWrapper">
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`ProductAutocomplete-input ${inputClassName}`}
          autoComplete="off"
          disabled={disabled}
          aria-label={ariaLabel || placeholder}
          aria-autocomplete="list"
          aria-controls="ProductAutocomplete-list"
          aria-activedescendant={
            highlightedIndex >= 0 && displayedSuggestions[highlightedIndex]
              ? `ProductAutocomplete-option-${displayedSuggestions[highlightedIndex]._id}`
              : undefined
          }
        />
        {isSearching && displayedSuggestions.length > 0 && (
          <div className="ProductAutocomplete-searchIndicator" aria-hidden="true">
            <span className="ProductAutocomplete-searchDot"></span>
          </div>
        )}
      </div>
      {showDropdown && (
        <ul
          ref={listRef}
          id="ProductAutocomplete-list"
          role="listbox"
          className="ProductAutocomplete-list"
        >
          {loading && !hasInitialResults.current ? (
            <li
              className="ProductAutocomplete-item ProductAutocomplete-item--loading"
              role="status"
              aria-live="polite"
            >
              Searching…
            </li>
          ) : error ? (
            <li
              className="ProductAutocomplete-item ProductAutocomplete-item--error"
              role="alert"
            >
              {error}
            </li>
          ) : displayedSuggestions.length === 0 ? (
            <li
              className="ProductAutocomplete-item ProductAutocomplete-item--empty"
              role="status"
            >
              No products found
            </li>
          ) : (
            displayedSuggestions.map((product, index) => (
              <li
                key={product._id}
                id={`ProductAutocomplete-option-${product._id}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`ProductAutocomplete-item ${
                  index === highlightedIndex ? "ProductAutocomplete-item--highlight" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectItem(product);
                }}
              >
                {renderProductName(product)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductAutocomplete;
