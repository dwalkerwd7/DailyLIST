import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ToggleSwitch from './utils/ToggleSwitch';

export default function Header() {
    const [titleHovered, setTitleHovered] = useState(false);
    const [titleHasHovered, setTitleHasHovered] = useState(false); // needed to prevent animation on first render
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            return true; // dark mode by default
        }
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                        id="header-title"
                        to="/"
                        className="text-3xl text-center sm:text-left"
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
                    <div className="flex items-center justify-between sm:justify-end sm:gap-8">
                        <div className="flex items-center gap-3">
                            <span className="uppercase text-primary-text font-semibold text-sm">{`${darkMode ? 'Dark' : 'Light'}`}</span>
                            <ToggleSwitch isOn={!darkMode} handleToggle={handleThemeToggle} />
                        </div>
                        <div className="flex items-center gap-6">
                            <NavLink to="/about" className={({ isActive }) => `py-2 px-1 ${isActive ? "text-link-hover font-semibold" : "text-link hover:text-link-hover"}`}>About</NavLink>
                            <NavLink to="/feedback" className={({ isActive }) => `py-2 px-1 ${isActive ? "text-link-hover font-semibold" : "text-link hover:text-link-hover"}`}>Feedback</NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
