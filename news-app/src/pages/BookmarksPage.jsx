import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowLeft, Search } from 'lucide-react';
import { 
  selectAllBookmarks, 
  clearAllBookmarks, 
  selectBookmarksCount 
} from '../redux/slices/bookmarksSlice';
import NewsItem from '../components/NewsItem';
import { getArticleId } from '../utils/articleId';

export default function BookmarksPage() {
  const dispatch = useDispatch();
  const bookmarks = useSelector(selectAllBookmarks);
  const totalCount = useSelector(selectBookmarksCount);
  const [filterQuery, setFilterQuery] = useState('');

  
  const filteredBookmarks = useMemo(() => {
    if (!filterQuery.trim()) return bookmarks;
    const q = filterQuery.toLowerCase();
    return bookmarks.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.source_name?.toLowerCase().includes(q)
    );
  }, [bookmarks, filterQuery]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your saved articles?')) {
      dispatch(clearAllBookmarks());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
      {/* Page Header */}
      <div className="pb-6 border-b border-stone-300 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-editorial-red text-xs font-bold uppercase tracking-widest mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Personal Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-ink-950 dark:text-white">
            Saved Articles ({totalCount})
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 font-serif italic mt-1">
            Articles persisted locally on your device for offline reading
          </p>
        </div>

        {/* Search & Clear actions */}
        {totalCount > 0 && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter saved stories..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-ink-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-editorial-red"
              />
            </div>

            <button
              onClick={handleClearAll}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium transition-colors"
              title="Clear all saved articles"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Bookmarks Grid or Empty State */}
      {totalCount === 0 ? (
        <div className="my-16 max-w-md mx-auto text-center py-12 px-6 border-2 border-dashed border-stone-300 dark:border-zinc-800 rounded-2xl bg-white/40 dark:bg-zinc-900/40">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-400 dark:text-zinc-500">
            <Bookmark className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-white mb-2">
            No Saved Articles Yet
          </h3>
          <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed mb-6">
            Bookmark interesting stories from the front page or category sections to build your personalized reading list.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-editorial-red hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Discover Top Stories</span>
          </Link>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="my-12 text-center py-8">
          <p className="text-sm text-stone-500 dark:text-zinc-400">
            No saved articles match "{filterQuery}".
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBookmarks.map((article, index) => (
            <NewsItem
              key={`${getArticleId(article)}-${index}`}
              article={article}
              isFeatured={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
