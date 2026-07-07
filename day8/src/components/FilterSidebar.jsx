export default function FilterSidebar({ 
  filters, 
  updateFilter, 
  clearFilters, 
  availableBrands, 
  toggleBrand,
  isOpen,
  onClose,
  categories = [],
}) {
  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
            <button className="close-filters-btn" onClick={onClose} aria-label="Close filters">✕</button>
          </div>
        </div>

        <div className="filter-content">
          {/* Category */}
          <div className="filter-group">
            <h4 className="filter-title">Category</h4>
            <div className="filter-options">
              {categories.map(c => (
                <label key={c.id} className="filter-radio">
                  <input
                    type="radio"
                    name="category"
                    value={c.id}
                    checked={filters.category === c.id}
                    onChange={(e) => updateFilter('category', e.target.value)}
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="filter-options">
              {[
                { label: 'All Prices', value: '' },
                { label: '₹0 – ₹500', value: '0-500' },
                { label: '₹500 – ₹1000', value: '500-1000' },
                { label: '₹1000 – ₹5000', value: '1000-5000' },
                { label: '₹5000 – ₹10000', value: '5000-10000' },
                { label: '₹10000+', value: '10000-' }
              ].map(p => (
                <label key={p.value} className="filter-radio">
                  <input
                    type="radio"
                    name="priceRange"
                    value={p.value}
                    checked={filters.priceRange === p.value}
                    onChange={(e) => updateFilter('priceRange', e.target.value)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <h4 className="filter-title">Rating</h4>
            <div className="filter-options">
              {[
                { label: 'Any Rating', value: 0 },
                { label: '4★ & above', value: 4 },
                { label: '3★ & above', value: 3 },
                { label: '2★ & above', value: 2 },
              ].map(r => (
                <label key={r.value} className="filter-radio">
                  <input
                    type="radio"
                    name="rating"
                    value={r.value}
                    checked={filters.rating === r.value}
                    onChange={(e) => updateFilter('rating', Number(e.target.value))}
                  />
                  <span className="rating-stars">
                    {r.value > 0 ? Array.from({length: r.value}).map((_, i) => <span key={i}>★</span>) : r.label}
                    {r.value > 0 && ' & up'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="filter-group">
            <h4 className="filter-title">Discount</h4>
            <div className="filter-options">
              {[
                { label: 'Any Discount', value: 0 },
                { label: '10% or more', value: 10 },
                { label: '20% or more', value: 20 },
                { label: '30% or more', value: 30 },
                { label: '40% or more', value: 40 },
                { label: '50% or more', value: 50 },
              ].map(d => (
                <label key={d.value} className="filter-radio">
                  <input
                    type="radio"
                    name="discount"
                    value={d.value}
                    checked={filters.discount === d.value}
                    onChange={(e) => updateFilter('discount', Number(e.target.value))}
                  />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="filter-group">
            <h4 className="filter-title">Availability</h4>
            <div className="filter-options">
              <label className="filter-radio">
                <input
                  type="radio"
                  name="availability"
                  value=""
                  checked={filters.availability === ''}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                />
                <span>All</span>
              </label>
              <label className="filter-radio">
                <input
                  type="radio"
                  name="availability"
                  value="in-stock"
                  checked={filters.availability === 'in-stock'}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                />
                <span>In Stock</span>
              </label>
              <label className="filter-radio">
                <input
                  type="radio"
                  name="availability"
                  value="out-of-stock"
                  checked={filters.availability === 'out-of-stock'}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                />
                <span>Out of Stock</span>
              </label>
            </div>
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div className="filter-group">
              <h4 className="filter-title">Brands</h4>
              <div className="filter-options brand-options">
                {availableBrands.map(brand => (
                  <label key={brand} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className="checkbox-custom"></span>
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
