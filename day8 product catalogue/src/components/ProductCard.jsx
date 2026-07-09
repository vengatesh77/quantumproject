import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatINR } from "../utils/currency";
import { highlightText } from "../utils/highlight";

function StarRating({ rating }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < Math.round(rating) ? 1 : 0.25 }}>
          ★
        </span>
      ))}
    </span>
  );
}

function BadgeTag({ badge, label }) {
  if (!badge) return null;
  return <span className={`badge badge-${badge}`}>{label}</span>;
}

export default function ProductCard({ product, onOpenModal, isListMode, highlightTerm = "", index = 0 }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} added to cart!`, "success", "🛒");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlisted((p) => !p);
    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist!",
      "info",
      wishlisted ? "💔" : "❤️"
    );
  };

  return (
    <div
      className={`product-card${isListMode ? " list-card" : ""}`}
      onClick={() => onOpenModal(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpenModal(product)}
      style={{ animationDelay: `${(index % 12) * 0.06}s` }}
    >
      {/* Badges */}
      <div className="product-badges">
        <BadgeTag badge={product.badge} label={product.badgeLabel} />
      </div>

      {/* Wishlist */}
      <button
        className={`wishlist-btn${wishlisted ? " active" : ""}`}
        onClick={handleWishlist}
        aria-label="Toggle wishlist"
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>

      {/* Image */}
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://source.unsplash.com/400x400/?${product.category}`;
          }}
        />
      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-category">{product.categoryLabel}</div>
        <h3 className="product-name">{highlightText(product.name, highlightTerm)}</h3>

        {isListMode && (
          <p className="product-desc">{product.description}</p>
        )}

        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="rating-score">{product.rating}</span>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-meta">
          <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </span>
          {product.deliveryTime && (
            <span className="delivery-time">🚚 Delivers in {product.deliveryTime}</span>
          )}
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-current">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">{formatINR(product.originalPrice)}</span>
            )}
          </div>
          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
