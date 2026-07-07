export function highlightText(text, highlight) {
  if (!highlight.trim()) return text;
  
  // Split on highlight term and include term in parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return parts.map((part, i) => 
    part.toLowerCase() === highlight.toLowerCase() ? (
      <mark key={i} className="highlighted-text">{part}</mark>
    ) : (
      part
    )
  );
}
