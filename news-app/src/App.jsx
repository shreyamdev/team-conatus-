import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ArticleDetail from './pages/ArticleDetail';
import BookmarksPage from './pages/BookmarksPage';
import NotFound from './pages/NotFound';

/**
 * Helper component that resets window scroll on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-paper-50 dark:bg-ink-950 text-ink-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <ScrollToTop />
      {/* Sticky Header with Ticker and Branding */}
      <Header />

      {/* Editorial Category Navigation */}
      <CategoryNav />

      {/* Main Routed Page Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/article/:articleId" element={<ArticleDetail />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Broadsheet Editorial Footer */}
      <Footer />
    </div>
  );
}
