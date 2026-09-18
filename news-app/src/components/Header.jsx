import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sun, Moon, Bookmark, Newspaper, TrendingUp, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { selectBookmarksCount } from '../redux/slices/bookmarksSlice';
import { selectAllArticles } from '../redux/slices/newsSlice';
import { getTodayHeaderDate } from '../utils/formatDate';
import { getArticleId } from '../utils/articleId';

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const bookmarksCount = useSelector(selectBookmarksCount);
  const articles = useSelector(selectAllArticles);
  const navigate = useNavigate();

  const tickerItems = articles.slice(0, 8);
  const todayDate = getTodayHeaderDate();

  return (
    <header className="border-b border-stone-300 dark:border-zinc-800 bg-paper-50 dark:bg-ink-950 transition-colors duration-200 sticky top-0 z-40">
      {/* Top Meta Bar: Date, Edition, Bookmark & Theme */}
      <div className="border-b border-stone-200 dark:border-zinc-800/80 text-xs text-stone-600 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          {/* Left: Live Today Date & Edition */}
          <div className="flex items-center space-x-4">
            <span className="font-medium tracking-wide uppercase">{todayDate}</span>
            <span className="hidden md:inline text-stone-400 dark:text-zinc-600">•</span>
            <span className="hidden md:inline italic font-serif text-stone-500 dark:text-zinc-400">
              International Edition No. 42,918
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Bookmarks Link */}
            <Link
              to="/bookmarks"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded border border-stone-300 dark:border-zinc-700 hover:bg-stone-200/50 dark:hover:bg-zinc-800 transition-colors text-stone-800 dark:text-zinc-200 font-medium"
              title="View Bookmarked Articles"
            >
              <Bookmark className="w-3.5 h-3.5 text-editorial-red" />
              <span>Saved</span>
              {bookmarksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-editorial-red text-white rounded-full">
                  {bookmarksCount}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border border-stone-300 dark:border-zinc-700 hover:bg-stone-200/50 dark:hover:bg-zinc-800 transition-colors text-stone-700 dark:text-zinc-300"
              aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700 hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Masthead / Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-editorial-red mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 inline" /> Real-Time Global Journalism <Sparkles className="w-3 h-3 inline" />
          </p>

          <Link to="/" className="group inline-block">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink-950 dark:text-white hover:opacity-90 transition-opacity">
              THE GLOBAL CHRONICLE
            </h1>
          </Link>

          <div className="mt-2 flex items-center justify-center space-x-3 text-xs text-stone-500 dark:text-zinc-400">
            <span className="h-[1px] w-12 sm:w-24 bg-stone-300 dark:bg-zinc-700"></span>
            <span className="italic font-serif">"Veritas Vos Liberabit — Truth in Every Story"</span>
            <span className="h-[1px] w-12 sm:w-24 bg-stone-300 dark:bg-zinc-700"></span>
          </div>
        </div>
      </div>

      {/* Live Breaking News Ticker */}
      <div className="border-t border-b border-stone-200 dark:border-zinc-800 bg-stone-100/70 dark:bg-zinc-900/60 overflow-hidden py-1.5 flex items-center text-xs">
        <div className="shrink-0 px-4 bg-editorial-red text-white font-bold py-0.5 ml-2 rounded uppercase text-[10px] tracking-wider flex items-center gap-1">
          <TrendingUp className="w-3 h-3 animate-pulse" />
          <span>Breaking</span>
        </div>

        <div className="overflow-hidden relative w-full ml-3">
          {tickerItems.length > 0 ? (
            <div className="animate-marquee inline-flex space-x-8 items-center cursor-pointer">
              {tickerItems.concat(tickerItems).map((article, idx) => {
                const articleId = getArticleId(article);
                return (
                  <button
                    key={`${articleId}-${idx}`}
                    onClick={() => navigate(`/article/${articleId}`, { state: { article } })}
                    className="inline-flex items-center space-x-2 text-stone-700 dark:text-zinc-300 hover:text-editorial-red dark:hover:text-red-400 transition-colors whitespace-nowrap text-xs"
                  >
                    <span className="font-semibold text-stone-900 dark:text-zinc-100">
                      [{article.source_name || article.source_id || 'News'}]
                    </span>
                    <span>{article.title}</span>
                    <span className="text-stone-400 dark:text-zinc-600 font-bold">•</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <span className="text-stone-500 dark:text-zinc-400 italic px-2">
              Streaming real-time international dispatches via NewsData.io...
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
