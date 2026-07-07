import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onOpenModal, sortBy, setSortBy, highlightTerm = "" }) {
  const [isListMode, setIsListMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const observerTarget = useRef(null);

  const sorted = products;

  useEffect(() => {
    setVisibleCount(24); // Reset on products change (e.g. search/filter)
  }, [products]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sorted.length) {
          setVisibleCount((prev) => Math.min(prev + 24, sorted.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, sorted.length]);

  const visibleProducts = sorted.slice(0, visibleCount);

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Collection</span>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-sub">Handpicked premium items for you</p>
        </div>

        {/* Toolbar */}
        <div className="products-toolbar">
          <div className="results-count">
            Showing <span>{sorted.length}</span> product{sorted.length !== 1 ? "s" : ""}
          </div>
          <div className="toolbar-right">
            <div className="sort-wrapper">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
                <option value="discount">Biggest Discount</option>
                <option value="name-a-z">A–Z</option>
                <option value="name-z-a">Z–A</option>
              </select>
            </div>
            <div className="view-toggle">
              <button
                className={`view-btn${!isListMode ? " active" : ""}`}
                onClick={() => setIsListMode(false)}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
              </button>
              <button
                className={`view-btn${isListMode ? " active" : ""}`}
                onClick={() => setIsListMode(true)}
                aria-label="List view"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Grid / List */}
        {sorted.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try another keyword or adjust your filters.</p>
          </div>
        ) : (
          <>
            <div className={`products-grid${isListMode ? " list-mode" : ""}`}>
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  index={index}
                  product={product}
                  onOpenModal={onOpenModal}
                  isListMode={isListMode}
                  highlightTerm={highlightTerm}
                />
              ))}
            </div>
            
            {visibleCount < sorted.length && (
              <div ref={observerTarget} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner" style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  border: '3px solid rgba(139,92,246,0.3)',
                  borderRadius: '50%',
                  borderTopColor: '#8b5cf6',
                  animation: 'spin 1s ease-in-out infinite'
                }}></div>
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
