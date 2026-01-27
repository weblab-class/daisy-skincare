import { useState, useEffect, useRef, useCallback } from "react";
import { get } from "../../utilities";
import "./ProductAutocomplete.css";

const SUGGESTION_LIMIT = 15;
const DEBOUNCE_MS = 300;

const BrandAutocomplete = ({
  value,
  onChange,
  placeholder = "Brand",
  onSubmit,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabel,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const fetchSuggestions = useCallback(async (q) => {
    const trimmed = (q || "").trim();
    setLoading(true);
    setSuggestions([]);
    try {
      const params = { limit: SUGGESTION_LIMIT };
      if (trimmed) params.search = trimmed;
      const data = await get("/api/brands", params);
      const list = Array.isArray(data) ? data : [];
      setSuggestions(list.map((b) => (b != null ? String(b) : "")).filter(Boolean));
    } catch (err) {
      console.error("Brand autocomplete error:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  useEffect(() => setHighlightedIndex(-1), [suggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = open && (suggestions.length > 0 || loading);

  const selectItem = (brand) => {
    if (brand != null && brand !== "") {
      onChange(brand);
      setOpen(false);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && highlightedIndex >= 0 && suggestions[highlightedIndex] != null) {
        selectItem(suggestions[highlightedIndex]);
      } else if (onSubmit) onSubmit(e);
      return;
    }
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : -1));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIndex];
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div
      ref={wrapperRef}
      className={`BrandAutocomplete ProductAutocomplete ${className}`}
      aria-expanded={showDropdown}
      aria-haspopup="listbox"
      role="combobox"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`ProductAutocomplete-input ${inputClassName}`}
        autoComplete="off"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls="BrandAutocomplete-list"
        aria-activedescendant={
          highlightedIndex >= 0 && suggestions[highlightedIndex] != null
            ? `BrandAutocomplete-option-${highlightedIndex}`
            : undefined
        }
      />
      {showDropdown && (
        <ul
          ref={listRef}
          id="BrandAutocomplete-list"
          role="listbox"
          className="ProductAutocomplete-list"
        >
          {loading ? (
            <li className="ProductAutocomplete-item ProductAutocomplete-item--loading">
              Searching…
            </li>
          ) : (
            suggestions.map((b, i) => (
              <li
                key={b}
                id={`BrandAutocomplete-option-${i}`}
                role="option"
                aria-selected={i === highlightedIndex}
                className={`ProductAutocomplete-item ${i === highlightedIndex ? "ProductAutocomplete-item--highlight" : ""}`}
                onMouseEnter={() => setHighlightedIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectItem(b);
                }}
              >
                {b}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default BrandAutocomplete;
