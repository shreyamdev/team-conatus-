import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center text-stone-400">
        <FileQuestion className="w-8 h-8 text-editorial-red" />
      </div>

      <span className="text-[11px] font-bold uppercase tracking-widest text-editorial-red">
        Dispatch Not Found • 404
      </span>

      <h1 className="font-serif text-4xl sm:text-5xl font-black text-ink-950 dark:text-white mt-2 mb-4">
        Page Not in Archives
      </h1>

      <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed mb-8">
        The page, article, or section you are searching for does not exist or has been archived. Check the URL for typographical errors or return to our front page.
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-editorial-red hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </Link>
      </div>
    </div>
  );
}
