import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Wallet, LayoutDashboard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { AFFILIATE_RATE, calculateAffiliateCommission, formatRs } from '../data/mockData';

export function LoginPage() {
  const { navigate, loginAsRole, showToast } = useStore();
  const [email, setEmail] = useState('amina.buyer@bazaarlink.demo');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [roleTarget, setRoleTarget] = useState<UserRole>('buyer');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(roleTarget, email);
    navigate(`/${roleTarget}/dashboard`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#18181B]">Sign In to BazaarLink</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Access your Buyer, Seller, or Affiliate Member dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Demo Account Portal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['buyer', 'seller', 'affiliate'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleTarget(role)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-colors cursor-pointer ${
                    roleTarget === role
                      ? 'bg-[#F85606] border-[#F85606] text-white'
                      : 'bg-[#F4F5F7] border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#F85606] rounded"
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotSent(true);
                showToast('Demo password reset link simulated');
              }}
              className="text-[#F85606] hover:underline font-medium cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {forgotSent && (
            <div className="p-3 rounded-lg bg-[#F4F5F7] border border-zinc-200 text-xs text-zinc-700">
              Password reset instructions have been simulated for <span className="font-semibold">{email}</span>.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Sign In to {roleTarget.charAt(0).toUpperCase() + roleTarget.slice(1)} Dashboard
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-600">
          New to BazaarLink?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-[#F85606] font-semibold hover:underline cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { navigate, signupUser } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<UserRole>('buyer');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    signupUser({ name, email, role: accountType });
    navigate(`/${accountType}/dashboard`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#18181B]">Create Your Account</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Join as a Buyer, Multi-Vendor Seller, or Affiliate Member.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="su-name" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Full Name
            </label>
            <input
              id="su-name"
              type="text"
              required
              placeholder="e.g. Sara Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="su-email" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Email Address
            </label>
            <input
              id="su-email"
              type="email"
              required
              placeholder="sara@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="su-role" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Account Type
            </label>
            <select
              id="su-role"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[#F85606]"
            >
              <option value="buyer">Buyer — Shop products & track orders</option>
              <option value="seller">Seller — List products & manage vendor store</option>
              <option value="affiliate">Affiliate Member — Share links & earn 14%</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="su-pass" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                id="su-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
              />
            </div>
            <div>
              <label htmlFor="su-cpass" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="su-cpass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-600">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#F85606] font-semibold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export function AffiliateSignupPage() {
  const { navigate, registerAffiliate } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [createdAffiliateId, setCreatedAffiliateId] = useState<string | null>(null);
  const [calcPrice, setCalcPrice] = useState(5000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    const newUser = registerAffiliate({ name, email });
    setCreatedAffiliateId(newUser.affiliateId || 'AF1042');
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Program Overview & Live 14% Calculator */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-semibold text-[#F85606] mb-1.5">
              Become a Member · Affiliate Partner Program
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B]">
              Earn {AFFILIATE_RATE}% Commission on Every Product Sale
            </h1>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
              Every registered affiliate receives a unique tracking ID. Share any product URL with your <span className="font-mono text-zinc-800">?ref=YOUR_ID</span> parameter on WhatsApp, Facebook, or blogs.
            </p>
          </div>

          <div className="bg-[#F4F5F7] border border-zinc-200 rounded-xl p-5 space-y-3">
            <div className="text-xs font-semibold text-zinc-700">
              Interactive 14% Commission Calculator
            </div>
            <div>
              <label htmlFor="calc-price" className="block text-xs text-zinc-500 mb-1">
                Product Actual Price (Rs.)
              </label>
              <input
                id="calc-price"
                type="number"
                min={100}
                step={100}
                value={calcPrice}
                onChange={(e) => setCalcPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 font-mono text-sm tabular-nums focus:outline-none focus:border-[#F85606]"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-sm">
              <span className="text-zinc-600">
                Formula: {formatRs(calcPrice)} × {AFFILIATE_RATE} / 100
              </span>
              <span className="font-mono text-lg font-bold text-emerald-700 tabular-nums">
                {formatRs(calculateAffiliateCommission(calcPrice))}
              </span>
            </div>
          </div>

          <ul className="space-y-2.5 text-sm text-zinc-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F85606] mt-0.5 shrink-0" />
              <span>Unique referral URLs generated automatically for every catalog item.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F85606] mt-0.5 shrink-0" />
              <span>Clear separation of Pending, Approved, and Available Wallet Balances.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F85606] mt-0.5 shrink-0" />
              <span>Instant demo access to your Affiliate Dashboard & Commission Wallet.</span>
            </li>
          </ul>
        </div>

        {/* Right: Signup Form OR Post-Signup Activation Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8">
          {createdAffiliateId ? (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Affiliate Partner Account Activated</span>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-[#18181B]">
                  Welcome to BazaarLink Affiliates
                </h2>
                <p className="text-sm text-zinc-600 mt-1">
                  Your unique referral ID is ready. Use it on any product link to earn 14% commission.
                </p>
              </div>

              <div className="bg-[#F4F5F7] border border-zinc-200 rounded-xl p-5">
                <div className="text-xs text-zinc-500 mb-1">Your Unique Affiliate ID</div>
                <div className="font-mono text-2xl font-bold text-[#F85606] tabular-nums">
                  {createdAffiliateId}
                </div>
                <div className="text-xs font-mono text-zinc-600 mt-2">
                  Sample Link: /product/wireless-headphones?ref={createdAffiliateId}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/affiliate/dashboard')}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Affiliate Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/affiliate/wallet')}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-zinc-200 hover:border-[#F85606] text-sm font-semibold text-[#18181B] hover:text-[#F85606] cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Commission Wallet</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-[#18181B]">
                Affiliate Registration
              </h2>

              <div>
                <label htmlFor="aff-name" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="aff-name"
                  type="text"
                  required
                  placeholder="Zainab Malik"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <div>
                <label htmlFor="aff-email" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="aff-email"
                  type="email"
                  required
                  placeholder="zainab@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <div>
                <label htmlFor="aff-pass" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Password
                </label>
                <input
                  id="aff-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <div>
                <label htmlFor="aff-cpass" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="aff-cpass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
                />
              </div>

              {error && <p className="text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Register & Get Affiliate ID</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
