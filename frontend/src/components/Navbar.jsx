import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PenSquare,
  BookOpen,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Chronicle
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-600">
                Blog Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-brand-50 text-brand-700 border border-brand-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Blogs</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/my-blogs"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/my-blogs')
                      ? 'bg-brand-50 text-brand-700 border border-brand-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <Link
                  to="/create-blog"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all hover:shadow-brand-500/30"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write Post</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
                      {user?.email}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Explore Blogs</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-blogs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-600" />
                <span>My Dashboard</span>
              </Link>
              <Link
                to="/create-blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write New Post</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <User className="w-4 h-4 text-brand-600" />
                <span>My Profile ({user?.name})</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-800"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
