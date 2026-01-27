import "./ProductRatings.css";

const ProductRatings = ({ ratings}) => {

  if (!ratings) {
    return <div className="product-ratings">No current ratings</div>;
  }

  return (
    <div className="product-ratings">
      <div className="rating-section">
  <div className="rating-circle">
    {ratings.userRating !== null
      ? ratings.userRating.toFixed(1)
      : "N/A"}
  </div>

  <div className="rating-labels">
    <div className="rating-row">
      <span className="label">Your Rating</span>
      <span className="value">
        {ratings.userRating !== null
          ? ratings.userRating.toFixed(1)
          : "N/A"}
      </span>
    </div>

    <div className="rating-row">
      <span className="label">
        Overall Rating ({ratings.overallCount})
      </span>
      <span className="value">
        {ratings.overallCount > 0
          ? ratings.overallAverage.toFixed(1)
          : "N/A"}
      </span>
    </div>
  </div>
</div>

</div>


  );
};

export default ProductRatings;
