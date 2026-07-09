import { useState, useEffect, useCallback } from 'react';
import { loadAllProducts, buildCategories } from '../services/productApi';

/**
 * useProducts – Fetches, caches, and returns real API products.
 * Returns: { products, categories, loading, error, refresh }
 */
export default function useProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'All Products', icon: '🏪' }]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadAllProducts();
      setProducts(data);
      setCategories(buildCategories(data));
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, categories, loading, error, refresh: fetch };
}
