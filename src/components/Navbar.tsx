import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown, User as UserIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockData';

export function Navbar() {
  const { navigate, user, cartCount, logout, currentPath } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    setMobileOpen(false);
  };

  const dashboardRoute =
    user?.role === 'seller'
      ? '/seller/dashboard'
      : user?.role === 'affiliate'
        ? '/affiliate/dashboard'
        : '/buyer/dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      {/* Main Marketplace Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="font-display text-xl font-extrabold tracking-tight text-[#18181B] whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#F85606] text-white text-sm font-bold">
            B
          </span>
          <span>
            Bazaar<span className="text-[#F85606]">Link</span>
          </span>
        </a>

        {/* Search Bar (Desktop & Tablet) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl items-center bg-[#F4F5F7] border border-zinc-200 rounded-lg overflow-hidden focus-within:border-[#F85606] focus-within:bg-white transition-colors"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products, electronics, espresso makers, sellers..."
            aria-label="Search marketplace products"
            className="w-full px-4 py-2 text-sm bg-transparent text-[#18181B] placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-4 py-2.5 bg-[#F85606] hover:bg-[#D94802] text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Primary Nav Links & Actions */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-700 shrink-0">
          <div
            className="relative"
            onMouseEnter={() => setCatMenuOpen(true)}
            onMouseLeave={() => setCatMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className={`flex items-center gap-1 py-2 whitespace-nowrap shrink-0 hover:text-[#F85606] transition-colors cursor-pointer ${
                currentPath === '/categories' ? 'text-[#F85606] font-semibold' : ''
              }`}
            >
              Categories
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {catMenuOpen && (
              <div className="absolute left-0 top-full w-64 bg-white border border-zinc-200 rounded-lg shadow-lg py-2 z-50">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCatMenuOpen(false);
                      navigate(`/categories?cat=${cat.slug}`);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-[#F4F5F7] hover:text-[#F85606] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-zinc-400 tabular-nums">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/become-member"
            onClick={(e) => {
              e.preventDefault();
              navigate('/become-member');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#F85606] transition-colors ${
              currentPath === '/become-member' || currentPath === '/affiliate/signup'
                ? 'text-[#F85606] font-semibold'
                : ''
            }`}
          >
            Become a Member
          </a>

          {user ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(dashboardRoute)}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#18181B] hover:text-[#F85606] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-[#F85606]" />
                <span>{user.name.split(' ')[0]} · Dashboard</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                className="whitespace-nowrap shrink-0 hover:text-[#F85606] transition-colors"
              >
                Login
              </a>
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
                className="px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
              >
                Sign Up
              </a>
            </div>
          )}
        </nav>

        {/* Right Utility: Cart + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/buyer/cart')}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 hover:border-[#F85606] text-zinc-800 hover:text-[#F85606] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Cart</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded bg-[#F85606] text-white text-xs font-semibold tabular-nums">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-[#F4F5F7] border border-zinc-200 rounded-lg overflow-hidden"
          >
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#F85606] text-white cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                navigate('/categories');
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#F4F5F7] text-zinc-800 cursor-pointer"
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/become-member');
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#F4F5F7] text-[#F85606] font-semibold cursor-pointer"
            >
              Become a Member
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/buyer/dashboard');
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#F4F5F7] text-zinc-800 cursor-pointer"
            >
              Buyer Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/seller/dashboard');
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#F4F5F7] text-zinc-800 cursor-pointer"
            >
              Seller Center
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/affiliate/dashboard');
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#F4F5F7] text-zinc-800 cursor-pointer"
            >
              Affiliate Portal
            </button>
            <button
              type="button"
              onClick={() => {
                navigate(user ? dashboardRoute : '/login');
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#F85606] text-white font-semibold cursor-pointer"
            >
              {user ? 'My Dashboard' : 'Login / Sign Up'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
