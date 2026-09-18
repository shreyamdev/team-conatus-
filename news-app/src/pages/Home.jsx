import React, { useEffect, useCallback } from 'react';
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

export default function Home() {
  const dispatch = useDispatch();
  const articles = useSelector(selectAllArticles);
  const status = useSelector(selectNewsStatus);
  const moreStatus = useSelector(selectNewsMoreStatus);
  const error = useSelector(selectNewsError);
  const errorCode = useSelector(selectNewsErrorCode);
  const nextPage = useSelector(selectNextPage);
  const searchQuery = useSelector(selectSearchQuery);

  
  useEffect(() => {
    dispatch(fetchNews({ category: 'top', q: searchQuery }));
  }, [dispatch]);

  
  const handleSearch = useCallback(
    (query) => {
      dispatch(setSearchQuery(query));
      dispatch(fetchNews({ category: 'top', q: query }));
    },
    [dispatch]
  );

 
  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchNews({ category: 'top', q: searchQuery }));
  }, [dispatch, searchQuery]);

  
  const handleLoadMore = useCallback(() => {
    dispatch(fetchMoreNews());
  }, [dispatch]);

  const handleResetSearch = useCallback(() => {
    dispatch(setSearchQuery(''));
    dispatch(fetchNews({ category: 'top', q: '' }));
  }, [dispatch]);

  const isLoading = status === 'loading';
  const isError = status === 'failed';
  const isSuccess = status === 'succeeded';
  const isEmpty = isSuccess && articles.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Section Header */}
      <div className="mb-6 pb-4 border-b border-stone-300 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-editorial-red">
            Front Page Dispatches
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-ink-950 dark:text-white mt-1">
            Top Global Stories
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 font-serif italic">
            Continuous real-time feeds vetted by international bureaus
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96">
          <SearchBar
            initialQuery={searchQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder="Search all top stories..."
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
          category="top stories"
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
