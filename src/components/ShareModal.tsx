import React, { useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AFFILIATE_RATE, calculateAffiliateCommission, formatRs } from '../data/mockData';

export function ShareModal() {
  const { shareProductModal, setShareProductModal, activeAffiliateId, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!shareProductModal) return null;

  const commission = calculateAffiliateCommission(shareProductModal.price);
  const relativePath = `/product/${shareProductModal.slug}?ref=${activeAffiliateId}`;
  const fullShareUrl = `${window.location.origin}${relativePath}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      showToast('Affiliate referral link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(`Link: ${relativePath}`);
    }
  };

  const shareText = `Check out ${shareProductModal.name} for ${formatRs(shareProductModal.price)} on BazaarLink: ${fullShareUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="bg-white border border-zinc-200 rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-[#F85606] mb-1">
              Affiliate Program · ID {activeAffiliateId}
            </p>
            <h2 id="share-modal-title" className="font-display text-lg font-bold text-[#18181B]">
              Share Product & Earn {AFFILIATE_RATE}%
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShareProductModal(null)}
            aria-label="Close share dialog"
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#F4F5F7] border border-zinc-200 rounded-lg p-4 mb-5">
          <p className="text-sm font-semibold text-[#18181B] mb-2">{shareProductModal.name}</p>
          <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-zinc-200">
            <div>
              <span className="block text-zinc-500">Product Price</span>
              <span className="font-mono font-semibold text-[#18181B] tabular-nums">
                {formatRs(shareProductModal.price)}
              </span>
            </div>
            <div>
              <span className="block text-zinc-500">Rate</span>
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
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">
            Your Unique Referral URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={relativePath}
              className="flex-1 px-3 py-2 text-xs font-mono bg-[#F4F5F7] border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors"
          >
            <span>WhatsApp Share</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#1877F2] hover:bg-[#1464D0] text-white text-sm font-semibold transition-colors"
          >
            <span>Facebook Share</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
