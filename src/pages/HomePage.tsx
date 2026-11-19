import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Percent, ShieldCheck, Store } from 'lucide-react';
import { BANNER_SLIDES, CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const { navigate, products } = useStore();
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'recommended' | 'bestselling' | 'new'>('recommended');

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = BANNER_SLIDES[slideIdx];
  const flashDeals = products.filter((p) => p.sectionTags.includes('flash')).slice(0, 4);
  const tabbedProducts = products.filter((p) => p.sectionTags.includes(activeTab));

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner & Daraz-Style Category Rail */}
      <section className="bg-white border-b border-zinc-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 items-stretch">
            {/* Left Categories Rail (Desktop) */}
            <aside className="hidden lg:flex flex-col justify-between bg-[#F4F5F7] border border-zinc-200 rounded-xl p-3">
              <div>
                <div className="px-2.5 py-2 text-xs font-semibold text-zinc-500">
                  Browse Categories
                </div>
                <ul className="space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/categories?cat=${cat.slug}`)}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-sm font-medium text-zinc-800 hover:bg-white hover:text-[#F85606] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="mt-3 w-full py-2 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-[#18181B] hover:border-[#F85606] hover:text-[#F85606] transition-colors cursor-pointer"
              >
                All Categories
              </button>
            </aside>

            {/* Promotional Banner Slider */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900 min-h-[300px] sm:min-h-[380px] lg:min-h-[400px]">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15" />

              <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-10 lg:p-12 max-w-xl text-white">
                <p className="text-xs sm:text-sm font-medium text-[#FF8C42] mb-2">
                  {currentSlide.kicker}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-balance mb-3">
                  {currentSlide.title}
                </h1>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed mb-6">
                  {currentSlide.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(currentSlide.ctaRoute)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <span>{currentSlide.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-zinc-300">{currentSlide.accentNote}</span>
                </div>
              </div>

              {/* Slider Prev / Next & Indicators */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSlideIdx((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)
                  }
                  aria-label="Previous promotional slide"
                  className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/75 text-white flex items-center justify-center border border-white/20 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-2">
                  {BANNER_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlideIdx(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === slideIdx ? 'w-6 bg-[#F85606]' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSlideIdx((prev) => (prev + 1) % BANNER_SLIDES.length)}
                  aria-label="Next promotional slide"
                  className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/75 text-white flex items-center justify-center border border-white/20 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#18181B]">
              Featured Categories
            </h2>
            <p className="text-sm text-zinc-600 mt-0.5">
              Curated collections from verified multi-vendor sellers
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="text-sm font-semibold text-[#F85606] hover:text-[#D94802] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>Browse All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/categories?cat=${cat.slug}`)}
              className="group bg-white border border-zinc-200 rounded-xl overflow-hidden text-left hover:-translate-y-0.5 hover:border-[#F85606]/50 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="aspect-[4/3] bg-[#F4F5F7] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <div className="font-display text-sm font-semibold text-[#18181B] group-hover:text-[#F85606] truncate">
                  {cat.name}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 tabular-nums">
                  {cat.itemCount} items
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#18181B]">
              Flash Deals
            </h2>
            <p className="text-sm text-zinc-600 mt-0.5">
              Limited-stock vendor markdowns · All eligible for 14% affiliate commissions
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="text-sm font-semibold text-[#F85606] hover:text-[#D94802] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>Shop All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {flashDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Showcase Tabs: Recommended / Best Selling / New Arrivals */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#18181B]">
              Marketplace Highlights
            </h2>
            <p className="text-sm text-zinc-600 mt-0.5">
              Switch between Recommended, Best Selling, and New Arrivals
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Product showcase tabs"
            className="inline-flex items-center p-1 bg-white border border-zinc-200 rounded-lg self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'recommended'}
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'recommended'
                  ? 'bg-[#F85606] text-white'
                  : 'text-zinc-600 hover:text-[#18181B]'
              }`}
            >
              Recommended Products
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'bestselling'}
              onClick={() => setActiveTab('bestselling')}
              className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'bestselling'
                  ? 'bg-[#F85606] text-white'
                  : 'text-zinc-600 hover:text-[#18181B]'
              }`}
            >
              Best Selling
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'new'}
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-[#F85606] text-white'
                  : 'text-zinc-600 hover:text-[#18181B]'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tabbedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Become a Member — Dedicated Affiliate Section */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <p className="text-xs font-semibold text-[#F85606] mb-2">
              BazaarLink Affiliate Partner Program
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] text-balance mb-3">
              Become a Member & Earn 14% Commission on Every Verified Referral
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6 max-w-2xl">
              Generate your unique affiliate ID, share product referral links via WhatsApp or Facebook, and track clicks, pending clearances, and withdrawable wallet balances in real time.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/affiliate/signup')}
                className="px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Become an Affiliate Member
              </button>
              <button
                type="button"
                onClick={() => navigate('/affiliate/dashboard')}
                className="px-5 py-2.5 rounded-lg border border-zinc-200 hover:border-[#F85606] text-sm font-semibold text-[#18181B] hover:text-[#F85606] transition-colors cursor-pointer"
              >
                Explore Demo Affiliate Dashboard
              </button>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-zinc-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-[#F85606] shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#18181B]">
                  Flat 14% Commission Formula
                </div>
                <div className="text-xs text-zinc-600 mt-0.5 font-mono tabular-nums">
                  Rs. 5,000 product × 14 / 100 = Rs. 700 earned
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-[#F85606] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#18181B]">
                  Transparent Pending vs. Available Wallet
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">
                  Commissions stay Pending until buyer delivery is verified before moving to Available balance.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-[#F85606] shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#18181B]">
                  Want to Sell Your Own Products?
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">
                  Buyers can activate a Seller storefront anytime inside Account Settings.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
