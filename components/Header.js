import { useContext } from 'react';
import Link from 'next/link';
import { ThemeContext } from '../contexts/ThemeContext';
import { BsMoon, BsSun } from 'react-icons/bs';

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header className="header">
      <div className="container h-full flex items-center justify-between">
        <div className="logo-container">
          <Link href="/" className="logo">
            Easy<span>Anime</span>
          </Link>
        </div>
        
        <div className="theme-toggle">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <BsSun className="text-xl" />
            ) : (
              <BsMoon className="text-xl" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}