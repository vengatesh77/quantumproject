/**
 * productApi.js – NexaStore API Service
 *
 * Fetches real products from DummyJSON + FakeStore strictly.
 * Normalizes them into the NexaStore schema, removes duplicates based
 * on product name, brand, and image URL.
 */

const DUMMYJSON = 'https://dummyjson.com';
const FAKESTORE = 'https://fakestoreapi.com';
const USD_INR = 83; // conversion rate
const CACHE_KEY = 'nxs_products_api_direct_v2';
const CACHE_TTL = 30 * 60 * 1000; // 30 min

const COLORS = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Silver', 'Gold', 'Grey', 'Pink', 'Purple', 'Orange'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', 'Free Size'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function badge(disc, rating) {
  if (disc >= 20) return { badge: 'sale', badgeLabel: 'SALE' };
  if (rating >= 4.7) return { badge: 'hot', badgeLabel: 'HOT' };
  return { badge: '', badgeLabel: '' };
}

// ─── Normalisers ────────────────────────────────────────────────────────────

function normDummy(p) {
  const priceINR = Math.round(p.price * USD_INR);
  const disc = p.discountPercentage || 0;
  const origINR = disc > 0 ? Math.round(priceINR / (1 - disc / 100)) : priceINR;
  const rating = p.rating || 4.0;
  const { badge: b, badgeLabel: bl } = badge(disc, rating);
  const brand = p.brand || p.title.split(' ')[0];

  return {
    id: `dj-${p.id}`,
    name: p.title,
    brand: brand,
    price: priceINR,
    originalPrice: origINR,
    rating: parseFloat(rating),
    reviews: p.reviews ? p.reviews.length * 15 : Math.floor(Math.random() * 500) + 10,
    badge: b,
    badgeLabel: bl,
    inStock: (p.stock ?? 1) > 0,
    description: p.description,
    image: p.thumbnail,
    allImages: p.images || [p.thumbnail],
    category: p.category,
    categoryLabel: p.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    color: getRandomItem(COLORS),
    size: getRandomItem(SIZES),
    deliveryTime: `${Math.floor(Math.random() * 5) + 2} days`,
    features: p.tags || [brand, p.categoryLabel || p.category],
  };
}

function normFake(p) {
  const priceINR = Math.round(p.price * USD_INR);
  const ratingObj = typeof p.rating === 'object' ? p.rating : { rate: p.rating || 4.0, count: 50 };
  const disc = Math.floor(Math.random() * 30);
  const origINR = disc > 0 ? Math.round(priceINR / (1 - disc / 100)) : priceINR;
  const { badge: b, badgeLabel: bl } = badge(disc, ratingObj.rate);
  const brand = p.title.includes(' - ') ? p.title.split(' - ')[0].trim() : p.title.split(' ')[0];
  const catLabel = p.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    id: `fs-${p.id}`,
    name: p.title,
    brand: brand,
    price: priceINR,
    originalPrice: origINR,
    rating: parseFloat(ratingObj.rate),
    reviews: ratingObj.count,
    badge: b,
    badgeLabel: bl,
    inStock: true,
    description: p.description,
    image: p.image,
    allImages: [p.image],
    category: p.category,
    categoryLabel: catLabel,
    color: getRandomItem(COLORS),
    size: getRandomItem(SIZES),
    deliveryTime: `${Math.floor(Math.random() * 5) + 2} days`,
    features: [brand, catLabel],
  };
}

// ─── Fetchers ───────────────────────────────────────────────────────────────

async function fetchDummyJSON() {
  try {
    const [r1, r2] = await Promise.all([
      fetch(`${DUMMYJSON}/products?limit=100&skip=0`).then(r => r.json()),
      fetch(`${DUMMYJSON}/products?limit=100&skip=100`).then(r => r.json()),
    ]);
    return [...(r1.products || []), ...(r2.products || [])].map(normDummy);
  } catch (e) {
    console.error("DummyJSON fetch error", e);
    return [];
  }
}

async function fetchFakeStore() {
  try {
    const data = await fetch(`${FAKESTORE}/products`).then(r => r.json());
    return (Array.isArray(data) ? data : []).map(normFake);
  } catch (e) {
    console.error("FakeStore fetch error", e);
    return [];
  }
}

// ─── Main export ────────────────────────────────────────────────────────────

export async function loadAllProducts() {
  // ① Return from cache if still fresh
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL && data?.length > 50) return data;
    }
  } catch (_) {}

  // ② Fetch all sources in parallel
  const [dj, fs] = await Promise.all([
    fetchDummyJSON(),
    fetchFakeStore(),
  ]);

  const allProducts = [...dj, ...fs];

  // ③ Strictly deduplicate based on Product Name, Brand, Image URL
  const uniqueProducts = [];
  const seenNames = new Set();
  const seenImages = new Set();
  const seenBrandsForName = new Map();

  for (const product of allProducts) {
    const nameKey = product.name.toLowerCase().trim();
    const imageKey = product.image;
    const brandKey = product.brand.toLowerCase().trim();

    // Condition 1: Same Image URL
    if (seenImages.has(imageKey)) continue;
    
    // Condition 2: Same Name AND Brand
    if (seenNames.has(nameKey) && seenBrandsForName.get(nameKey) === brandKey) {
      continue;
    }

    seenNames.add(nameKey);
    seenImages.add(imageKey);
    seenBrandsForName.set(nameKey, brandKey);
    uniqueProducts.push(product);
  }

  // ④ Cache
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: uniqueProducts }));
  } catch (_) {}

  return uniqueProducts;
}

/** Derive categories list from loaded products */
export function buildCategories(products) {
  const map = new Map();
  map.set('all', { id: 'all', label: 'All Categories', icon: '🏪' });
  
  products.forEach(p => {
    if (!map.has(p.category)) {
      // Determine a rough icon based on text
      let icon = '🛍️';
      const catLow = p.category.toLowerCase();
      if (catLow.includes('phone') || catLow.includes('tablet')) icon = '📱';
      else if (catLow.includes('laptop') || catLow.includes('computer')) icon = '💻';
      else if (catLow.includes('cloth') || catLow.includes('shirt') || catLow.includes('dress')) icon = '👔';
      else if (catLow.includes('shoe')) icon = '👟';
      else if (catLow.includes('watch')) icon = '⌚';
      else if (catLow.includes('jewel')) icon = '💍';
      else if (catLow.includes('beauty') || catLow.includes('fragrance') || catLow.includes('skin')) icon = '✨';
      else if (catLow.includes('furniture') || catLow.includes('home')) icon = '🏠';
      else if (catLow.includes('grocery')) icon = '🛒';
      else if (catLow.includes('sport') || catLow.includes('vehicle') || catLow.includes('motor')) icon = '⚽';

      map.set(p.category, { id: p.category, label: p.categoryLabel, icon });
    }
  });

  return Array.from(map.values());
}

/** Clear cache (for debugging / forced refresh) */
export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}
