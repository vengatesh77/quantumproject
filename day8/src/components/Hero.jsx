import { useState, useEffect } from "react";
import { products } from "../data/products";
import { formatINR } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Hero({ products = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const featured = products.length >= 6 
    ? [products[5], products[0], products[1]] 
    : products.slice(0, 3);

  // Auto-rotate every 3.5s
  useEffect(() => {
    if (!featured.length) return;
    const t = setInterval(
      () => setActiveIdx((i) => (i + 1) % featured.length),
      3500
    );
    return () => clearInterval(t);
  }, [featured.length]);

  if (!featured.length || !featured[0]) return null;

  const active = featured[activeIdx] || featured[0];

  const handleAdd = () => {
    addToCart(active);
    showToast(`${active.name} added to cart!`, "success", "🛒");
  };

  return (
    <section className="hero" id="home">
      {/* ---- LEFT: text content ---- */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          ⭐ India's Trusted Online Shopping Destination
        </div>
        <h1 className="hero-title">
          Discover <span className="gradient-text">Premium</span> Products
          <br />
          For Every Lifestyle
        </h1>
        <p className="hero-subtitle">
          Explore a premium collection of Fashion, Electronics, Beauty, Home Essentials, Accessories, and much more—all in one place at unbeatable prices.
        </p>
        <div className="hero-actions">
          <a href="#products" className="btn btn-primary">
            Shop Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#categories" className="btn btn-outline">
            Browse Categories
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">1200+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">75K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">4.9★</span>
            <span className="stat-label">Customer Rating</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">250+</span>
            <span className="stat-label">Top Brands</span>
          </div>
        </div>
      </div>

      {/* ---- RIGHT: Featured Product Showcase ---- */}
      <div className="hero-visual">
        {/* Main product card */}
        <div className="showcase-card" key={active.id}>
          {/* Top strip */}
          <div className="showcase-top">
            <span className={`badge badge-${active.badge}`}>{active.badgeLabel}</span>
            <span className="showcase-cat">{active.categoryLabel}</span>
          </div>

          {/* Product image */}
          <div className="showcase-img-wrap">
            <img
              src={active.image}
              alt={active.name}
              className="showcase-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/300x300/130e02/f97316?text=NexaStore`;
              }}
            />
            <div className="showcase-img-glow" />
          </div>

          {/* Info */}
          <div className="showcase-info">
            <h3 className="showcase-name">{active.name}</h3>
            <div className="showcase-rating">
              <span className="stars">{"★".repeat(Math.round(active.rating))}</span>
              <span>{active.rating}</span>
              <span className="rating-count">({active.reviews.toLocaleString("en-IN")} reviews)</span>
            </div>
            <div className="showcase-price-row">
              <span className="showcase-price">{formatINR(active.price)}</span>
              <span className="showcase-original">{formatINR(active.originalPrice)}</span>
              <span className="showcase-discount">
                {Math.round(((active.originalPrice - active.price) / active.originalPrice) * 100)}% OFF
              </span>
            </div>

            {/* Feature pills */}
            <div className="showcase-features">
              {active.features.slice(0, 3).map((f) => (
                <span key={f} className="showcase-pill">✓ {f}</span>
              ))}
            </div>

            <button className="btn btn-primary btn-full showcase-cta" onClick={handleAdd}>
              Add to Cart
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="showcase-dots">
          {featured.map((_, i) => (
            <button
              key={i}
              className={`showcase-dot${i === activeIdx ? " active" : ""}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`Show product ${i + 1}`}
            />
          ))}
        </div>

        {/* Mini thumbnails */}
        <div className="showcase-thumbs">
          {featured.map((p, i) => (
            <button
              key={p.id}
              className={`showcase-thumb${i === activeIdx ? " active" : ""}`}
              onClick={() => setActiveIdx(i)}
              aria-label={p.name}
            >
              <img
                src={p.image}
                alt={p.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/60x60/130e02/f97316?text=NexaStore";
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
