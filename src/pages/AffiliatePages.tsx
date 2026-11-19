import React, { useMemo, useState } from 'react';
import {
  Copy,
  History,
  LayoutDashboard,
  Link2,
  Share2,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DashboardLayout, DashboardNavItem } from '../components/DashboardLayout';
import {
  AFFILIATE_RATE,
  calculateAffiliateCommission,
  formatRs,
} from '../data/mockData';
import { CommissionStatus } from '../types';

const AFFILIATE_NAV: DashboardNavItem[] = [
  { label: 'Affiliate Dashboard', route: '/affiliate/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Referrals', route: '/affiliate/referrals', icon: <Users className="w-4 h-4" /> },
  { label: 'My Wallet', route: '/affiliate/wallet', icon: <Wallet className="w-4 h-4" /> },
  { label: 'Commission History', route: '/affiliate/commissions', icon: <History className="w-4 h-4" /> },
  { label: 'My Affiliate Links', route: '/affiliate/links', icon: <Link2 className="w-4 h-4" /> },
  { label: 'Affiliate Profile', route: '/affiliate/profile', icon: <UserCheck className="w-4 h-4" /> },
];

export function AffiliateDashboardPage() {
  const { commissions, referrals, activeAffiliateId, navigate } = useStore();

  const stats = useMemo(() => {
    const totalClicks = referrals.reduce((s, r) => s + r.clicks, 0);
    const totalReferrals = referrals.reduce((s, r) => s + r.conversions, 0);
    const pendingCommission = commissions
      .filter((c) => c.status === 'Pending')
      .reduce((s, c) => s + c.commissionAmount, 0);
    const approvedCommission = commissions
      .filter((c) => c.status === 'Approved')
      .reduce((s, c) => s + c.commissionAmount, 0);
    const availableBalance = commissions
      .filter((c) => c.status === 'Available')
      .reduce((s, c) => s + c.commissionAmount, 0);
    const totalEarnings = pendingCommission + approvedCommission + availableBalance;

    return {
      totalClicks,
      totalReferrals,
      successfulPurchases: commissions.length,
      pendingCommission,
      approvedCommission,
      availableBalance,
      totalEarnings,
    };
  }, [commissions, referrals]);

  return (
    <DashboardLayout
      portalTitle="Affiliate Dashboard"
      portalRole="affiliate"
      breadcrumb="Home / Affiliate / Dashboard"
      navItems={AFFILIATE_NAV}
    >
      {/* Partner ID Banner */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-500">Active Partner Tracking ID</div>
          <div className="font-mono text-xl font-bold text-[#F85606] tabular-nums mt-0.5">
            {activeAffiliateId} · {AFFILIATE_RATE}% Flat Commission
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/affiliate/links')}
            className="px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs font-semibold cursor-pointer"
          >
            Generate Product Links
          </button>
          <button
            type="button"
            onClick={() => navigate('/affiliate/wallet')}
            className="px-4 py-2 rounded-lg border border-zinc-200 hover:border-[#F85606] text-xs font-semibold text-[#18181B] cursor-pointer"
          >
            View Wallet
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Clicks</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {stats.totalClicks.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Referrals</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {stats.totalReferrals}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Successful Purchases</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {stats.successfulPurchases}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Pending Commission (Unverified)</div>
          <div className="font-mono text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {formatRs(stats.pendingCommission)}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Locked until delivery verified</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Available Wallet Balance</div>
          <div className="font-mono text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {formatRs(stats.availableBalance)}
          </div>
          <div className="text-xs text-emerald-700 mt-1">Verified & withdrawable</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Earnings (All States)</div>
          <div className="font-mono text-2xl font-bold text-[#F85606] mt-1 tabular-nums">
            {formatRs(stats.totalEarnings)}
          </div>
          <div className="text-xs text-zinc-500 mt-1 tabular-nums">
            Approved clearing: {formatRs(stats.approvedCommission)}
          </div>
        </div>
      </div>

      {/* Commission History Preview */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-[#18181B]">Commission History</h2>
          <button
            type="button"
            onClick={() => navigate('/affiliate/commissions')}
            className="text-xs font-semibold text-[#F85606] hover:underline cursor-pointer"
          >
            View Full Ledger
          </button>
        </div>

        <CommissionTable rows={commissions.slice(0, 5)} />
      </div>
    </DashboardLayout>
  );
}

function CommissionTable({ rows }: { rows: ReturnType<typeof useStore>['commissions'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-xs text-zinc-500">
            <th className="py-2.5 pr-4 font-medium">ID / Order</th>
            <th className="py-2.5 px-4 font-medium">Product</th>
            <th className="py-2.5 px-4 font-medium text-right">Sale Price</th>
            <th className="py-2.5 px-4 font-medium text-right">14% Earn</th>
            <th className="py-2.5 px-4 font-medium">Status</th>
            <th className="py-2.5 pl-4 font-medium">Verification Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-[#F4F5F7]/60">
              <td className="py-3 pr-4 font-mono text-xs font-semibold tabular-nums">
                {c.id} · {c.orderId}
              </td>
              <td className="py-3 px-4 text-zinc-800">{c.productName}</td>
              <td className="py-3 px-4 text-right font-mono tabular-nums">
                {formatRs(c.saleAmount)}
              </td>
              <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                {formatRs(c.commissionAmount)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`text-xs font-semibold ${
                    c.status === 'Available'
                      ? 'text-emerald-700'
                      : c.status === 'Approved'
                        ? 'text-blue-700'
                        : 'text-amber-700'
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="py-3 pl-4 text-xs text-zinc-500">{c.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AffiliateReferralsPage() {
  const { referrals, activeAffiliateId, showToast, navigate } = useStore();

  const copyRef = async (slug: string) => {
    const url = `${window.location.origin}/product/${slug}?ref=${activeAffiliateId}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Referral URL copied');
    } catch {
      showToast(`/product/${slug}?ref=${activeAffiliateId}`);
    }
  };

  return (
    <DashboardLayout
      portalTitle="My Referrals"
      portalRole="affiliate"
      breadcrumb="Home / Affiliate / Referrals"
      navItems={AFFILIATE_NAV}
    >
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-[#18181B]">
          Referral Performance by Product
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="py-2.5 pr-4 font-medium">Product</th>
                <th className="py-2.5 px-4 font-medium">Referral Link</th>
                <th className="py-2.5 px-4 font-medium text-right">Clicks</th>
                <th className="py-2.5 px-4 font-medium text-right">Purchases</th>
                <th className="py-2.5 px-4 font-medium text-right">Earned</th>
                <th className="py-2.5 pl-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {referrals.map((r) => {
                const refPath = `/product/${r.productSlug}?ref=${activeAffiliateId}`;
                return (
                  <tr key={r.id} className="hover:bg-[#F4F5F7]/60">
                    <td className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => navigate(refPath)}
                        className="font-semibold text-[#18181B] hover:text-[#F85606] text-left cursor-pointer"
                      >
                        {r.productName}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-600">{refPath}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{r.clicks}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{r.conversions}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      {formatRs(r.earnedTotal)}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        type="button"
                        onClick={() => copyRef(r.productSlug)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:border-[#F85606] text-xs font-semibold cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function AffiliateWalletPage() {
  const { commissions, showToast } = useStore();
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer (IBAN)');
  const [accountNumber, setAccountNumber] = useState('PK36MEZN0002810104829104');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const pendingTotal = commissions
    .filter((c) => c.status === 'Pending')
    .reduce((s, c) => s + c.commissionAmount, 0);
  const approvedTotal = commissions
    .filter((c) => c.status === 'Approved')
    .reduce((s, c) => s + c.commissionAmount, 0);
  const availableTotal = commissions
    .filter((c) => c.status === 'Available')
    .reduce((s, c) => s + c.commissionAmount, 0);

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    showToast(`Demo withdrawal request logged for ${formatRs(availableTotal)}`);
  };

  return (
    <DashboardLayout
      portalTitle="My Wallet"
      portalRole="affiliate"
      breadcrumb="Home / Affiliate / Wallet"
      navItems={AFFILIATE_NAV}
    >
      {/* Clear 3-Stage Commission Separation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-amber-700">1. Pending (Not Withdrawable)</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-2 tabular-nums">
            {formatRs(pendingTotal)}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">
            Held until customer delivery is completed and the 7-day return check passes.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-blue-700">2. Approved (Clearing)</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-2 tabular-nums">
            {formatRs(approvedTotal)}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">
            Verified purchases queued for weekly settlement into Available balance.
          </p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-emerald-700">3. Available (Withdrawable)</div>
          <div className="font-mono text-2xl font-bold text-emerald-700 mt-2 tabular-nums">
            {formatRs(availableTotal)}
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">
            Fully verified earnings ready for demo payout request.
          </p>
        </div>
      </div>

      {/* Payout Form */}
      <form onSubmit={handleWithdrawRequest} className="bg-white border border-zinc-200 rounded-xl p-6 max-w-xl space-y-4">
        <h2 className="font-display text-lg font-bold text-[#18181B]">
          Request Demo Withdrawal (Available Balance Only)
        </h2>
        <p className="text-xs text-zinc-600">
          Only <span className="font-mono font-bold text-emerald-700">{formatRs(availableTotal)}</span> is eligible for withdrawal. Pending ({formatRs(pendingTotal)}) and Approved ({formatRs(approvedTotal)}) amounts cannot be withdrawn before verification.
        </p>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Payout Channel</label>
          <select
            value={payoutMethod}
            onChange={(e) => setPayoutMethod(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[#F85606]"
          >
            <option value="Bank Transfer (IBAN)">Bank Transfer (IBAN)</option>
            <option value="JazzCash Wallet (Demo)">JazzCash Wallet (Demo)</option>
            <option value="EasyPaisa Wallet (Demo)">EasyPaisa Wallet (Demo)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Account / IBAN</label>
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 font-mono text-sm focus:outline-none focus:border-[#F85606]"
          />
        </div>

        <button
          type="submit"
          disabled={availableTotal <= 0}
          className="px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] disabled:bg-zinc-300 text-white text-sm font-semibold cursor-pointer"
        >
          Request Demo Payout ({formatRs(availableTotal)})
        </button>

        {withdrawSuccess && (
          <div className="p-3 rounded-lg bg-[#F4F5F7] border border-zinc-200 text-xs text-zinc-700">
            Demo payout request submitted for {formatRs(availableTotal)} via {payoutMethod}. (No real money transfer occurs in frontend demo mode.)
          </div>
        )}
      </form>
    </DashboardLayout>
  );
}

export function AffiliateCommissionsPage() {
  const { commissions } = useStore();
  const [statusFilter, setStatusFilter] = useState<'All' | CommissionStatus>('All');

  const filtered =
    statusFilter === 'All'
      ? commissions
      : commissions.filter((c) => c.status === statusFilter);

  return (
    <DashboardLayout
      portalTitle="Commission History"
      portalRole="affiliate"
      breadcrumb="Home / Affiliate / Commissions"
      navItems={AFFILIATE_NAV}
    >
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-[#18181B]">
            14% Commission Ledger
          </h2>
          <div className="inline-flex items-center gap-1 p-1 bg-[#F4F5F7] rounded-lg">
            {(['All', 'Pending', 'Approved', 'Available'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-[#18181B] shadow-sm'
                    : 'text-zinc-600 hover:text-[#18181B]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <CommissionTable rows={filtered} />
      </div>
    </DashboardLayout>
  );
}

export function AffiliateLinksPage() {
  const { products, activeAffiliateId, setShareProductModal, showToast, navigate } = useStore();

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/product/${slug}?ref=${activeAffiliateId}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Referral link copied');
    } catch {
      showToast(`/product/${slug}?ref=${activeAffiliateId}`);
    }
  };

  return (
    <DashboardLayout
      portalTitle="My Affiliate Links"
      portalRole="affiliate"
      breadcrumb="Home / Affiliate / Links"
      navItems={AFFILIATE_NAV}
    >
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-[#18181B]">
            Product Referral Link Generator (ID: {activeAffiliateId})
          </h2>
          <p className="text-xs text-zinc-600 mt-1">
            Every link includes your unique referral query parameter and earns {AFFILIATE_RATE}% of the product actual price upon verified purchase.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          {products.map((product) => {
            const commission = calculateAffiliateCommission(product.price);
            const relUrl = `/product/${product.slug}?ref=${activeAffiliateId}`;
            return (
              <div
                key={product.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-12 rounded-lg object-cover bg-[#F4F5F7] shrink-0"
                  />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate(relUrl)}
                      className="font-semibold text-sm text-[#18181B] hover:text-[#F85606] text-left truncate block cursor-pointer"
                    >
                      {product.name}
                    </button>
                    <div className="text-xs text-zinc-500 mt-0.5 font-mono tabular-nums">
                      Price: {formatRs(product.price)} · 14% Earn: {formatRs(commission)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <code className="px-2.5 py-1.5 rounded bg-[#F4F5F7] border border-zinc-200 text-xs font-mono text-zinc-700">
                    {relUrl}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyLink(product.slug)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareProductModal(product)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-[#F85606] text-xs font-semibold text-[#18181B] cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export function AffiliateProfilePage() {
  const { user, activeAffiliateId, updateUserProfile } = useStore();
  const [name, setName] = useState(user?.name || 'Zainab Malik');
  const [email, setEmail] = useState(user?.email || 'zainab.affiliate@bazaarlink.demo');
  const [phone, setPhone] = useState(user?.phone || '+92 333 9120455');
  const [city, setCity] = useState(user?.city || 'Islamabad');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone, city });
  };

  return (
    <DashboardLayout
      portalTitle="Affiliate Profile"
      portalRole="affiliate"
      breadcrumb="Home / Affiliate / Profile"
      navItems={AFFILIATE_NAV}
    >
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 max-w-xl space-y-4">
        <div className="bg-[#F4F5F7] border border-zinc-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">Unique Affiliate ID</div>
            <div className="font-mono text-lg font-bold text-[#F85606]">{activeAffiliateId}</div>
          </div>
          <div className="text-xs font-semibold text-emerald-700">14% Partner Rate</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold cursor-pointer"
        >
          Save Affiliate Profile
        </button>
      </form>
    </DashboardLayout>
  );
}
