import React from 'react';


export function NewsItemSkeleton({ isFeatured = false }) {
  if (isFeatured) {
    return (
      <div className="border border-stone-200 dark:border-zinc-800 rounded-lg p-6 bg-white/60 dark:bg-zinc-900/60 animate-pulse mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-20 bg-stone-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-24 bg-stone-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="h-8 w-11/12 bg-stone-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-8 w-3/4 bg-stone-200 dark:bg-zinc-800 rounded"></div>
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full bg-stone-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-5/6 bg-stone-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3.5 w-4/6 bg-stone-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </div>
          <div className="lg:col-span-5 h-64 sm:h-80 bg-stone-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white/70 dark:bg-zinc-900/70 animate-pulse">
      {/* Thumbnail shimmer */}
      <div className="w-full h-48 bg-stone-200 dark:bg-zinc-800 relative"></div>

      {/* Content shimmer */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Tag & Date */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 bg-stone-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-3 w-20 bg-stone-200 dark:bg-zinc-800 rounded"></div>
          </div>
          {/* Title lines */}
          <div className="h-5 w-full bg-stone-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-5 w-4/5 bg-stone-200 dark:bg-zinc-800 rounded"></div>
          {/* Excerpt */}
          <div className="h-3 w-full bg-stone-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-3 w-3/4 bg-stone-200 dark:bg-zinc-800 rounded"></div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="h-3 w-24 bg-stone-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-6 w-6 bg-stone-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}


export default function NewsListSkeleton({ count = 6, showFeatured = true }) {
  return (
    <div className="w-full">
      {showFeatured && <NewsItemSkeleton isFeatured={true} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <NewsItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
