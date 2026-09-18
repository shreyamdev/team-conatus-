import React, { useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNews,
  fetchMoreNews,
  selectAllArticles,
  selectNewsStatus,
  selectNewsMoreStatus,
  selectNewsError,
  selectNewsErrorCode,
  selectNextPage,
  selectSearchQuery,
  setSearchQuery,
  clearError
} from '../redux/slices/newsSlice';
import SearchBar from '../components/SearchBar';
import NewsList from '../components/NewsList';
import NewsListSkeleton from '../components/NewsItemSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const CATEGORY_META = {
  business: {
    title: 'Business & Financial Markets',
    subtitle: 'Global economic indicators, fiscal policies, and enterprise analysis',
    accent: 'text-emerald-700 dark:text-emerald-400'
  },
  technology: {
    title: 'Technology & Digital Innovation',
    subtitle: 'Artificial intelligence, semiconductors, software, and silicon frontiers',
    accent: 'text-indigo-700 dark:text-indigo-400'
  },
  entertainment: {
    title: 'Arts & Entertainment',
    subtitle: 'Cinema, literature, culture, performing arts, and global media',
    accent: 'text-purple-700 dark:text-purple-400'
  },
  sports: {
    title: 'International Sports',
    subtitle: 'Championships, athletic profiles, tactical reporting, and match outcomes',
    accent: 'text-blue-700 dark:text-blue-400'
  },
  health: {
    title: 'Health & Medical Science',
    subtitle: 'Clinical breakthroughs, public wellness, and epidemiological research',
    accent: 'text-rose-700 dark:text-rose-400'
  },
  science: {
    title: 'Science & Planetary Discoveries',
    subtitle: 'Space exploration, quantum mechanics, ecological research, and genetics',
    accent: 'text-amber-700 dark:text-amber-400'
  },
  top: {
    title: 'Top World Dispatches',
    subtitle: 'Leading geopolitical coverage and critical developments',
    accent: 'text-editorial-red dark:text-red-400'
  }
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const articles = useSelector(selectAllArticles);
  const status = useSelector(selectNewsStatus);
  const moreStatus = useSelector(selectNewsMoreStatus);
  const error = useSelector(selectNewsError);
  const errorCode = useSelector(selectNewsErrorCode);
  const nextPage = useSelector(selectNextPage);
  const searchQuery = useSelector(selectSearchQuery);

  const cleanCategory = useMemo(() => (categoryId || 'top').toLowerCase(), [categoryId]);

  const meta = useMemo(
    () =>
      CATEGORY_META[cleanCategory] || {
        title: `${cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1)} Dispatches`,
        subtitle: 'Real-time coverage curated by our international desk',
        accent: 'text-editorial-red'
      },
    [cleanCategory]
  );

  
  useEffect(() => {
    dispatch(setSearchQuery(''));
    dispatch(fetchNews({ category: cleanCategory, q: '' }));
  }, [dispatch, cleanCategory]);

  const handleSearch = useCallback(
    (query) => {
      dispatch(setSearchQuery(query));
      dispatch(fetchNews({ category: cleanCategory, q: query }));
    },
    [dispatch, cleanCategory]
  );

  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchNews({ category: cleanCategory, q: searchQuery }));
  }, [dispatch, cleanCategory, searchQuery]);

  const handleLoadMore = useCallback(() => {
    dispatch(fetchMoreNews());
  }, [dispatch]);

  const handleResetSearch = useCallback(() => {
    dispatch(setSearchQuery(''));
    dispatch(fetchNews({ category: cleanCategory, q: '' }));
  }, [dispatch, cleanCategory]);

  const isLoading = status === 'loading';
  const isError = status === 'failed';
  const isSuccess = status === 'succeeded';
  const isEmpty = isSuccess && articles.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Category Masthead Banner */}
      <div className="mb-6 pb-4 border-b border-stone-300 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className={`text-[11px] font-bold uppercase tracking-widest ${meta.accent}`}>
            Section Desk • {cleanCategory.toUpperCase()}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-ink-950 dark:text-white mt-1">
            {meta.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 font-serif italic">
            {meta.subtitle}
          </p>
        </div>

        {/* Category Search */}
        <div className="w-full md:w-96">
          <SearchBar
            initialQuery={searchQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder={`Search ${cleanCategory} news...`}
          />
        </div>
      </div>

      {/* Main Content Areas */}
      {isLoading && <NewsListSkeleton count={6} showFeatured={true} />}

      {isError && (
        <ErrorMessage
          error={error}
          errorCode={errorCode}
          onRetry={handleRetry}
          isRetrying={isLoading}
        />
      )}

      {isEmpty && (
        <EmptyState
          query={searchQuery}
          category={cleanCategory}
          onReset={handleResetSearch}
        />
      )}

      {!isLoading && !isError && articles.length > 0 && (
        <NewsList
          articles={articles}
          isLoadingMore={moreStatus === 'loading'}
          hasNextPage={Boolean(nextPage)}
          onLoadMore={handleLoadMore}
          showFeatured={!searchQuery}
        />
      )}
    </div>
  );
}
