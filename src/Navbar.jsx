import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, isLoggedIn, logout }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lab_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lab_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Web II Lab
        </Link>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          {isLoggedIn && user && (
            <div className="nav-user-info">
              <span className="user-badge">
                {user.fullName ? user.fullName : user.username}
              </span>
              <button
                type="button"
                className="btn-logout-nav"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
