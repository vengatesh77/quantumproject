/**
 * products.js
 *
 * Products are now loaded dynamically from real APIs via:
 *   src/services/productApi.js  →  src/hooks/useProducts.js
 *
 * This file is kept only to avoid breaking any legacy imports.
 * The static products.json file is no longer used at runtime.
 */
export const products = [];      // real data comes from API
export const categories = [];    // real categories derived from API in productApi.js
