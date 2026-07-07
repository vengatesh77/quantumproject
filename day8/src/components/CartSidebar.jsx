import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatINR } from "../utils/currency";

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQty, clearCart, subtotal } =
    useCart();
  const { showToast } = useToast();

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    showToast("Order placed successfully! 🎉", "success", "✅");
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? " open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar${isOpen ? " open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart {items.length > 0 && `(${items.length})`}</h3>
          <button
            className="cart-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/64x64/130e02/f97316?text=NexaStore`;
                  }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    {formatINR(item.price * item.qty)}
                  </div>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="qty-num">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="cart-shipping">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free 🎉" : formatINR(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "-8px" }}>
                Add {formatINR(999 - subtotal)} more for free shipping
              </p>
            )}
            <div className="cart-total">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
            <button className="btn btn-primary btn-full" onClick={handleCheckout}>
              Checkout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn btn-outline btn-full" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
