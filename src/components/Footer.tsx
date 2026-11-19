import React from 'react';
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { navigate } = useStore();

  return (
    <footer className="bg-white border-t border-zinc-200 mt-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-display text-lg font-extrabold text-[#18181B] flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#F85606] text-white text-xs font-bold">
                B
              </span>
              <span>
                Bazaar<span className="text-[#F85606]">Link</span>
              </span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed max-w-xs">
              Multi-vendor online marketplace connecting verified regional sellers, everyday shoppers, and 14% commission affiliate partners.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#18181B] mb-3">Marketplace</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <button type="button" onClick={() => navigate('/categories')} className="hover:text-[#F85606] cursor-pointer">
                  All Categories
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/categories?cat=electronics')} className="hover:text-[#F85606] cursor-pointer">
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/categories?cat=home-living')} className="hover:text-[#F85606] cursor-pointer">
                  Home & Kitchen
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/search')} className="hover:text-[#F85606] cursor-pointer">
                  Search Catalog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#18181B] mb-3">Buyer & Seller Portals</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <button type="button" onClick={() => navigate('/buyer/dashboard')} className="hover:text-[#F85606] cursor-pointer">
                  Buyer Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/buyer/orders')} className="hover:text-[#F85606] cursor-pointer">
                  Track My Orders
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/seller/dashboard')} className="hover:text-[#F85606] cursor-pointer">
                  Seller Center
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/seller/add-product')} className="hover:text-[#F85606] cursor-pointer">
                  Sell on BazaarLink
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#18181B] mb-3">Affiliate Program</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <button type="button" onClick={() => navigate('/become-member')} className="hover:text-[#F85606] cursor-pointer font-medium text-[#F85606]">
                  Become a Member (14% Rate)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/affiliate/dashboard')} className="hover:text-[#F85606] cursor-pointer">
                  Affiliate Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/affiliate/links')} className="hover:text-[#F85606] cursor-pointer">
                  Referral Link Generator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/affiliate/wallet')} className="hover:text-[#F85606] cursor-pointer">
                  Commission Wallet
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 BazaarLink Marketplace. Frontend demonstration with sample vendors, products, and affiliate tracking.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/login')} className="hover:text-zinc-800 cursor-pointer">
              Demo Sign In
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => navigate('/signup')} className="hover:text-zinc-800 cursor-pointer">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
