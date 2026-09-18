import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';


export default function SearchBar({
  onSearch,
  initialQuery = '',
  placeholder = 'Search articles, topics, or breaking dispatches...',
  isLoading = false,
}) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef(null);
  const isFirstMount = useRef(true);

  
  const debouncedQuery = useDebounce(query, 600);

  
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (!debouncedQuery) return;
    }
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  
  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      onSearch(query.trim());
    },
    [query, onSearch]
  );

  
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto my-4 transition-all"
    >
      <div className="relative flex items-center shadow-sm rounded-lg overflow-hidden border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-editorial-red focus-within:border-transparent transition-all">
        {/* Search Icon or Loading Spinner */}
        <div className="pl-4 pr-2 text-stone-400 dark:text-zinc-500">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-editorial-red" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input element with ref */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 px-2 text-sm text-ink-950 dark:text-gray-100 placeholder-stone-400 dark:placeholder-zinc-500 bg-transparent focus:outline-none"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Instant Submit Button */}
        <button
          type="submit"
          className="px-4 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-white border-l border-stone-200 dark:border-zinc-700 transition-colors shrink-0"
        >
          Search
        </button>
      </div>

      <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-500 px-2">
        <span>Type to search (auto-debounced to conserve API calls)</span>
        {query && <span>Press [Enter] for instant query</span>}
      </div>
    </form>
  );
}
