import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.", "error", "⚠️");
      return;
    }
    showToast("Successfully subscribed! Welcome 🎉", "success", "📬");
    setEmail("");
  };

  return (
    <section className="newsletter-section" id="about">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-glow" />
          <div className="newsletter-content">
            <span className="section-tag">Stay Updated</span>
            <h2>Get Exclusive Deals</h2>
            <p>
              Subscribe to our newsletter and be the first to know about new
              products, special offers, and limited-time deals.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button className="btn btn-primary" onClick={handleSubscribe}>
                Subscribe
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="newsletter-fine">
              No spam. Unsubscribe at any time.
            </p>
          </div>
          <div className="newsletter-visual">
            <div className="nv-ring nv-ring-1" />
            <div className="nv-ring nv-ring-2" />
            <div className="nv-emoji">📬</div>
          </div>
        </div>
      </div>
    </section>
  );
}
