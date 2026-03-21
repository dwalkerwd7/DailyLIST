import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Theme } from '../App';

export default function Header() {
  const [titleHovered, setTitleHovered] = useState(false);
  const [titleHasHovered, setTitleHasHovered] = useState(false); // needed to prevent animation on first render
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? 'dark' : 'light') as Theme;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleThemeToggle = () => {
    let newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <header className="border-b border-primary-border bg-primary-bg">
      <nav className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-3xl font-black text-primary-text"
            onMouseEnter={() => { setTitleHovered(true); setTitleHasHovered(true); }}
            onMouseLeave={() => setTitleHovered(false)}
          >
            Daily
            <span
              className={!titleHasHovered ? '' : (titleHovered ? 'spacing-ease-in' : 'spacing-ease-out')}
            >
              LIST
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="uppercase text-primary-text cursor-pointer bg-secondary-bg p-4 rounded-2xl" onClick={handleThemeToggle}>
              <span className="mr-3">{`${theme} mode`}</span>
              <input type="checkbox" id="theme-toggle" checked={theme === 'dark'} readOnly />
            </div>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-text"
            >
              About
            </Link>
            <Link
              to="/feedback"
              className="text-gray-700 hover:text-primary-text"
            >
              Feedback
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
