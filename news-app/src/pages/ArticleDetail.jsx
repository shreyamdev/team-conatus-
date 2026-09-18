import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Globe, 
  User, 
  Printer, 
  Check, 
  AlertCircle,
  Newspaper
} from 'lucide-react';
import { selectAllArticles } from '../redux/slices/newsSlice';
import { 
  toggleBookmark, 
  selectAllBookmarks, 
  selectIsArticleBookmarked 
} from '../redux/slices/bookmarksSlice';
import { matchesArticleId, getArticleId } from '../utils/articleId';
import { formatEditorialDate, estimateReadingTime } from '../utils/formatDate';

export default function ArticleDetail() {
  const { articleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const articleContentRef = useRef(null);

  
  const feedArticles = useSelector(selectAllArticles);
  const bookmarkedArticles = useSelector(selectAllBookmarks);

  
  const article = useMemo(() => {
   
    if (location.state?.article) {
      return location.state.article;
    }
   
    const fromFeed = feedArticles.find((item) => matchesArticleId(item, articleId));
    if (fromFeed) return fromFeed;

    
    const fromBookmarks = bookmarkedArticles.find((item) => matchesArticleId(item, articleId));
    if (fromBookmarks) return fromBookmarks;

    return null;
  }, [location.state, feedArticles, bookmarkedArticles, articleId]);

  const isBookmarked = useSelector((state) => selectIsArticleBookmarked(state, article));

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  
  useEffect(() => {
    const handleScroll = () => {
      const el = articleContentRef.current;
      if (!el) return;
      const totalHeight = el.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrollY / (totalHeight - windowHeight + 300)) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmarkToggle = useCallback(() => {
    if (article) {
      dispatch(toggleBookmark(article));
    }
  }, [dispatch, article]);

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const currentId = getArticleId(article);
    return feedArticles
      .filter((item) => getArticleId(item) !== currentId)
      .slice(0, 3);
  }, [feedArticles, article]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-400">
          <AlertCircle className="w-8 h-8 text-stone-500" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-ink-950 dark:text-white mb-2">
          Dispatch Unavailable in Memory
        </h2>
        <p className="text-stone-600 dark:text-zinc-400 text-sm max-w-md mx-auto mb-8">
          The requested dispatch may have rotated off the live feed or requires re-fetching from the front page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-editorial-red hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </button>
      </div>
    );
  }

  const category = Array.isArray(article.category) ? article.category[0] : (article.category || 'General');
  const creator = Array.isArray(article.creator) ? article.creator.join(', ') : (article.creator || 'Staff Correspondent');
  const readTime = estimateReadingTime(article.content || article.description || article.title);
  const formattedDate = formatEditorialDate(article.pubDate);
  const hasValidImage = Boolean(article.image_url) && !imgError;

  return (
    <article ref={articleContentRef} className="min-h-screen pb-20">
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-editorial-red z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Article Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400 mb-6 pb-3 border-b border-stone-200 dark:border-zinc-800">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 hover:text-editorial-red transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dispatches</span>
          </button>

          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to={`/category/${category.toLowerCase()}`} className="capitalize hover:underline">
              {category}
            </Link>
          </div>
        </div>

        {/* Category Pill */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded bg-stone-100 dark:bg-zinc-800 text-editorial-red dark:text-red-400 font-bold uppercase tracking-widest text-[11px]">
            {category}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] text-ink-950 dark:text-white tracking-tight mb-4">
          {article.title}
        </h1>

        {/* Subhead / Excerpt */}
        {article.description && (
          <p className="font-serif italic text-lg sm:text-xl text-stone-600 dark:text-zinc-300 leading-relaxed mb-6 border-l-2 border-editorial-red pl-4">
            {article.description}
          </p>
        )}

        {/* Editorial Byline & Metadata */}
        <div className="py-4 border-y border-stone-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-600 dark:text-zinc-400 mb-8">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-bold text-ink-950 dark:text-zinc-100">By {creator}</span>
              <span>•</span>
              <span className="font-medium text-stone-700 dark:text-zinc-300">
                {article.source_name || article.source_id || 'International Bureau'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>{formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{readTime}</span>
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors text-stone-700 dark:text-zinc-300"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-full border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors text-stone-700 dark:text-zinc-300 hidden sm:inline-flex"
              title="Print article"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                isBookmarked
                  ? 'border-editorial-red bg-red-50 dark:bg-red-950/40 text-editorial-red dark:text-red-400 font-bold'
                  : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="text-xs">{isBookmarked ? 'Saved' : 'Save Story'}</span>
            </button>
          </div>
        </div>

        {/* High-Resolution Hero Image */}
        {hasValidImage ? (
          <div className="mb-8 rounded-xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-800 shadow-sm">
            <img
              src={article.image_url}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full max-h-[500px] object-cover"
            />
            <div className="p-2.5 bg-stone-100 dark:bg-zinc-900 border-t border-stone-200 dark:border-zinc-800 text-[11px] text-stone-500 dark:text-zinc-400 italic">
              Dispatch image provided by {article.source_name || 'syndicated agency'}.
            </div>
          </div>
        ) : (
          <div className="mb-8 p-12 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex flex-col items-center justify-center text-stone-400 dark:text-zinc-600">
            <Newspaper className="w-16 h-16 stroke-[1.2] mb-2 opacity-60" />
            <span className="text-xs uppercase font-serif tracking-widest text-stone-500 dark:text-zinc-400">
              The Global Chronicle • Broadsheet Archive
            </span>
          </div>
        )}

        {/* Article Full Body */}
        <div className="prose dark:prose-invert max-w-none text-stone-800 dark:text-zinc-200 text-base sm:text-lg leading-relaxed space-y-6">
          {article.content && article.content !== 'ONLY AVAILABLE IN PAID PLANS' ? (
            <div className="editorial-lead font-sans whitespace-pre-line">
              {article.content}
            </div>
          ) : article.description ? (
            <div className="editorial-lead font-sans whitespace-pre-line">
              {article.description}
            </div>
          ) : (
            <p className="italic text-stone-500">
              The editorial synopsis is being prepared for digital syndication.
            </p>
          )}
        </div>

        {/* Source Link & Attribution Notice */}
        <div className="mt-12 p-6 rounded-xl border border-stone-300 dark:border-zinc-800 bg-paper-100 dark:bg-zinc-900/60 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-ink-950 dark:text-white text-base">
                Read Complete Coverage at {article.source_name || 'Publisher'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 max-w-xl">
                This dispatch is aggregated via NewsData.io. Access full interactive multimedia, original commentary, and subscriber features on the publisher's official portal.
              </p>
            </div>

            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-ink-950 dark:bg-white text-white dark:text-ink-950 hover:bg-stone-800 dark:hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
              >
                <span>Visit Publisher</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Related Stories Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t-2 border-stone-200 dark:border-zinc-800">
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-white mb-6">
              More Stories from the Desk
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((item, idx) => {
                const relId = getArticleId(item);
                return (
                  <div
                    key={`${relId}-${idx}`}
                    onClick={() => navigate(`/article/${relId}`, { state: { article: item } })}
                    className="cursor-pointer group flex flex-col justify-between border-t border-stone-300 dark:border-zinc-700 pt-3"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-editorial-red">
                      {item.category?.[0] || 'World'}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-ink-900 dark:text-zinc-100 group-hover:text-editorial-red transition-colors line-clamp-2 mt-1">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-stone-500 dark:text-zinc-400 mt-2">
                      {item.source_name || 'Wire'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
