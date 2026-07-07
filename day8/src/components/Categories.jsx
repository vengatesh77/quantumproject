export default function Categories({ activeCategory, onCategoryChange, categories = [], productCounts = {} }) {
  return (
    <section className="categories-strip" id="categories">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Browse By</span>
          <h2 className="section-title">Categories</h2>
          <p className="section-sub">Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-card${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              <div className="cat-icon">{cat.icon}</div>
              <span className="cat-name">{cat.label}</span>
              {productCounts[cat.id] !== undefined && (
                <span className="cat-count">{productCounts[cat.id]}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
