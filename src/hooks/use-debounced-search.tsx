
import { useState, useEffect, useMemo } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedSearch = <T>(
  items: T[],
  searchTerm: string,
  searchFunction: (item: T, term: string) => boolean,
  delay: number = 300
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return items;
    return items.filter(item => searchFunction(item, debouncedSearchTerm));
  }, [items, debouncedSearchTerm, searchFunction]);

  return {
    filteredItems,
    isSearching: searchTerm !== debouncedSearchTerm,
    searchTerm: debouncedSearchTerm
  };
};
