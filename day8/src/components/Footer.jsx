export default function Footer() {
  const quickLinks = ["Home", "Products", "Categories", "About Us"];
  const categories = ["Audio", "Wearables", "Computers", "Cameras"];
  const support = ["FAQ", "Shipping Policy", "Return Policy", "Contact Us"];

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#home" className="nav-logo">
              <span className="logo-icon">⬡</span>
              <span className="logo-text">NexaStore</span>
            </a>
            <p className="footer-desc">
              Your premium destination for cutting-edge technology and
              innovative gadgets.
            </p>
            <div className="social-links">
              {["𝕏", "📸", "f", "▶"].map((icon, i) => (
                <a key={i} href="#" className="social-btn" aria-label={`Social ${i}`}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              {categories.map((c) => (
                <li key={c}>
                  <a href="#">{c}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              {support.map((s) => (
                <li key={s}>
                  <a href="#">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📧 hello@nexastore.com</p>
            <p>📞 +1 (800) 123-4567</p>
            <p>📍 123 Tech Street, SF, CA</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 NexaStore. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
