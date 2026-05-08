import { Link, useLocation } from 'react-router-dom';
import { Train, LogIn, User, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ toggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === 'dark';

  const handleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const links = [
    { path: '/',               label: 'Home' },
    { path: '/pnr-status',    label: 'PNR' },
    { path: '/live-tracking',  label: 'Live Status' },
    { path: '/connecting-journeys', label: 'Routes' },
    { path: '/proximity-alerts', label: 'Alerts' },
    { path: '/seat-exchange',  label: 'Seat Swap' },
    { path: '/sos',            label: 'SOS', isDanger: true },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bp-topbar-glass" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-5 h-[62px] flex items-center justify-between gap-6">
        
        {/* ── Sidebar Toggle ── */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center"
          style={{ border: '1px solid var(--border)' }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              boxShadow: 'var(--shadow-primary)',
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]"
          >
            <Train size={18} strokeWidth={2.5} />
          </div>
          <span
            className="text-[20px] font-extrabold tracking-tighter"
            style={{
              color: 'var(--text-heading)',
            }}
          >
            BHARAT<span style={{ color: 'var(--primary)' }}>PATH</span>
          </span>
        </Link>

        {/* ── Nav Pills ── */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`bp-nav-pill ${isActive ? 'bp-nav-active' : ''} ${link.isDanger ? 'bp-nav-danger' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Toggle + Auth ── */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className={`theme-toggle ${isDark ? 'theme-toggle--active' : ''}`}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            aria-label="Toggle theme"
          >
            <span className="theme-toggle__track">
              <span className="theme-toggle__thumb" />
            </span>
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ borderColor: 'var(--primary)', boxShadow: '0 0 0 2px var(--primary-glow)' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'var(--primary)' }}
                >
                  {user.name?.charAt(0).toUpperCase() || <User size={14} />}
                </div>
              )}
              <div className="hidden sm:flex flex-col">
                <span className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-[10px] font-bold uppercase tracking-wider text-left hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bp-btn bp-btn--primary"
              style={{ padding: '7px 16px', fontSize: '13px', borderRadius: '9px', gap: '6px' }}
            >
              <LogIn size={14} strokeWidth={2.5} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
