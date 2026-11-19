import React from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export interface DashboardNavItem {
  label: string;
  route: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  portalTitle: string;
  portalRole: UserRole;
  breadcrumb: string;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}

export function DashboardLayout({
  portalTitle,
  portalRole,
  breadcrumb,
  navItems,
  children,
}: DashboardLayoutProps) {
  const { currentPath, navigate, user, loginAsRole, activeAffiliateId } = useStore();

  const subtitle =
    portalRole === 'seller'
      ? user?.storeName || 'SoundCraft Official'
      : portalRole === 'affiliate'
        ? `Affiliate ID · ${activeAffiliateId}`
        : user?.name || 'Demo Buyer Account';

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8">
      {/* Top Role Switcher Strip for Quick Demo Exploration */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-500 mb-0.5">{breadcrumb}</div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#18181B]">
            {portalTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 mr-1">Switch Demo Portal:</span>
          <button
            type="button"
            onClick={() => {
              loginAsRole('buyer');
              navigate('/buyer/dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              portalRole === 'buyer'
                ? 'bg-[#F85606] text-white'
                : 'bg-[#F4F5F7] text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => {
              loginAsRole('seller');
              navigate('/seller/dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              portalRole === 'seller'
                ? 'bg-[#F85606] text-white'
                : 'bg-[#F4F5F7] text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => {
              loginAsRole('affiliate');
              navigate('/affiliate/dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              portalRole === 'affiliate'
                ? 'bg-[#F85606] text-white'
                : 'bg-[#F4F5F7] text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Affiliate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Sidebar Navigation */}
        <aside className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="pb-4 mb-4 border-b border-zinc-100">
            <div className="text-xs text-zinc-500 capitalize">{portalRole} Account</div>
            <div className="font-display font-semibold text-sm text-[#18181B] mt-0.5 truncate">
              {subtitle}
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => {
              const active = currentPath === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer text-left ${
                    active
                      ? 'bg-[#F85606]/10 text-[#F85606] font-semibold'
                      : 'text-zinc-700 hover:bg-[#F4F5F7] hover:text-[#18181B]'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Portal Content */}
        <main className="min-w-0 space-y-6">{children}</main>
      </div>
    </div>
  );
}
