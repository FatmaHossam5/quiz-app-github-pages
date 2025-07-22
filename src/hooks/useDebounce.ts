import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
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

/**
 * Custom hook for debouncing callback functions
 * @param callback - The callback function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced callback function
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @param onSearch - Callback function to execute on search
 * @returns Object containing search value, debounced value, and handlers
 */
export const useDebouncedSearch = <T>(
  initialValue: string = '',
  delay: number = 300,
  onSearch?: (searchTerm: string) => Promise<T> | T
) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<T | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const debouncedSearchValue = useDebounce(searchValue, delay);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    if (value !== debouncedSearchValue) {
      setIsSearching(true);
    }
  }, [debouncedSearchValue]);

  const clearSearch = useCallback(() => {
    setSearchValue('');
    setSearchResults(null);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  // Execute search when debounced value changes
  useEffect(() => {
    if (!onSearch) {
      setIsSearching(false);
      return;
    }

    const executeSearch = async () => {
      if (!debouncedSearchValue.trim()) {
        setSearchResults(null);
        setSearchError(null);
        setIsSearching(false);
        return;
      }

      try {
        setSearchError(null);
        const results = await onSearch(debouncedSearchValue);
        setSearchResults(results);
      } catch (error) {
        setSearchError(error instanceof Error ? error.message : 'Search failed');
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    };

    executeSearch();
  }, [debouncedSearchValue, onSearch]);

  return {
    searchValue,
    debouncedSearchValue,
    isSearching,
    searchResults,
    searchError,
    handleSearchChange,
    clearSearch,
    setSearchValue,
  };
};

export default useDebounce; 
