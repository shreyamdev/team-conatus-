import React from 'react';
import { Newspaper, SearchX, RotateCcw } from 'lucide-react';


export default function EmptyState({
  query = '',
  category = '',
  onReset
}) {
  return (
    <div className="my-12 max-w-xl mx-auto text-center px-4 py-12 border-2 border-dashed border-stone-300 dark:border-zinc-800 rounded-2xl bg-white/40 dark:bg-zinc-900/40">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-400 dark:text-zinc-500">
        {query ? <SearchX className="w-8 h-8" /> : <Newspaper className="w-8 h-8" />}
      </div>

      <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-white mb-2">
        {query ? 'No Matching Stories Found' : 'No Dispatches Available'}
      </h3>

      <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
        {query ? (
          <>
            Our archives returned zero articles for <span className="font-semibold italic text-stone-900 dark:text-white">"{query}"</span>. Try checking spelling, using broader terms, or clearing your query.
          </>
        ) : category ? (
          <>
            No dispatches are currently available for the <span className="capitalize font-semibold">{category}</span> section. Please check back shortly.
          </>
        ) : (
          'There are currently no articles matching your filter parameters.'
        )}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-700 text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-white transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Search & Filters</span>
        </button>
      )}
    </div>
  );
}
