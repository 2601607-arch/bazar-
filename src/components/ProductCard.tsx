import React, { useState } from 'react';
import { Heart, Share2, ShoppingCart, Star, Package } from 'lucide-react';
import { Product } from '../types';
import { calculateAffiliateCommission, formatRs } from '../data/mockData';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    navigate,
    addToCart,
    wishlistIds,
    toggleWishlist,
    setShareProductModal,
  } = useStore();
  const [imgError, setImgError] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const commission = calculateAffiliateCommission(product.price);

  return (
    <article className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Product Image Area (4:3 aspect) */}
      <div className="relative aspect-[4/3] bg-[#F4F5F7] overflow-hidden">
        {!imgError && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            onClick={() => navigate(`/product/${product.slug}`)}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            onClick={() => navigate(`/product/${product.slug}`)}
            className="w-full h-full flex flex-col items-center justify-center text-zinc-400 cursor-pointer bg-gradient-to-br from-zinc-100 to-zinc-200 p-4 text-center"
          >
            <Package className="w-8 h-8 mb-2 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-500">{product.name}</span>
          </div>
        )}

        {/* Quick Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
            isWishlisted
              ? 'bg-[#F85606] border-[#F85606] text-white'
              : 'bg-white/90 border-zinc-200 text-zinc-600 hover:text-[#F85606]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5 truncate">
          <span className="truncate">{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.sellerName}</span>
        </div>

        <h3
          onClick={() => navigate(`/product/${product.slug}`)}
          className="font-display text-sm sm:text-base font-semibold text-[#18181B] leading-snug line-clamp-2 cursor-pointer hover:text-[#F85606] transition-colors mb-2"
        >
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-mono text-base sm:text-lg font-bold text-[#F85606] tabular-nums">
            {formatRs(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="font-mono text-xs text-zinc-400 line-through tabular-nums">
                {formatRs(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-zinc-700 tabular-nums">
                -{product.discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-3">
          <span className="inline-flex items-center gap-1 font-medium text-zinc-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{product.rating.toFixed(1)}</span>
          </span>
          <span className="text-zinc-400 tabular-nums">({product.reviewCount})</span>
          <span aria-hidden="true">·</span>
          <span className="text-zinc-500 tabular-nums">{product.soldCount} sold</span>
        </div>

        {/* Affiliate 14% Commission Strip */}
        <div className="mt-auto pt-3 border-t border-zinc-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">14% Affiliate Earn</span>
            <span className="font-mono font-semibold text-emerald-700 tabular-nums">
              {formatRs(commission)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={() => setShareProductModal(product)}
              aria-label={`Share ${product.name} affiliate link`}
              title="Share Product & Earn 14%"
              className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg border border-zinc-200 hover:border-[#F85606] text-zinc-700 hover:text-[#F85606] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
