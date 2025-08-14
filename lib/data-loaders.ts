// Move commonItems to JSON for better caching
export const loadCommonItems = async () => {
  const response = await fetch('/data/common-items.json');
  return response.json();
};

// Alternative: Use dynamic imports for code splitting
export const getCommonItemsData = async () => {
  const { commonItems } = await import('@/data/common-items-data');
  return commonItems;
};
