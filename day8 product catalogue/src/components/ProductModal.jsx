import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatINR, discountPct } from "../utils/currency";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`, "success", "🛒");
    onClose();
  };

  return (
    <>
      <div className="modal-overlay open" onClick={onClose} />
      <div className="product-modal open">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="modal-content">
          {/* Image */}
          <div className="modal-img-section">
            <img
              src={product.image}
              alt={product.name}
              className="modal-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x600/130e02/f97316?text=NexaStore`;
              }}
            />
          </div>

          {/* Info */}
          <div className="modal-info-section">
            <div className="modal-category">{product.categoryLabel}</div>
            <h2 className="modal-name">{product.name}</h2>

            <div className="modal-rating">
              <span className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ opacity: i < Math.round(product.rating) ? 1 : 0.25 }}>
                    ★
                  </span>
                ))}
              </span>
              <span className="rating-score">{product.rating}</span>
              <span className="rating-count">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="modal-price-row">
              <span className="modal-price-current">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="modal-price-original">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span
                  className="badge badge-sale"
                  style={{ marginLeft: "8px", fontSize: "12px" }}
                >
                  {discountPct(product.originalPrice, product.price)}% OFF
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="modal-qty-row">
              <label>Quantity:</label>
              <div className="modal-qty">
                <button
                  className="modal-qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="modal-qty-num">{qty}</span>
                <button
                  className="modal-qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleAdd}>
                Add to Cart — {formatINR(product.price * qty)}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                Continue Shopping
              </button>
            </div>

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="modal-features">
                <div className="modal-features-title">Key Features</div>
                <ul className="modal-feature-list">
                  {product.features.map((f) => (
                    <li key={f} className="modal-feature-item">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
