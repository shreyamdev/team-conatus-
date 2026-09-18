import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Globe, 
  Briefcase, 
  Cpu, 
  Film, 
  Trophy, 
  HeartPulse, 
  Atom, 
  Compass
} from 'lucide-react';

const CATEGORIES = [
  { id: 'top', label: 'Top Stories', path: '/', icon: Globe },
  { id: 'business', label: 'Business & Markets', path: '/category/business', icon: Briefcase },
  { id: 'technology', label: 'Technology', path: '/category/technology', icon: Cpu },
  { id: 'entertainment', label: 'Entertainment & Arts', path: '/category/entertainment', icon: Film },
  { id: 'sports', label: 'Sports', path: '/category/sports', icon: Trophy },
  { id: 'health', label: 'Health & Wellness', path: '/category/health', icon: HeartPulse },
  { id: 'science', label: 'Science & Cosmos', path: '/category/science', icon: Atom },
];

export default function CategoryNav() {
  return (
    <nav className="bg-paper-100 dark:bg-zinc-900 border-b border-stone-300 dark:border-zinc-800 sticky top-[138px] sm:top-[154px] z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <NavLink
                key={cat.id}
                to={cat.path}
                end={cat.path === '/'}
                className={({ isActive }) => `
                  inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all duration-150
                  ${
                    isActive
                      ? 'bg-ink-900 text-white dark:bg-paper-50 dark:text-ink-950 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-zinc-400 hover:text-ink-950 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-zinc-800/80'
                  }
                `}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
