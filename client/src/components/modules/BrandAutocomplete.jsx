import { useState, useEffect, useRef, useCallback } from "react";
import { get } from "../../utilities";
import { fuzzyFilter, highlightMatches } from "./FuzzySearch.jsx";
import "./ProductAutocomplete.css";

const SUGGESTION_LIMIT = 30;
const DEBOUNCE_MS = 300;
const MAX_RETRIES = 2;
const FUZZY_MIN_SCORE = 0.3;

const BrandAutocomplete = ({
  value,
  onChange,
  placeholder = "Brand",
  onSubmit,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabel,
  disabled = false,
  enableFuzzySearch = true,
  highlightMatch = true,
}) => {
  const [allBrands, setAllBrands] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [displayedSuggestions, setDisplayedSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  const lastFetchedValueRef = useRef("");
  const hasInitialResults = useRef(false);

  // Fetch brands from API
  const fetchBrands = useCallback(async (q) => {
    const trimmed = (q || "").trim();

    setError(null);

    if (trimmed === lastFetchedValueRef.current) {
      return;
    }

    lastFetchedValueRef.current = trimmed;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // Only show loading spinner on first search or if we have no results
    if (!hasInitialResults.current) {
      setLoading(true);
    } else {
      setIsSearching(true);
    }

    try {
      const params = { limit: SUGGESTION_LIMIT };

      if (trimmed) {
        const searchTerm = enableFuzzySearch
          ? trimmed.replace(/[^\w\s]/g, ' ').trim().split(/\s+/)[0]
          : trimmed;
        params.search = searchTerm;
      }

      const data = await get("/api/brands", params, {
        signal: abortControllerRef.current.signal
      });

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      const validBrands = data
        .map((brand) => (brand != null ? String(brand).trim() : ""))
        .filter((brand) => brand.length > 0)
        .filter((brand, index, self) => self.indexOf(brand) === index);

      setAllBrands(validBrands);
      hasInitialResults.current = true;
      retryCountRef.current = 0;

    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }

      console.error("Brand autocomplete error:", err);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(() => fetchBrands(q), 1000 * retryCountRef.current);
        return;
      }

      setError("Unable to load brands. Please try again.");
      setAllBrands([]);
      setSuggestions([]);
      setDisplayedSuggestions([]);
      retryCountRef.current = 0;
      hasInitialResults.current = false;

    } finally {
      setLoading(false);
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  }, [enableFuzzySearch]);

  // Apply fuzzy filtering client-side
  useEffect(() => {
    if (!value || value.trim() === "") {
      setSuggestions(allBrands.slice(0, 15));
      return;
    }

    if (enableFuzzySearch && allBrands.length > 0) {
      const filtered = fuzzyFilter(
        allBrands.map(b => ({ name: b })),
        value,
        (item) => item.name,
        FUZZY_MIN_SCORE
      );
      setSuggestions(filtered.map(item => item.name).slice(0, 15));
    } else {
      const lowerValue = value.toLowerCase();
      const filtered = allBrands.filter(brand =>
        brand.toLowerCase().includes(lowerValue)
      );
      setSuggestions(filtered.slice(0, 15));
    }
  }, [value, allBrands, enableFuzzySearch]);

  // Update displayed suggestions only when loading completes
  useEffect(() => {
    if (!loading && !isSearching) {
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
      fetchBrands(value);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, fetchBrands]);

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

  const showDropdown = open && !disabled && (
    displayedSuggestions.length > 0 ||
    (loading && !hasInitialResults.current) ||
    error
  );

  const selectItem = (brand) => {
    const normalizedBrand = brand != null ? String(brand).trim() : "";

    if (!normalizedBrand) {
      console.warn("Invalid brand selected:", brand);
      return;
    }

    onChange(normalizedBrand);
    setOpen(false);
    setAllBrands([]);
    setSuggestions([]);
    setDisplayedSuggestions([]);
    setHighlightedIndex(-1);
    hasInitialResults.current = false;

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (showDropdown && highlightedIndex >= 0 && displayedSuggestions[highlightedIndex] != null) {
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
    onChange(newValue);

    if (!open) {
      setOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
      if (allBrands.length === 0 && lastFetchedValueRef.current !== value) {
        fetchBrands(value);
      }
    }
  };

  // Render brand name with highlighting
  const renderBrandName = (brand) => {
    if (!highlightMatch || !value) {
      return brand;
    }

    const parts = highlightMatches(brand, value);

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
      className={`BrandAutocomplete ProductAutocomplete ${className} ${
        disabled ? 'ProductAutocomplete--disabled' : ''
      }`}
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
          aria-controls="BrandAutocomplete-list"
          aria-activedescendant={
            highlightedIndex >= 0 && displayedSuggestions[highlightedIndex] != null
              ? `BrandAutocomplete-option-${highlightedIndex}`
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
          id="BrandAutocomplete-list"
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
              No brands found
            </li>
          ) : (
            displayedSuggestions.map((brand, index) => (
              <li
                key={`${brand}-${index}`}
                id={`BrandAutocomplete-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`ProductAutocomplete-item ${
                  index === highlightedIndex ? "ProductAutocomplete-item--highlight" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectItem(brand);
                }}
              >
                {renderBrandName(brand)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default BrandAutocomplete;
