import { useState, useEffect, useRef } from 'react';
import { highlightText } from '../utils/highlight';
import { products } from '../data/products';

export default function SmartSearch({ query, setQuery, onSearchSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('nexa_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim().toLowerCase();
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('nexa_recent_searches', JSON.stringify(updated));
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    saveSearch(suggestion);
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveSearch(query);
      setIsOpen(false);
      if (onSearchSubmit) onSearchSubmit(query);
    }
  };

  // Generate suggestions
  const suggestions = (() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    
    products.forEach(p => {
      if (results.length >= 6) return;
      if (p.name.toLowerCase().includes(q)) {
        results.push(p.name);
      } else if (p.categoryLabel.toLowerCase().includes(q) && !results.includes(p.categoryLabel)) {
        results.push(p.categoryLabel);
      } else if (p.brand && p.brand.toLowerCase().includes(q) && !results.includes(p.brand)) {
        results.push(p.brand);
      }
    });

    return [...new Set(results)].slice(0, 6);
  })();

  return (
    <div className="smart-search-wrapper" ref={wrapperRef}>
      <div className="search-input-container">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="smart-search-input"
          placeholder="Search products, brands, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {query && (
          <button className="search-clear-btn" onClick={() => setQuery('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {isOpen && (query.trim() || recentSearches.length > 0) && (
        <div className="search-dropdown">
          {query.trim() && suggestions.length > 0 && (
            <div className="search-section">
              <h4 className="search-section-title">Suggestions</h4>
              <ul className="suggestion-list">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => handleSelectSuggestion(s)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 10 4 15 9 20"></polyline>
                      <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                    </svg>
                    {highlightText(s, query.trim())}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {!query.trim() && recentSearches.length > 0 && (
            <div className="search-section">
              <h4 className="search-section-title">Recent Searches</h4>
              <ul className="suggestion-list recent-list">
                {recentSearches.map((s, i) => (
                  <li key={i} onClick={() => handleSelectSuggestion(s)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query.trim() && suggestions.length === 0 && (
            <div className="search-no-results">
              No suggestions found. Press Enter to search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
