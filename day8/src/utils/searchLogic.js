export function parseNaturalLanguageQuery(rawQuery) {
  let query = rawQuery.toLowerCase().trim();
  const result = {
    cleanQuery: query,
    priceMax: null,
    priceMin: null,
    ratingMin: null,
    discountMin: null,
    sortCommand: null,
  };

  if (!query) return result;

  // 1. Price conditions
  // "under 20000", "below 3000", "< 500"
  const underPriceMatch = query.match(/(?:under|below|<)\s*(?:₹|rs\.?)?\s*(\d+)/i);
  if (underPriceMatch) {
    result.priceMax = parseInt(underPriceMatch[1], 10);
    query = query.replace(underPriceMatch[0], "");
  }

  // "above 5000", "> 5000"
  const abovePriceMatch = query.match(/(?:above|>)\s*(?:₹|rs\.?)?\s*(\d+)/i);
  // Avoid matching "above 4 stars" here by ensuring we are talking about price or large numbers.
  if (abovePriceMatch && parseInt(abovePriceMatch[1], 10) > 5) {
    result.priceMin = parseInt(abovePriceMatch[1], 10);
    query = query.replace(abovePriceMatch[0], "");
  }

  // 2. Rating conditions
  // "above 4 stars", "rating > 4", "4.5 rating"
  const ratingMatch = query.match(/(?:above|>) (\d+(?:\.\d+)?)(?:\s*stars?|\s*rating)?|(\d+(?:\.\d+)?)\s*(?:stars?|rating)/i);
  if (ratingMatch) {
    result.ratingMin = parseFloat(ratingMatch[1] || ratingMatch[2]);
    query = query.replace(ratingMatch[0], "");
  }

  // 3. Discount conditions
  // "discount above 30%", "> 20% discount"
  const discountMatch = query.match(/(?:discount\s*(?:above|>)?|>\s*)\s*(\d+)\s*%/i);
  if (discountMatch) {
    result.discountMin = parseInt(discountMatch[1], 10);
    query = query.replace(discountMatch[0], "");
  }

  // 4. Sort commands
  if (query.includes("price low to high") || query.includes("cheapest")) {
    result.sortCommand = "price-low";
    query = query.replace(/price low to high|cheapest/g, "");
  } else if (query.includes("price high to low") || query.includes("most expensive")) {
    result.sortCommand = "price-high";
    query = query.replace(/price high to low|most expensive/g, "");
  } else if (query.includes("highest rated") || query.includes("best rating")) {
    result.sortCommand = "rating";
    query = query.replace(/highest rated|best rating/g, "");
  } else if (query.includes("new arrivals") || query.includes("newest")) {
    result.sortCommand = "newest";
    query = query.replace(/new arrivals|newest/g, "");
  } else if (query.includes("best selling") || query.includes("popular")) {
    result.sortCommand = "best-selling";
    query = query.replace(/best selling|popular/g, "");
  }

  result.cleanQuery = query.replace(/\s+/g, " ").trim();
  return result;
}
