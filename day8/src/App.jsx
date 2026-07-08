import { useState, useEffect, useMemo } from "react";
import { CartProvider }  from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import Categories    from "./components/Categories";
import ProductGrid   from "./components/ProductGrid";
import ProductModal  from "./components/ProductModal";
import CartSidebar   from "./components/CartSidebar";
import Features      from "./components/Features";
import Newsletter    from "./components/Newsletter";
import Footer        from "./components/Footer";
import FilterSidebar from "./components/FilterSidebar";
import useProducts   from "./hooks/useProducts";
import useSmartSearch from "./hooks/useSmartSearch";

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
      padding: '20px 0',
    }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          animation: 'skeletonPulse 1.4s ease-in-out infinite',
          animationDelay: `${i * 0.08}s`,
        }}>
          <div style={{ height: '200px', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ padding: '16px' }}>
            <div style={{ height: '14px', borderRadius: '7px', background: 'rgba(255,255,255,0.07)', marginBottom: '10px', width: '80%' }} />
            <div style={{ height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', width: '55%' }} />
            <div style={{ height: '18px', borderRadius: '9px', background: 'rgba(139,92,246,0.2)',   width: '40%' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes skeletonPulse {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────
function ApiError({ message, onRetry }) {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 20px',
      color: 'rgba(255,255,255,0.7)',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <h3 style={{ marginBottom: '8px', color: '#fff' }}>Could not load products</h3>
      <p style={{ marginBottom: '24px', fontSize: '14px' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '10px 28px', borderRadius: '999px',
          background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: '15px',
        }}
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Main app content ─────────────────────────────────────────────────────────
function AppContent() {
  const [selectedProduct,  setSelectedProduct]  = useState(null);
  const [showScrollTop,    setShowScrollTop]    = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // ① Load real products from APIs
  const { products, categories, loading, error, refresh } = useProducts();

  // ② Smart search/filter/sort on top of API products
  const {
    query, setQuery,
    filters, updateFilter, toggleBrand, clearFilters,
    sortBy, setSortBy,
    filteredProducts, availableBrands,
    cleanQuery,
  } = useSmartSearch(products, 'all');

  // ③ Per-category product counts for the category bar
  const productCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Scroll-to-top visibility
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProduct]);

  // Keyboard close for modal
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setSelectedProduct(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Animated BG particles */}
      <div className="bg-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width:  `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0
                ? "rgba(139,92,246,0.6)"
                : i % 3 === 1
                ? "rgba(6,182,212,0.5)"
                : "rgba(236,72,153,0.4)",
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay:    `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <Navbar onSearchChange={setQuery} searchQuery={query} />
      <Hero products={products} />

      {/* Category bar — receives API-derived categories */}
      <Categories
        activeCategory={filters.category}
        categories={categories}
        productCounts={productCounts}
        onCategoryChange={(cat) => {
          updateFilter('category', cat);
          setQuery("");
          document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div className="shop-layout container" id="products">
        {/* Mobile filter toggle */}
        <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4"  y1="21" x2="4"  y2="14"/><line x1="4"  y1="10" x2="4"  y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8"  x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1"  y1="14" x2="7"  y2="14"/><line x1="9"  y1="8"  x2="15" y2="8"/>
            <line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
          Filters
        </button>

        {/* Sidebar — receives API-derived categories */}
        <FilterSidebar
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          availableBrands={availableBrands}
          toggleBrand={toggleBrand}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          categories={categories}
        />

        <div className="shop-main">
          {loading ? (
            <ProductSkeleton />
          ) : error ? (
            <ApiError message={error} onRetry={refresh} />
          ) : (
            <ProductGrid
              products={filteredProducts}
              onOpenModal={setSelectedProduct}
              sortBy={sortBy}
              setSortBy={setSortBy}
              highlightTerm={cleanQuery}
            />
          )}
        </div>
      </div>

      <Features />
      <Newsletter />
      <Footer />

      <CartSidebar />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Scroll to Top */}
      <button
        className={`scroll-top${showScrollTop ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Loading indicator in navbar area */}
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg,#8b5cf6,#ec4899,#06b6d4)',
          backgroundSize: '200% 100%',
          animation: 'shimmerBar 1.2s linear infinite',
          zIndex: 9999,
        }}>
          <style>{`
            @keyframes shimmerBar {
              0%   { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </CartProvider>
  );
}

