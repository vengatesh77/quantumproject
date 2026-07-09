import { useState, useMemo } from 'react';
import { parseNaturalLanguageQuery } from '../utils/searchLogic';

/**
 * useSmartSearch – All search / filter / sort logic.
 * Accepts an external `products` array (from API) instead of importing static data.
 */
export default function useSmartSearch(products = [], initialCategory = 'all') {
  const [query,  setQuery]  = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({
    category:     initialCategory,
    priceRange:   '',
    rating:       0,
    discount:     0,
    availability: '',
    brands:       [],
    colors:       [],
    sizes:        [],
  });

  // Derive unique brand, color, size lists from whatever products are loaded
  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.color) set.add(p.color);
    });
    return Array.from(set).sort();
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.size) set.add(p.size);
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    let result = [...products];

    // 1 – Natural-language query
    const nlp        = parseNaturalLanguageQuery(query);
    const cleanQuery = nlp.cleanQuery;

    if (cleanQuery) {
      const tokens = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter(p => {
        const text = [
          p.name,
          p.brand || '',
          p.category,
          p.categoryLabel,
          p.description,
          p.badge,
          p.badgeLabel,
          p.color || '',
          p.size || '',
          ...(p.features || []),
        ].join(' ').toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }

    // 2 – NLP extracted numeric filters
    if (nlp.priceMax  !== null) result = result.filter(p => p.price   <= nlp.priceMax);
    if (nlp.priceMin  !== null) result = result.filter(p => p.price   >= nlp.priceMin);
    if (nlp.ratingMin !== null) result = result.filter(p => p.rating  >= nlp.ratingMin);
    if (nlp.discountMin !== null) {
      result = result.filter(p => {
        if (!p.originalPrice) return false;
        return ((p.originalPrice - p.price) / p.originalPrice) * 100 >= nlp.discountMin;
      });
    }

    // 3 – Sidebar filters
    if (filters.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.priceRange) {
      const [lo, hi] = filters.priceRange.split('-').map(Number);
      result = hi
        ? result.filter(p => p.price >= lo && p.price <= hi)
        : result.filter(p => p.price >= lo);
    }

    if (filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    if (filters.discount > 0) {
      result = result.filter(p => {
        if (!p.originalPrice) return false;
        return ((p.originalPrice - p.price) / p.originalPrice) * 100 >= filters.discount;
      });
    }

    if (filters.availability === 'in-stock')  result = result.filter(p => p.inStock !== false);
    if (filters.availability === 'out-of-stock') result = result.filter(p => p.inStock === false);

    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.colors && filters.colors.length > 0) {
      result = result.filter(p => filters.colors.includes(p.color));
    }

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter(p => filters.sizes.includes(p.size));
    }

    // 4 – Sorting
    const activeSort = nlp.sortCommand || sortBy;
    switch (activeSort) {
      case 'price-low':    result.sort((a, b) => a.price - b.price);               break;
      case 'price-high':   result.sort((a, b) => b.price - a.price);               break;
      case 'rating':       result.sort((a, b) => b.rating - a.rating);             break;
      case 'newest':       result.sort((a, b) => String(b.id).localeCompare(String(a.id))); break;
      case 'best-selling':
      case 'popular':      result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break;
      case 'discount':
        result.sort((a, b) => {
          const ad = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const bd = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return bd - ad;
        });
        break;
      case 'name-a-z': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-z-a': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }

    return result;
  }, [query, filters, sortBy, products]);

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({ category: 'all', priceRange: '', rating: 0, discount: 0, availability: '', brands: [], colors: [], sizes: [] });
    setQuery('');
  };

  const toggleBrand = brand =>
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));

  const toggleColor = color =>
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));

  const toggleSize = size =>
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));

  return {
    query, setQuery,
    filters, updateFilter, toggleBrand, toggleColor, toggleSize, clearFilters,
    sortBy, setSortBy,
    filteredProducts, availableBrands, availableColors, availableSizes,
    cleanQuery: parseNaturalLanguageQuery(query).cleanQuery,
  };
}
