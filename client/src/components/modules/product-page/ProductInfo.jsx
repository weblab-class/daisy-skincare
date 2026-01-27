const ProductInfo = ({ skincareConcerns = [], skinType = [] }) => {
  const concerns = Array.isArray(skincareConcerns) ? skincareConcerns : [];
  const types = Array.isArray(skinType) ? skinType : [];
  return (
  <div className="info-grid">
    <div className="info-section">
      <h3>Skincare Concerns</h3>
      <ul>
        {concerns.length > 0 ? (
          concerns.map((concern, index) => (
            <li key={index}>{concern}</li>
          ))
        ) : (
          <li>No concerns listed</li>
        )}
      </ul>
    </div>

    <div className="info-section">
      <h3>Skin Type</h3>
      <ul>
        {types.length > 0 ? (
          types.map((type, index) => (
            <li key={index}>{type}</li>
          ))
        ) : (
          <li>No skin types listed</li>
        )}
      </ul>
    </div>
  </div>
  );
};

export default ProductInfo;
