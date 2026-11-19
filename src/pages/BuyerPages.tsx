import React, { useState } from 'react';
import {
  Heart,
  LayoutDashboard,
  Minus,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Store,
  Trash2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DashboardLayout, DashboardNavItem } from '../components/DashboardLayout';
import { CATEGORIES, formatRs } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

const BUYER_NAV: DashboardNavItem[] = [
  { label: 'Overview', route: '/buyer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'My Orders', route: '/buyer/orders', icon: <Package className="w-4 h-4" /> },
  { label: 'Wishlist', route: '/buyer/wishlist', icon: <Heart className="w-4 h-4" /> },
  { label: 'Shopping Cart', route: '/buyer/cart', icon: <ShoppingCart className="w-4 h-4" /> },
  { label: 'Account Settings', route: '/buyer/settings', icon: <Settings className="w-4 h-4" /> },
];

export function BuyerDashboardPage() {
  const { buyerOrders, wishlistIds, cartCount, navigate, user } = useStore();
  const totalSpent = buyerOrders.reduce((s, o) => s + o.total, 0);

  return (
    <DashboardLayout
      portalTitle="Buyer Dashboard"
      portalRole="buyer"
      breadcrumb="Home / Buyer / Dashboard"
      navItems={BUYER_NAV}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Orders</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {buyerOrders.length}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Cart Items</div>
          <div className="font-mono text-2xl font-bold text-[#F85606] mt-1 tabular-nums">
            {cartCount}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Saved Wishlist</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {wishlistIds.length}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Spent</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {formatRs(totalSpent)}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-lg font-bold text-[#18181B]">Recent Orders</h2>
          <button
            type="button"
            onClick={() => navigate('/buyer/orders')}
            className="text-xs font-semibold text-[#F85606] hover:underline cursor-pointer"
          >
            View All Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="py-2.5 pr-4 font-medium">Order ID</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 pl-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {buyerOrders.slice(0, 4).map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F4F5F7]/60">
                  <td className="py-3 pr-4 font-mono font-semibold text-[#18181B] tabular-nums">
                    {ord.id}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 tabular-nums">{ord.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        ord.status === 'Delivered'
                          ? 'text-emerald-700'
                          : ord.status === 'Shipped'
                            ? 'text-blue-700'
                            : 'text-amber-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right font-mono font-semibold tabular-nums">
                    {formatRs(ord.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Become a Seller Callout inside Buyer Dashboard */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#18181B]">
            {user?.isSellerApproved ? `Seller Storefront Active: ${user.storeName}` : 'Interested in Selling on BazaarLink?'}
          </h3>
          <p className="text-sm text-zinc-600 mt-1">
            Open your multi-vendor storefront and list products directly from Account Settings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/buyer/settings')}
          className="px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
        >
          {user?.isSellerApproved ? 'Manage Seller Setup' : 'Become a Seller'}
        </button>
      </div>
    </DashboardLayout>
  );
}

export function BuyerOrdersPage() {
  const { buyerOrders, navigate } = useStore();

  return (
    <DashboardLayout
      portalTitle="My Orders"
      portalRole="buyer"
      breadcrumb="Home / Buyer / Orders"
      navItems={BUYER_NAV}
    >
      <div className="space-y-4">
        {buyerOrders.map((order) => (
          <div key={order.id} className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#18181B] tabular-nums">{order.id}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-600 tabular-nums">{order.date}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-600">{order.paymentMethod}</span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  order.status === 'Delivered'
                    ? 'text-emerald-700'
                    : order.status === 'Shipped'
                      ? 'text-blue-700'
                      : 'text-amber-700'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-12 rounded-lg object-cover bg-[#F4F5F7] shrink-0"
                    />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${item.slug}`)}
                        className="text-sm font-semibold text-[#18181B] hover:text-[#F85606] truncate block text-left cursor-pointer"
                      >
                        {item.productName}
                      </button>
                      <div className="text-xs text-zinc-500 tabular-nums">
                        Qty {item.quantity} × {formatRs(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#18181B] tabular-nums shrink-0">
                    {formatRs(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
              <span>Ship to: {order.shippingAddress}</span>
              <span className="font-mono text-sm font-bold text-[#F85606] tabular-nums">
                Order Total: {formatRs(order.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export function BuyerWishlistPage() {
  const { products, wishlistIds, navigate } = useStore();
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <DashboardLayout
      portalTitle="My Wishlist"
      portalRole="buyer"
      breadcrumb="Home / Buyer / Wishlist"
      navItems={BUYER_NAV}
    >
      {savedProducts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#18181B]">Your wishlist is empty</p>
          <p className="text-sm text-zinc-600">Save products you want to compare or buy later.</p>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="px-4 py-2 rounded-lg bg-[#F85606] text-white text-sm font-semibold cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export function BuyerCartPage() {
  const {
    cart,
    cartSubtotal,
    updateCartQty,
    removeFromCart,
    placeOrder,
    navigate,
  } = useStore();
  const [address, setAddress] = useState('House 42-B, Gulberg III, Lahore');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const order = placeOrder(paymentMethod, address);
    setConfirmedOrderId(order.id);
  };

  return (
    <DashboardLayout
      portalTitle="Shopping Cart"
      portalRole="buyer"
      breadcrumb="Home / Buyer / Cart"
      navItems={BUYER_NAV}
    >
      {confirmedOrderId ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#18181B]">
            Order {confirmedOrderId} Confirmed — Preparing Shipment
          </h2>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Demo order recorded under your Buyer account. No real payment was charged.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/buyer/orders')}
              className="px-5 py-2.5 rounded-lg bg-[#F85606] text-white text-sm font-semibold cursor-pointer"
            >
              View My Orders
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-lg border border-zinc-200 text-sm font-semibold text-[#18181B] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#18181B]">Your shopping cart is empty</p>
          <p className="text-sm text-zinc-600">Add products from the storefront to preview checkout.</p>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="px-4 py-2 rounded-lg bg-[#F85606] text-white text-sm font-semibold cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          {/* Cart Items */}
          <div className="bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-100">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 rounded-lg object-cover bg-[#F4F5F7] shrink-0"
                  />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="font-display text-sm sm:text-base font-semibold text-[#18181B] hover:text-[#F85606] text-left truncate block cursor-pointer"
                    >
                      {product.name}
                    </button>
                    <div className="text-xs text-zinc-500 mt-0.5">{product.sellerName}</div>
                    <div className="font-mono text-sm font-bold text-[#F85606] mt-1 tabular-nums">
                      {formatRs(product.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="inline-flex items-center border border-zinc-200 rounded-lg bg-[#F4F5F7]">
                    <button
                      type="button"
                      onClick={() => updateCartQty(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                      className="p-2 text-zinc-700 hover:text-[#F85606] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(product.id, quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-2 text-zinc-700 hover:text-[#F85606] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="font-mono text-sm font-bold text-[#18181B] tabular-nums w-24 text-right">
                    {formatRs(product.price * quantity)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label="Remove item"
                    className="p-2 text-zinc-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Demo Checkout */}
          <form onSubmit={handleCheckout} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#18181B]">Order Summary</h2>

            <div className="space-y-2 text-sm border-b border-zinc-100 pb-4">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatRs(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Fee</span>
                <span className="font-mono text-emerald-700 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-[#18181B] pt-2 border-t border-zinc-100">
                <span>Total</span>
                <span className="font-mono text-lg text-[#F85606] tabular-nums">
                  {formatRs(cartSubtotal)}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="ship-addr" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Delivery Address
              </label>
              <input
                id="ship-addr"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
              />
            </div>

            <div>
              <label htmlFor="pay-method" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Payment Method (Demo)
              </label>
              <select
                id="pay-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[#F85606]"
              >
                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                <option value="Debit Card (Demo)">Debit Card (Demo)</option>
                <option value="Mobile Wallet (Demo)">Mobile Wallet (Demo)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Place Demo Order
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

export function BuyerSettingsPage() {
  const { user, updateUserProfile, upgradeBuyerToSeller, navigate } = useStore();
  const [name, setName] = useState(user?.name || 'Amina Tariq');
  const [email, setEmail] = useState(user?.email || 'amina.buyer@bazaarlink.demo');
  const [phone, setPhone] = useState(user?.phone || '+92 300 4182910');
  const [city, setCity] = useState(user?.city || 'Lahore');

  // Become a Seller Registration State
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [storeCategory, setStoreCategory] = useState(CATEGORIES[0].name);
  const [sellerPhone, setSellerPhone] = useState(phone);
  const [sellerCity, setSellerCity] = useState(city);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone, city });
  };

  const handleBecomeSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    upgradeBuyerToSeller({
      storeName: storeName.trim(),
      storeCategory,
      phone: sellerPhone,
      city: sellerCity,
    });
    navigate('/seller/dashboard');
  };

  return (
    <DashboardLayout
      portalTitle="Account Settings"
      portalRole="buyer"
      breadcrumb="Home / Buyer / Settings"
      navItems={BUYER_NAV}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Buyer Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#18181B]">Profile Information</h2>

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
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email Address</label>
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
            className="px-5 py-2.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 text-white text-sm font-semibold cursor-pointer"
          >
            Save Profile Changes
          </button>
        </form>

        {/* Become a Seller Registration Interface */}
        <form onSubmit={handleBecomeSeller} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F85606]/10 text-[#F85606] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#18181B]">Become a Seller</h2>
              <p className="text-xs text-zinc-500">Register your multi-vendor store on BazaarLink</p>
            </div>
          </div>

          <div>
            <label htmlFor="seller-store-name" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Store Name
            </label>
            <input
              id="seller-store-name"
              type="text"
              required
              placeholder="e.g. Amina Home Studio"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="seller-cat" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Primary Product Category
            </label>
            <select
              id="seller-cat"
              value={storeCategory}
              onChange={(e) => setStoreCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[#F85606]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Business Phone</label>
              <input
                type="text"
                required
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Dispatch City</label>
              <input
                type="text"
                required
                value={sellerCity}
                onChange={(e) => setSellerCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Activate Seller Storefront & Go to Dashboard
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
