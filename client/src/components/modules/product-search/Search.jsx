import ProductAutocomplete from "../ProductAutocomplete";

const Search = ({ searchQuery, inputQuery, onInputChange, onSubmit }) => (
  <>
    <h1 className="product-page-title">Browse Products</h1>
    <form onSubmit={onSubmit} className="search-form">
      <ProductAutocomplete
        value={inputQuery}
        onChange={onInputChange}
        placeholder="Search for products..."
        onSubmit={onSubmit}
        inputClassName="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
    {searchQuery && (
      <h2>Search results for: &quot;{searchQuery}&quot;</h2>
    )}
  </>
);

export default Search;
