import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import SmartSearch from "./SmartSearch";

export default function Navbar({ onSearchChange, searchQuery }) {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Categories", href: "#categories" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <a href="#home" className="nav-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">NexaStore</span>
        </a>

        {/* Links */}
        <ul className={`nav-links${mobileOpen ? " open" : ""}`}>
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <button
            className="nav-btn search-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((p) => !p)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            className="nav-btn cart-btn"
            aria-label="Cart"
            onClick={() => setIsOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="cart-count visible">{totalItems}</span>
            )}
          </button>

          <button
            className="hamburger"
            aria-label="Menu"
            onClick={() => setMobileOpen((p) => !p)}
          >
            <span
              style={mobileOpen ? { transform: "rotate(45deg) translate(5px,5px)" } : {}}
            />
            <span style={mobileOpen ? { opacity: 0 } : {}} />
            <span
              style={mobileOpen ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}}
            />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`search-bar-wrapper${searchOpen ? " open" : ""}`}>
        <SmartSearch 
          query={searchQuery} 
          setQuery={onSearchChange} 
          onSearchSubmit={() => setSearchOpen(false)} 
        />
      </div>
    </nav>
  );
}
