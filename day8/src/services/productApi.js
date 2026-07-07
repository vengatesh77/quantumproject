/**
 * productApi.js – NexaStore API Service
 *
 * Fetches real products from DummyJSON + FakeStore, normalises both
 * into the same schema, converts USD → INR, caches in localStorage.
 */

const DUMMYJSON = 'https://dummyjson.com';
const FAKESTORE  = 'https://fakestoreapi.com';
const USD_INR    = 83;          // conversion rate
const CACHE_KEY  = 'nxs_products_v3';
const CACHE_TTL  = 15 * 60 * 1000; // 15 min

// ─── Category normalisation ─────────────────────────────────────────────────

const CAT_MAP = {
  smartphones:          { label: 'Mobiles',             icon: '📱' },
  'mobile-accessories': { label: 'Mobile Accessories',  icon: '📱' },
  tablets:              { label: 'Tablets',              icon: '📱' },
  laptops:              { label: 'Laptops',              icon: '💻' },
  'computers':          { label: 'Computers',            icon: '💻' },
  electronics:          { label: 'Electronics',          icon: '⚡' },
  'mens-shirts':        { label: "Men's Clothing",       icon: '👔' },
  "men's clothing":     { label: "Men's Clothing",       icon: '👔' },
  tops:                 { label: "Women's Clothing",     icon: '👗' },
  'womens-dresses':     { label: "Women's Clothing",     icon: '👗' },
  "women's clothing":   { label: "Women's Clothing",     icon: '👗' },
  'mens-shoes':         { label: 'Shoes',                icon: '👟' },
  'womens-shoes':       { label: 'Shoes',                icon: '👟' },
  'womens-bags':        { label: 'Bags',                 icon: '👜' },
  'womens-jewellery':   { label: 'Accessories',          icon: '💍' },
  jewelery:             { label: 'Accessories',          icon: '💍' },
  sunglasses:           { label: 'Accessories',          icon: '🕶️' },
  'mens-watches':       { label: 'Smart Watches',        icon: '⌚' },
  'womens-watches':     { label: 'Accessories',          icon: '⌚' },
  beauty:               { label: 'Beauty',               icon: '✨' },
  fragrances:           { label: 'Beauty',               icon: '🌸' },
  'skin-care':          { label: 'Skin Care',            icon: '🧴' },
  skincare:             { label: 'Skin Care',            icon: '🧴' },
  groceries:            { label: 'Grocery',              icon: '🛒' },
  'home-decoration':    { label: 'Home & Décor',         icon: '🏠' },
  furniture:            { label: 'Furniture',             icon: '🛋️' },
  'kitchen-accessories':{ label: 'Kitchen',              icon: '🍳' },
  'sports-accessories': { label: 'Sports',               icon: '⚽' },
  automotive:           { label: 'Automotive',           icon: '🚗' },
  motorcycle:           { label: 'Automotive',           icon: '🏍️' },
  lighting:             { label: 'Home & Décor',         icon: '💡' },
  vehicle:              { label: 'Automotive',           icon: '🚗' },
};

function catInfo(raw) {
  const key = (raw || '').toLowerCase().trim();
  if (CAT_MAP[key]) return { id: key, ...CAT_MAP[key] };
  const label = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { id: key, label, icon: '🛍️' };
}

// ─── Badge helper ───────────────────────────────────────────────────────────

function badge(disc, rating, id) {
  if (disc >= 20)    return { badge: 'sale', badgeLabel: 'SALE' };
  if (rating >= 4.7) return { badge: 'hot',  badgeLabel: 'HOT'  };
  if (id <= 15)      return { badge: 'new',  badgeLabel: 'NEW'  };
  return { badge: '', badgeLabel: '' };
}

// ─── Normalisers ────────────────────────────────────────────────────────────

