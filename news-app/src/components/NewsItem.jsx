import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bookmark, Clock, Newspaper, ExternalLink, Share2, Check } from 'lucide-react';
import { toggleBookmark, selectIsArticleBookmarked } from '../redux/slices/bookmarksSlice';
import { formatRelativeTime, estimateReadingTime } from '../utils/formatDate';
import { getArticleId } from '../utils/articleId';


export default function NewsItem({ article, isFeatured = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const articleId = useMemo(() => getArticleId(article), [article]);
  const isBookmarked = useSelector((state) => selectIsArticleBookmarked(state, article));

  const readTime = useMemo(
    () => estimateReadingTime(article.description || article.content || article.title),
    [article.description, article.content, article.title]
  );

  const relativeTime = useMemo(
    () => formatRelativeTime(article.pubDate),
    [article.pubDate]
  );

  const categoryLabel = useMemo(() => {
    if (Array.isArray(article.category) && article.category.length > 0) {
      return article.category[0];
    }
    return article.category || 'General';
  }, [article.category]);

  const handleBookmarkToggle = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(toggleBookmark(article));
    },
    [dispatch, article]
  );

  const handleCardClick = useCallback(() => {
    navigate(`/article/${articleId}`, { state: { article } });
  }, [navigate, articleId, article]);

  const handleShare = useCallback(
    (e) => {
      e.stopPropagation();
      const shareUrl = `${window.location.origin}/article/${articleId}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    [articleId]
  );

  const hasValidImage = Boolean(article.image_url) && !imgError;

  // Featured Lead Story Layout (NYT / The Hindu lead style)
  if (isFeatured) {
    return (
      <article
        onClick={handleCardClick}
        className="group relative cursor-pointer mb-8 sm:mb-10 rounded-xl overflow-hidden border border-stone-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-newspaper hover:shadow-elevated transition-all duration-300"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Text content */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between order-2 lg:order-1">
            <div>
              {/* Category & Source pill */}
              <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase mb-3">
                <span className="px-2.5 py-0.5 rounded bg-editorial-red/10 text-editorial-red dark:bg-red-950/50 dark:text-red-300">
                  {categoryLabel}
                </span>
                <span className="text-stone-400 dark:text-zinc-600">•</span>
                <span className="text-stone-700 dark:text-zinc-300 font-medium flex items-center gap-1.5">
                  {article.source_icon ? (
                    <img
                      src={article.source_icon}
                      alt=""
                      className="w-3.5 h-3.5 rounded-full object-cover inline"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  {article.source_name || article.source_id || 'Dispatch'}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-ink-950 dark:text-white group-hover:text-editorial-red dark:group-hover:text-red-400 transition-colors">
                {article.title}
              </h2>

              {/* Description */}
              {article.description && (
                <p className="mt-3.5 text-stone-600 dark:text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{relativeTime}</span>
                </span>
                <span>•</span>
                <span>{readTime}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked
                      ? 'bg-red-50 text-editorial-red dark:bg-red-950/50 dark:text-red-400'
                      : 'hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300'
                  }`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-current text-editorial-red' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Large Hero Image */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-auto min-h-[260px] bg-stone-100 dark:bg-zinc-800 overflow-hidden order-1 lg:order-2">
            {hasValidImage ? (
              <img
                src={article.image_url}
                alt={article.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400 dark:text-zinc-600 bg-stone-100 dark:bg-zinc-800/80">
                <Newspaper className="w-12 h-12 stroke-[1.5] mb-2 text-stone-400 dark:text-zinc-500" />
                <span className="text-xs uppercase tracking-widest font-serif font-bold text-stone-500 dark:text-zinc-400">
                  The Global Chronicle Dispatch
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </article>
    );
  }

  
  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col justify-between rounded-lg overflow-hidden border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full"
    >
      <div>
        {/* Card Thumbnail with fallback handling */}
        <div className="relative h-48 w-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
          {hasValidImage ? (
            <img
              src={article.image_url}
              alt={article.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400 dark:text-zinc-600 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-900 dark:to-zinc-800">
              <Newspaper className="w-10 h-10 stroke-[1.2] mb-1.5 opacity-70" />
              <span className="text-[10px] uppercase font-serif tracking-widest text-stone-500 dark:text-zinc-500">
                Chronicle Wire
              </span>
            </div>
          )}

          {/* Category Chip Overlay */}
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-zinc-950/90 text-stone-800 dark:text-zinc-200 backdrop-blur-sm shadow-sm">
            {categoryLabel}
          </span>
        </div>

        {/* Text Body */}
        <div className="p-4 sm:p-5">
          {/* Source and Relative Date */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400 mb-2">
            <span className="font-semibold text-stone-700 dark:text-zinc-300 truncate max-w-[65%] flex items-center gap-1.5">
              {article.source_icon && (
                <img
                  src={article.source_icon}
                  alt=""
                  className="w-3 h-3 rounded-full object-cover inline"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="truncate">{article.source_name || article.source_id || 'Wire'}</span>
            </span>
            <span className="flex items-center space-x-1 shrink-0 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{relativeTime}</span>
            </span>
          </div>

          {/* Headline */}
          <h3 className="font-serif text-lg font-bold leading-snug text-ink-950 dark:text-gray-100 group-hover:text-editorial-red dark:group-hover:text-red-400 transition-colors line-clamp-3">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.description && (
            <p className="mt-2 text-stone-600 dark:text-zinc-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {article.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Read time & Bookmark */}
      <div className="p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
          <span className="text-[11px] italic font-serif">{readTime}</span>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              title="Share story"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked
                  ? 'bg-red-50 text-editorial-red dark:bg-red-950/50 dark:text-red-400'
                  : 'hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-editorial-red' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
