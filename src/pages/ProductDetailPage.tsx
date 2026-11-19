import React, { useState } from 'react';
import {
  Check,
  Heart,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  AFFILIATE_RATE,
  calculateAffiliateCommission,
  formatRs,
} from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const {
    products,
    navigate,
    addToCart,
    wishlistIds,
    toggleWishlist,
    setShareProductModal,
    activeAffiliateId,
    visitedRefCode,
  } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const isWishlisted = wishlistIds.includes(product.id);
  const commission = calculateAffiliateCommission(product.price);
  const referralUrl = `/product/${product.slug}?ref=${activeAffiliateId}`;
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/buyer/cart');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500">
        <button type="button" onClick={() => navigate('/')} className="hover:text-[#F85606] cursor-pointer">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => navigate(`/categories?cat=${product.categorySlug}`)}
          className="hover:text-[#F85606] cursor-pointer"
        >
          {product.category}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-800 font-medium truncate">{product.name}</span>
      </nav>

      {/* Referral Attribution Notice if visited via ?ref= */}
      {visitedRefCode && (
        <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="text-zinc-700">
            Referral tracking active for Partner ID{' '}
            <span className="font-mono font-bold text-emerald-700">{visitedRefCode}</span>.
            Verified purchase awards 14% affiliate commission.
          </div>
        </div>
      )}

      {/* Main Contiguous Purchase Module */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Left: Product Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-[#F4F5F7] border border-zinc-200 rounded-xl overflow-hidden">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    activeImageIdx === idx ? 'border-[#F85606]' : 'border-zinc-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info, Purchase Controls & 14% Affiliate Panel */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.soldCount} sold</span>
              <span aria-hidden="true">·</span>
              <span className={product.stock > 0 ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B] leading-tight">
              {product.name}
            </h1>

            {/* Customer Ratings */}
            <div className="flex items-center gap-3 mt-3 text-sm">
              <div className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-[#18181B] tabular-nums">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-zinc-500 tabular-nums">
                {product.reviewCount} Customer Ratings
              </span>
            </div>
          </div>

          {/* Price & Discount */}
          <div className="pb-5 border-b border-zinc-100">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-[#F85606] tabular-nums">
                {formatRs(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="font-mono text-base text-zinc-400 line-through tabular-nums">
                    {formatRs(product.originalPrice)}
                  </span>
                  <span className="text-sm font-semibold text-[#18181B] tabular-nums">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="space-y-3">
            <p className="text-sm text-zinc-700 leading-relaxed">{product.description}</p>
            <ul className="space-y-1.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-600">
                  <Check className="w-4 h-4 text-[#F85606] mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity + Add to Cart + Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-zinc-600">Quantity</span>
              <div className="inline-flex items-center border border-zinc-200 rounded-lg bg-[#F4F5F7]">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 text-zinc-700 hover:text-[#F85606] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                  aria-label="Increase quantity"
                  className="p-2 text-zinc-700 hover:text-[#F85606] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 min-w-[140px] py-3 px-5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() => addToCart(product, qty)}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-[#18181B] hover:bg-zinc-800 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Save to wishlist"
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#F85606]/10 border-[#F85606] text-[#F85606]'
                    : 'border-zinc-200 text-zinc-600 hover:border-[#F85606]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Affiliate Commission Information */}
          <div className="bg-[#F4F5F7] border border-zinc-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#F85606]">
                  Affiliate Commission Information
                </div>
                <div className="text-sm font-semibold text-[#18181B] mt-0.5">
                  Earn {AFFILIATE_RATE}% per verified sale
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShareProductModal(product)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-zinc-200 hover:border-[#F85606] text-xs font-semibold text-[#18181B] hover:text-[#F85606] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Product</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-200 text-xs">
              <div>
                <span className="block text-zinc-500">Product Price</span>
                <span className="font-mono font-semibold text-[#18181B] tabular-nums">
                  {formatRs(product.price)}
                </span>
              </div>
              <div>
                <span className="block text-zinc-500">Commission Rate</span>
                <span className="font-mono font-semibold text-[#18181B] tabular-nums">
                  {AFFILIATE_RATE}%
                </span>
              </div>
              <div>
                <span className="block text-zinc-500">Est. Commission</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {formatRs(commission)}
                </span>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-600 truncate">
              Referral URL: {referralUrl}
            </div>
          </div>

          {/* Seller Information */}
          <div className="border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F4F5F7] flex items-center justify-center text-[#F85606]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#18181B]">{product.sellerName}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {product.sellerCity}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{product.sellerRating.toFixed(1)} Seller Rating</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section>
        <h2 className="font-display text-xl font-bold text-[#18181B] mb-5">
          More From Marketplace Vendors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
