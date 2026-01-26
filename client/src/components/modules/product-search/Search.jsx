const Search = ({ searchQuery, inputQuery, onInputChange, onSubmit }) => (
  <>
    <h1 className="product-page-title">Browse Products</h1>
    <form onSubmit={onSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search for products..."
        value={inputQuery}
        onChange={(e) => onInputChange(e.target.value)}
        className="search-input"
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
