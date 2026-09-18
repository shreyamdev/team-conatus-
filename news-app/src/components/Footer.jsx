import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Newspaper, Shield, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t-4 border-double border-stone-300 dark:border-zinc-800 bg-paper-100 dark:bg-zinc-950 text-stone-700 dark:text-zinc-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Masthead & Back to Top */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-8 border-b border-stone-200 dark:border-zinc-800 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
              THE GLOBAL CHRONICLE
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-500 font-serif italic mt-0.5">
              Independent Global Journalism • Published Daily in Digital Broadsheet
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 dark:border-zinc-700 text-xs font-medium hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors text-stone-700 dark:text-zinc-200"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section Navigation & Editorial Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-stone-200 dark:border-zinc-800 text-xs">
          {/* Section 1: News Categories */}
          <div>
            <h4 className="font-serif font-bold uppercase tracking-wider text-ink-950 dark:text-white mb-3">
              Editorial Sections
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Top Dispatches
                </Link>
              </li>
              <li>
                <Link to="/category/business" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Business & Markets
                </Link>
              </li>
              <li>
                <Link to="/category/technology" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Technology & AI
                </Link>
              </li>
              <li>
                <Link to="/category/entertainment" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Culture & Entertainment
                </Link>
              </li>
              <li>
                <Link to="/category/sports" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  World Sports
                </Link>
              </li>
              <li>
                <Link to="/category/science" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Science & Cosmos
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: Reader Services */}
          <div>
            <h4 className="font-serif font-bold uppercase tracking-wider text-ink-950 dark:text-white mb-3">
              Reader Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/bookmarks" className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Saved Articles
                </Link>
              </li>
              <li>
                <a href="#search" onClick={() => window.scrollTo({ top: 120, behavior: 'smooth' })} className="hover:text-editorial-red dark:hover:text-red-400 transition-colors">
                  Search Archives
                </a>
              </li>
              <li>
                <span className="text-stone-400 dark:text-zinc-600 cursor-not-allowed">
                  Today's Print Edition (PDF)
                </span>
              </li>
              <li>
                <span className="text-stone-400 dark:text-zinc-600 cursor-not-allowed">
                  Editorial Columnists
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Data & Disclaimers */}
          <div className="col-span-2">
            <h4 className="font-serif font-bold uppercase tracking-wider text-ink-950 dark:text-white mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-editorial-red" />
              <span>Real-Time News Wire</span>
            </h4>
            <p className="text-stone-600 dark:text-zinc-400 leading-relaxed mb-3">
              This application interfaces directly with the <a href="https://newsdata.io" target="_blank" rel="noreferrer" className="font-semibold underline hover:text-editorial-red text-ink-950 dark:text-white">NewsData.io API</a> to query live international headlines. All dispatches, copyrights, and intellectual property remain with their respective publishers.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-stone-500 dark:text-zinc-500">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Free tier quota: 200 API credits/day • Strict rate-limit compliance active</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Colophon */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-zinc-500 gap-2">
          <p>© {new Date().getFullYear()} The Global Chronicle. Built for high-reliability editorial journalism.</p>
          <div className="flex space-x-4">
            <span>React 18</span>
            <span>•</span>
            <span>Vite</span>
            <span>•</span>
            <span>Redux Toolkit</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
