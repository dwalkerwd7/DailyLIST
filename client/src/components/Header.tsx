import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Theme } from '../App';
import ToggleSwitch from './utils/ToggleSwitch';

export default function Header() {
  const [titleHovered, setTitleHovered] = useState(false);
  const [titleHasHovered, setTitleHasHovered] = useState(false); // needed to prevent animation on first render
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? true : false);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  }

  return (
    <header className="border-b border-primary-border bg-primary-bg">
      <nav className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <Link
            id="header-title"
            to="/"
            className="text-3xl"
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
          <div className="flex items-center gap-3">
            <span className="uppercase text-primary-text font-semibold text-sm">{`${darkMode ? 'dark' : 'light'} mode`}</span>
            <ToggleSwitch isOn={darkMode} handleToggle={handleThemeToggle} />
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/about"
              className="text-link hover:text-link-hover"
            >
              About
            </Link>
            <Link
              to="/feedback"
              className="text-link hover:text-link-hover"
            >
              Feedback
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
