import React from 'react';
import { Loader2, ArrowDownCircle } from 'lucide-react';
import NewsItem from './NewsItem';
import { NewsItemSkeleton } from './NewsItemSkeleton';
import { getArticleId } from '../utils/articleId';


export default function NewsList({
  articles = [],
  isLoadingMore = false,
  hasNextPage = false,
  onLoadMore,
  showFeatured = true
}) {
  if (!articles || articles.length === 0) {
    return null;
  }

  const [firstArticle, ...remainingArticles] = articles;
  const renderFeatured = showFeatured && Boolean(firstArticle);

  return (
    <div className="w-full">
      {/* Featured Lead Headline Article (Broadsheet Main Story) */}
      {renderFeatured && (
        <NewsItem
          key={`featured-${getArticleId(firstArticle)}`}
          article={firstArticle}
          isFeatured={true}
        />
      )}

      {/* Responsive Grid for remaining articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {(renderFeatured ? remainingArticles : articles).map((article, index) => (
          <NewsItem
            key={`${getArticleId(article)}-${index}`}
            article={article}
            isFeatured={false}
          />
        ))}
      </div>

      {/* Pagination / Load More Controls */}
      {hasNextPage && (
        <div className="mt-12 text-center pb-8">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full border-2 border-stone-800 dark:border-zinc-300 text-ink-950 dark:text-white hover:bg-ink-950 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-ink-950 font-serif font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-editorial-red" />
                <span>Loading Dispatches...</span>
              </>
            ) : (
              <>
                <ArrowDownCircle className="w-4 h-4" />
                <span>Load More Stories</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-stone-500 dark:text-zinc-500 mt-2">
            Fetches next page token from NewsData.io
          </p>
        </div>
      )}

      {/* Shimmer loading when fetching extra items */}
      {isLoadingMore && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsItemSkeleton />
          <NewsItemSkeleton />
          <NewsItemSkeleton />
        </div>
      )}
    </div>
  );
}
