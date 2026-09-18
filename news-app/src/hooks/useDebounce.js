import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * Conserves NewsData.io API quota by waiting until typing pauses.
 *
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (defaults to 500ms)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