function normDummy(p) {
  const cat        = catInfo(p.category);
  const priceINR   = Math.round(p.price * USD_INR);
  const disc       = p.discountPercentage || 0;
  const origINR    = disc > 0 ? Math.round(priceINR / (1 - disc / 100)) : priceINR;
  const reviewCount = (p.reviews?.length || 3) * Math.floor(200 + Math.random() * 1800);
  const { badge: b, badgeLabel: bl } = badge(disc, p.rating, p.id);

  return {
    id:            `dj-${p.id}`,
    name:          p.title,
    brand:         p.brand || p.title.split(' ')[0],
    category:      cat.id,
    categoryLabel: cat.label,
    categoryIcon:  cat.icon,
    price:         priceINR,
    originalPrice: origINR,
    rating:        p.rating,
    reviews:       reviewCount,
    badge:         b,
    badgeLabel:    bl,
    inStock:       (p.stock ?? 1) > 0,
    description:   p.description,
    features:      p.tags || [p.brand, p.category].filter(Boolean),
    image:         p.thumbnail,
    allImages:     p.images || [p.thumbnail],
    deliveryTime:  p.shippingInformation || `${Math.ceil(1 + Math.random() * 5)} days`,
  };
}

function normFake(p) {
  const cat      = catInfo(p.category);
  const priceINR = Math.round(p.price * USD_INR);
  const rating   = typeof p.rating === 'object' ? p.rating.rate  : p.rating;
  const ratingCt = typeof p.rating === 'object' ? p.rating.count : 50;
  const { badge: b, badgeLabel: bl } = badge(0, rating, p.id + 200);
  const brand = p.title.includes(' - ') ? p.title.split(' - ')[0].trim() : p.title.split(' ')[0];

  return {
    id:            `fs-${p.id}`,
    name:          p.title,
    brand,
    category:      cat.id,
    categoryLabel: cat.label,
    categoryIcon:  cat.icon,
    price:         priceINR,
    originalPrice: priceINR,
    rating,
    reviews:       ratingCt,
    badge:         b,
    badgeLabel:    bl,
    inStock:       true,
    description:   p.description,
    features:      [brand, cat.label],
    image:         p.image,
    allImages:     [p.image],
    deliveryTime:  `${Math.ceil(1 + Math.random() * 5)} days`,
  };
}

// ─── Fetchers ───────────────────────────────────────────────────────────────

async function fetchDummyJSON() {
  // Fetch both pages (DummyJSON has ~194 products)
  const [r1, r2] = await Promise.all([
    fetch(`${DUMMYJSON}/products?limit=100&skip=0&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags,reviews,shippingInformation`).then(r => r.json()),
    fetch(`${DUMMYJSON}/products?limit=100&skip=100&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags,reviews,shippingInformation`).then(r => r.json()),
  ]);
  return [...(r1.products || []), ...(r2.products || [])].map(normDummy);
}

async function fetchFakeStore() {
  const data = await fetch(`${FAKESTORE}/products`).then(r => r.json());
  return (Array.isArray(data) ? data : []).map(normFake);
}

// ─── Main export ────────────────────────────────────────────────────────────

export async function loadAllProducts() {
  // ① Return from cache if still fresh
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL && data?.length > 0) return data;
    }
  } catch (_) {}

  // ② Fetch both sources in parallel (tolerate individual failures)
  const [djResult, fsResult] = await Promise.allSettled([
    fetchDummyJSON(),
    fetchFakeStore(),
  ]);

  const all = [
    ...(djResult.status === 'fulfilled' ? djResult.value : []),
    ...(fsResult.status === 'fulfilled' ? fsResult.value : []),
  ];

  // ③ Deduplicate by lowercase name
  const seen = new Set();
  const unique = all.filter(p => {
    const key = p.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // ④ Cache
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: unique }));
  } catch (_) {}

  return unique;
}

/** Derive a sorted, deduplicated categories list from loaded products */
export function buildCategories(products) {
  const map = new Map();
  map.set('all', { id: 'all', label: 'All Products', icon: '🏪' });
  products.forEach(p => {
    if (!map.has(p.category)) {
      map.set(p.category, { id: p.category, label: p.categoryLabel, icon: p.categoryIcon || '🛍️' });
    }
  });
  return Array.from(map.values());
}

/** Clear cache (for debugging / forced refresh) */
export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}
