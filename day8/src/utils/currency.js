// Indian Rupee formatter — en-IN locale
export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

// Discount % helper
export const discountPct = (original, current) =>
  Math.round(((original - current) / original) * 100);
