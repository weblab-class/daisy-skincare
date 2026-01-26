const parseHighlightedIngredients = (highlighted) => {
  let ingredientsArray = [];
  if (!highlighted) return ingredientsArray;

  if (Array.isArray(highlighted)) {
    ingredientsArray = highlighted.flatMap((ing) => {
      if (typeof ing === "string") {
        return ing
          .split(/\s+-/)
          .map((item) => item.replace(/^-\s*/, "").trim())
          .filter(Boolean);
      }
      return ing ? [String(ing).trim()] : [];
    }).filter(Boolean);
  } else if (typeof highlighted === "string") {
    ingredientsArray = highlighted
      .split(/\s+-/)
      .map((item) => item.replace(/^-\s*/, "").trim())
      .filter(Boolean);
  }
  return ingredientsArray;
};

const ProductIngredients = ({
  highlightedIngredients,
  ingredients = [],
  showFullIngredients,
  onToggleIngredients,
}) => {
  const parsed = parseHighlightedIngredients(highlightedIngredients);
  const ingList = Array.isArray(ingredients) ? ingredients : [];

  return (
    <div className="ingredients-section">
      <h3>Highlighted Ingredients</h3>
      <div className="highlighted-ingredients">
        {parsed.length > 0 ? (
          parsed.map((ing, index) => (
            <div key={index} className="ingredient-item">
              {ing}
            </div>
          ))
        ) : (
          <div>No highlighted ingredients listed.</div>
        )}
      </div>
      <button type="button" className="see-more" onClick={onToggleIngredients}>
        {showFullIngredients ? "Hide ingredient list" : "See full ingredient list"}
      </button>
      {showFullIngredients && (
        <div className="full-ingredients">
          {ingList.length > 0 ? ingList.join(", ") : "No ingredients listed."}
        </div>
      )}
    </div>
  );
};

export default ProductIngredients;
