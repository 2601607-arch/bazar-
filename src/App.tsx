import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { HomePage } from './pages/HomePage';
import { AffiliateSignupPage, LoginPage, SignupPage } from './pages/AuthPages';
import { CategoriesPage, SearchPage } from './pages/CatalogPages';
import { ProductDetailPage } from './pages/ProductDetailPage';
import {
  BuyerCartPage,
  BuyerDashboardPage,
  BuyerOrdersPage,
  BuyerSettingsPage,
  BuyerWishlistPage,
} from './pages/BuyerPages';
import {
  SellerAddProductPage,
  SellerDashboardPage,
  SellerOrdersPage,
  SellerProductsPage,
  SellerProfilePage,
} from './pages/SellerPages';
import {
  AffiliateCommissionsPage,
  AffiliateDashboardPage,
  AffiliateLinksPage,
  AffiliateProfilePage,
  AffiliateReferralsPage,
  AffiliateWalletPage,
} from './pages/AffiliatePages';

function RouterOutlet() {
  const { currentPath } = useStore();

  if (currentPath === '/' || currentPath === '') return <HomePage />;
  if (currentPath === '/login') return <LoginPage />;
  if (currentPath === '/signup') return <SignupPage />;
  if (currentPath === '/categories') return <CategoriesPage />;
  if (currentPath === '/search') return <SearchPage />;
  if (currentPath === '/become-member') return <AffiliateSignupPage />;
  if (currentPath.startsWith('/product/')) {
    const slug = currentPath.replace('/product/', '').split('/')[0];
    return <ProductDetailPage slug={slug} />;
  }

  // Buyer Routes
  if (currentPath === '/buyer/dashboard') return <BuyerDashboardPage />;
  if (currentPath === '/buyer/orders') return <BuyerOrdersPage />;
  if (currentPath === '/buyer/wishlist') return <BuyerWishlistPage />;
  if (currentPath === '/buyer/cart') return <BuyerCartPage />;
  if (currentPath === '/buyer/settings') return <BuyerSettingsPage />;

  // Seller Routes
  if (currentPath === '/seller/dashboard') return <SellerDashboardPage />;
  if (currentPath === '/seller/add-product') return <SellerAddProductPage />;
  if (currentPath === '/seller/products') return <SellerProductsPage />;
  if (currentPath === '/seller/orders') return <SellerOrdersPage />;
  if (currentPath === '/seller/profile') return <SellerProfilePage />;

  // Affiliate Routes
  if (currentPath === '/affiliate/signup') return <AffiliateSignupPage />;
  if (currentPath === '/affiliate/dashboard') return <AffiliateDashboardPage />;
  if (currentPath === '/affiliate/referrals') return <AffiliateReferralsPage />;
  if (currentPath === '/affiliate/wallet') return <AffiliateWalletPage />;
  if (currentPath === '/affiliate/commissions') return <AffiliateCommissionsPage />;
  if (currentPath === '/affiliate/links') return <AffiliateLinksPage />;
  if (currentPath === '/affiliate/profile') return <AffiliateProfilePage />;

  return <HomePage />;
}

function ToastBanner() {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 bg-[#18181B] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-zinc-700"
    >
      {toast}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#18181B]">
        <Navbar />
        <div className="flex-1">
          <RouterOutlet />
        </div>
        <Footer />
        <ShareModal />
        <ToastBanner />
      </div>
    </StoreProvider>
  );
}
